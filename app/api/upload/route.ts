import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { requireAuth } from '@/lib/auth-utils'
import { rateLimit, getClientIp, createRateLimitResponse } from '@/lib/rate-limit'

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export async function POST(req: NextRequest): Promise<Response> {
  let response: Response;

  try {
    const clientIp = getClientIp(req)
    const rateLimitResult = rateLimit(clientIp, 'upload')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        createRateLimitResponse(rateLimitResult.resetIn),
        { status: 429 }
      )
    }

    await requireAuth()

    const body = await req.json()
    const { file, folder } = body

    if (!file) {
      response = NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
      return response
    }

    if (!file.startsWith('data:image/')) {
      response = NextResponse.json(
        { error: 'Invalid file format. Must be an image.' },
        { status: 400 }
      )
      return response
    }

    const base64Data = file.split(',')[1] || file
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4)

    if (sizeInBytes > MAX_FILE_SIZE_BYTES) {
      response = NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
        { status: 413 }
      )
      return response
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, folder || 'businesses')

    if (!result.success) {
      response = NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
      return response
    }

    response = NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    })
    return response
  } catch (error) {
    console.error('Upload API error:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
      return response
    }

    response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    return response
  }
}
