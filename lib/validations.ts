import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim(),
  locationId: z.string().uuid('Invalid location ID'),
  directoryId: z.string().uuid('Invalid directory ID'),
  city: z.string().max(100).trim().optional().nullable(),
  zipCode: z.string().max(20).trim().optional().nullable(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .trim(),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Invalid phone number format')
    .max(30)
    .optional()
    .nullable()
    .or(z.literal('')),
  email: z.string()
    .email('Invalid email address')
    .max(100),
  website: z.string()
    .url('Invalid website URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  facebookUrl: z.string()
    .url('Invalid Facebook URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  instagramUrl: z.string()
    .url('Invalid Instagram URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  linkedinUrl: z.string()
    .url('Invalid LinkedIn URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  twitterUrl: z.string()
    .url('Invalid Twitter URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  youtubeUrl: z.string()
    .url('Invalid YouTube URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  googleBusinessUrl: z.string()
    .url('Invalid Google Business URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  tiktokUrl: z.string()
    .url('Invalid TikTok URL')
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  hoursJson: z.any().optional().nullable(),
  imageUrl: z.string().url().max(500).optional().nullable(),
  duplicateFlag: z.boolean().optional(),
  potentialDuplicates: z.array(z.string()).optional(),
})

export const businessUpdateSchema = businessSchema.partial().extend({
  name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters')
    .trim()
    .optional(),
})

export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(100),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  name: z.string()
    .min(1)
    .max(100)
    .trim()
    .optional()
    .nullable(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
})

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type BusinessInput = z.infer<typeof businessSchema>
export type BusinessUpdateInput = z.infer<typeof businessUpdateSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type EmailInput = z.infer<typeof emailSchema>
