import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        duplicateFlag: false,
        potentialDuplicates: [],
        duplicateNotes: null,
      },
    })

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error clearing duplicate flag:', error)
    return NextResponse.json(
      { error: 'Failed to clear duplicate flag' },
      { status: 500 }
    )
  }
}
