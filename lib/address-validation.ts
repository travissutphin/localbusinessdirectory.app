export type AddressValidationResult = {
  isValid: boolean
  lat?: number
  lng?: number
  displayName?: string
  error?: string
}

export async function validateAddress(
  address: string,
  city?: string | null,
  locationName?: string,
  zipCode?: string | null
): Promise<AddressValidationResult> {
  const parts = [address, city, locationName, zipCode].filter(Boolean)
  const fullAddress = parts.join(', ')

  if (!fullAddress.trim()) {
    return { isValid: false, error: 'Address is required' }
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FrontDoorDirectory/1.0 (https://frontdoordirectory.com)',
        },
      }
    )

    if (!response.ok) {
      return { isValid: false, error: 'Unable to verify address at this time' }
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      return {
        isValid: true,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      }
    }

    return {
      isValid: false,
      error: 'Address could not be verified. Please check the address and try again.',
    }
  } catch (err) {
    console.error('Address validation error:', err)
    return {
      isValid: false,
      error: 'Unable to verify address. Please try again.',
    }
  }
}
