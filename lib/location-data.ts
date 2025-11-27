// Location data with cities and zip codes
// This data is used for business registration forms

export type CityZipData = {
  city: string
  zipCodes: { code: string; area: string }[]
}

export type LocationData = {
  locationId: string
  locationName: string
  cities: CityZipData[]
}

// Saint Augustine, FL zip codes
// Sources: https://www.zip-codes.com/city/fl-saint-augustine.asp
export const locationZipCodes: Record<string, LocationData> = {
  'saint-augustine-fl': {
    locationId: 'saint-augustine-fl',
    locationName: 'Saint Augustine, FL',
    cities: [
      {
        city: 'Saint Augustine',
        zipCodes: [
          { code: '32080', area: 'Anastasia Island / Beach Area' },
          { code: '32084', area: 'Historic Downtown' },
          { code: '32086', area: 'South St. Augustine' },
          { code: '32092', area: 'World Golf Village Area' },
          { code: '32095', area: 'North St. Augustine' },
        ],
      },
    ],
  },
}

// Helper function to get zip codes for a location by slug
export function getZipCodesForLocation(locationSlug: string): CityZipData[] | null {
  const data = locationZipCodes[locationSlug]
  return data ? data.cities : null
}

// Helper function to get all zip codes as flat array for a location
export function getAllZipCodesForLocation(locationSlug: string): string[] {
  const data = locationZipCodes[locationSlug]
  if (!data) return []

  return data.cities.flatMap(city => city.zipCodes.map(z => z.code))
}

// Helper function to validate a zip code belongs to a location
export function isValidZipForLocation(locationSlug: string, zipCode: string): boolean {
  const validZips = getAllZipCodesForLocation(locationSlug)
  return validZips.includes(zipCode)
}

// Helper function to get city name from zip code
export function getCityFromZip(locationSlug: string, zipCode: string): string | null {
  const data = locationZipCodes[locationSlug]
  if (!data) return null

  for (const cityData of data.cities) {
    const found = cityData.zipCodes.find(z => z.code === zipCode)
    if (found) return cityData.city
  }
  return null
}

// Helper to get default city if location has only one
export function getDefaultCity(locationSlug: string): string | null {
  const data = locationZipCodes[locationSlug]
  if (!data) return null

  if (data.cities.length === 1) {
    return data.cities[0].city
  }
  return null
}
