'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Facebook, Instagram, Linkedin, Twitter, Youtube, MapPin, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { locationZipCodes, type CityZipData } from '@/lib/location-data'
import { validateAddress, type AddressValidationResult } from '@/lib/address-validation'

export const dynamic = 'force-dynamic'

export default function EditBusinessPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [cityZipData, setCityZipData] = useState<CityZipData[]>([])
  const [locationSlug, setLocationSlug] = useState('')
  const [locationName, setLocationName] = useState('')
  const [addressValidation, setAddressValidation] = useState<AddressValidationResult | null>(null)
  const [validatingAddress, setValidatingAddress] = useState(false)
  const [addressWarningDismissed, setAddressWarningDismissed] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    zipCode: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    googleBusinessUrl: '',
    tiktokUrl: '',
    hoursJson: '',
    imageUrl: '',
  })

  useEffect(() => {
    checkAuth()
    fetchBusiness()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/')
      }
    } catch (err) {
      router.push('/')
    }
  }

  async function fetchBusiness() {
    try {
      const response = await fetch(`/api/businesses/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch business')

      const data = await response.json()
      const business = data.business

      // Set location slug/name and load city/zip data
      if (business.location?.slug) {
        setLocationSlug(business.location.slug)
        setLocationName(business.location.name || '')
        const zipData = locationZipCodes[business.location.slug]
        if (zipData) {
          setCityZipData(zipData.cities)
        }
      }

      setFormData({
        name: business.name || '',
        description: business.description || '',
        city: business.city || '',
        zipCode: business.zipCode || '',
        address: business.address || '',
        phone: business.phone || '',
        email: business.email || '',
        website: business.website || '',
        facebookUrl: business.facebookUrl || '',
        instagramUrl: business.instagramUrl || '',
        linkedinUrl: business.linkedinUrl || '',
        twitterUrl: business.twitterUrl || '',
        youtubeUrl: business.youtubeUrl || '',
        googleBusinessUrl: business.googleBusinessUrl || '',
        tiktokUrl: business.tiktokUrl || '',
        hoursJson: typeof business.hoursJson === 'string' ? business.hoursJson : JSON.stringify(business.hoursJson, null, 2) || '',
        imageUrl: business.imageUrl || '',
      })

      // Set existing image as preview if it exists
      if (business.imageUrl) {
        setImagePreview(business.imageUrl)
      }
    } catch (err) {
      setError('Failed to load business details')
    } finally {
      setLoading(false)
    }
  }

  async function handleValidateAddress() {
    if (!formData.address) return

    setValidatingAddress(true)
    setAddressValidation(null)

    const result = await validateAddress(
      formData.address,
      formData.city,
      locationName,
      formData.zipCode
    )

    setAddressValidation(result)
    setValidatingAddress(false)
    setAddressWarningDismissed(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validate address if not already validated
    if (!addressValidation && formData.address) {
      setValidatingAddress(true)
      const result = await validateAddress(
        formData.address,
        formData.city,
        locationName,
        formData.zipCode
      )
      setAddressValidation(result)
      setValidatingAddress(false)

      if (!result.isValid && !addressWarningDismissed) {
        setSubmitting(false)
        return
      }
    }

    if (addressValidation && !addressValidation.isValid && !addressWarningDismissed) {
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/businesses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update business')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to update business. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        const base64 = reader.result as string
        setImagePreview(base64)

        // Upload to Cloudinary
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, folder: 'businesses' }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        // Update form data with Cloudinary URL
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        setUploading(false)
      }

      reader.onerror = () => {
        setError('Failed to read image file')
        setUploading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      setUploading(false)
    }
  }

  function removeImage() {
    setFormData(prev => ({ ...prev, imageUrl: '' }))
    setImagePreview('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Edit Business</h1>
            <a
              href="/dashboard"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> Editing your business will reset its status to &quot;Pending Review&quot; and require admin re-approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Business Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Business Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* City & Zip Code */}
          {cityZipData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={(e) => {
                    handleChange(e)
                    setFormData(prev => ({ ...prev, zipCode: '' }))
                  }}
                  disabled={cityZipData.length === 1}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-70"
                >
                  {cityZipData.length === 1 ? (
                    <option value={cityZipData[0].city}>{cityZipData[0].city}</option>
                  ) : (
                    <>
                      <option value="">Select city</option>
                      {cityZipData.map(cityData => (
                        <option key={cityData.city} value={cityData.city}>
                          {cityData.city}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-slate-300 mb-2">
                  ZIP Code <span className="text-red-400">*</span>
                </label>
                <select
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select ZIP code</option>
                  {cityZipData.length === 1
                    ? cityZipData[0].zipCodes.map(zip => (
                        <option key={zip.code} value={zip.code}>
                          {zip.code} - {zip.area}
                        </option>
                      ))
                    : formData.city && cityZipData
                        .find(c => c.city === formData.city)
                        ?.zipCodes.map(zip => (
                          <option key={zip.code} value={zip.code}>
                            {zip.code} - {zip.area}
                          </option>
                        ))
                  }
                </select>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
              Street Address <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={(e) => {
                  handleChange(e)
                  setAddressValidation(null)
                  setAddressWarningDismissed(false)
                }}
                className={`flex-1 px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  addressValidation?.isValid ? 'border-green-500' : addressValidation && !addressValidation.isValid ? 'border-yellow-500' : 'border-slate-600'
                }`}
                placeholder="123 Main Street"
              />
              <button
                type="button"
                onClick={handleValidateAddress}
                disabled={!formData.address || validatingAddress}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {validatingAddress ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Verify
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">Enter your street address only (city and ZIP selected above)</p>

            {/* Address Validation Result */}
            {addressValidation && (
              <div className={`mt-3 p-3 rounded-lg ${addressValidation.isValid ? 'bg-green-900/30 border border-green-700' : 'bg-yellow-900/30 border border-yellow-700'}`}>
                {addressValidation.isValid ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-400 font-medium text-sm">Address verified</p>
                      <p className="text-green-300/70 text-xs mt-1">{addressValidation.displayName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-yellow-400 font-medium text-sm">Address could not be verified</p>
                      <p className="text-yellow-300/70 text-xs mt-1">{addressValidation.error}</p>
                      {!addressWarningDismissed && (
                        <button
                          type="button"
                          onClick={() => setAddressWarningDismissed(true)}
                          className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 underline"
                        >
                          Continue anyway with this address
                        </button>
                      )}
                      {addressWarningDismissed && (
                        <p className="mt-2 text-xs text-yellow-300">You can proceed with submission.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Social Media URLs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Social Media (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Facebook className="w-5 h-5 text-blue-500" />
                </div>
                <input
                  type="url"
                  id="facebookUrl"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Facebook URL"
                />
              </div>

              {/* Instagram */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Instagram URL"
                />
              </div>

              {/* LinkedIn */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="LinkedIn URL"
                />
              </div>

              {/* Twitter/X */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </div>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Twitter/X URL"
                />
              </div>

              {/* YouTube */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <input
                  type="url"
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="YouTube Channel URL"
                />
              </div>

              {/* TikTok */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300 font-bold text-sm">
                    TT
                  </div>
                </div>
                <input
                  type="url"
                  id="tiktokUrl"
                  name="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="TikTok URL"
                />
              </div>

              {/* Google Business Profile */}
              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <input
                  type="url"
                  id="googleBusinessUrl"
                  name="googleBusinessUrl"
                  value={formData.googleBusinessUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Google Business Profile URL"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mb-6">
            <label htmlFor="hoursJson" className="block text-sm font-medium text-slate-300 mb-2">
              Business Hours (Optional)
            </label>
            <textarea
              id="hoursJson"
              name="hoursJson"
              rows={4}
              value={formData.hoursJson}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Business Image (Optional)
            </label>

            {!formData.imageUrl && !imagePreview ? (
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 text-sm">Uploading image...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-slate-300 font-medium mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-slate-400 text-sm">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative border border-slate-600 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-32 h-32 bg-slate-900 rounded-lg overflow-hidden">
                    {imagePreview || formData.imageUrl ? (
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Business preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 font-medium mb-1">
                      {imagePreview && !formData.imageUrl.includes('cloudinary') ? 'Image uploaded successfully' : 'Current image'}
                    </p>
                    <p className="text-slate-400 text-sm break-all">
                      {formData.imageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Image will be automatically optimized and delivered via CDN
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  )
}
