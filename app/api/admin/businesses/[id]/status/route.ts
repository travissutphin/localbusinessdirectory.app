import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendBusinessStatusEmail } from '@/lib/email'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejectionReason, adminNotes } = body

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, APPROVED, or REJECTED' },
        { status: 400 }
      )
    }

    if (status === 'REJECTED' && (!rejectionReason || !rejectionReason.trim())) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a business' },
        { status: 400 }
      )
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { email: true, name: true }
        },
        location: {
          select: { name: true, slug: true }
        },
        directory: {
          select: { name: true, slug: true }
        }
      }
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const previousStatus = existingBusiness.status

    const updateData: any = {
      status,
    }

    if (status === 'APPROVED') {
      updateData.approvedAt = new Date()
      updateData.approvedBy = session.user.id
      updateData.rejectionReason = null
    } else if (status === 'REJECTED') {
      updateData.rejectionReason = rejectionReason.trim()
      updateData.approvedAt = null
      updateData.approvedBy = null
    } else if (status === 'PENDING') {
      updateData.approvedAt = null
      updateData.approvedBy = null
      updateData.rejectionReason = null
    }

    const business = await prisma.business.update({
      where: { id: params.id },
      data: updateData,
      include: {
        location: {
          select: { name: true, slug: true }
        },
        directory: {
          select: { name: true, slug: true }
        },
        owner: {
          select: { name: true, email: true }
        }
      }
    })

    let emailSent = false
    if (previousStatus !== status && existingBusiness.owner.email) {
      try {
        const publicUrl = `https://myhbb.app/${business.location.slug}/${business.directory.slug}/${business.slug || business.id}`
        const editUrl = `https://myhbb.app/dashboard/businesses/${business.id}/edit`

        await sendBusinessStatusEmail(
          existingBusiness.owner.email,
          existingBusiness.owner.name || 'Business Owner',
          business.name,
          status as 'PENDING' | 'APPROVED' | 'REJECTED',
          {
            rejectionReason: rejectionReason?.trim(),
            publicUrl,
            editUrl
          }
        )
        emailSent = true
      } catch (emailError) {
        console.error('Failed to send status change email:', emailError)
      }
    }

    return NextResponse.json({
      business,
      previousStatus,
      emailSent
    })
  } catch (error) {
    console.error('Error updating business status:', error)
    return NextResponse.json(
      { error: 'Failed to update business status' },
      { status: 500 }
    )
  }
}
