import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Upload image to Cloudinary
 * @param file - Base64 encoded image or file path
 * @param folder - Folder path in Cloudinary (default: 'businesses')
 * @returns Upload result with secure_url
 */
export async function uploadImage(file: string, folder: string = 'businesses') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' }, // Max dimensions
        { quality: 'auto:good' }, // Automatic quality optimization
        { fetch_format: 'auto' }, // Automatic format selection (WebP, etc.)
      ],
    })

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Deletion result
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: result.result === 'ok',
      result: result.result,
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - The public ID of the image
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
    secure: true,
  })
}

export default cloudinary
