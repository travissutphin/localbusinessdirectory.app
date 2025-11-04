import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { requireAuth } from '@/lib/auth-utils'

/**
 * POST /api/upload
 * Upload image to Cloudinary
 * Requires authentication
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Require authentication
    await requireAuth()

    const body = await req.json()
    const { file, folder } = body

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file is base64 encoded image
    if (!file.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid file format. Must be an image.' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, folder || 'businesses')

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (error) {
    console.error('Upload API error:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
