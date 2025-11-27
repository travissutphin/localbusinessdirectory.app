import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkForDuplicates } from '@/lib/duplicate-detection'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, locationId, excludeBusinessId } = body

    if (!name || !locationId) {
      return NextResponse.json(
        { error: 'Name and locationId are required' },
        { status: 400 }
      )
    }

    const result = await checkForDuplicates(name, locationId, excludeBusinessId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error checking for duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    )
  }
}
