import { prisma } from './db'

export interface DuplicateMatch {
  businessId: string
  businessName: string
  ownerEmail: string
  similarity: number
  matchType: 'exact' | 'similar' | 'partial'
}

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length

  if (m === 0) return n
  if (n === 0) return m

  const matrix: number[][] = []

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[m][n]
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function calculateSimilarity(name1: string, name2: string): number {
  const normalized1 = normalizeName(name1)
  const normalized2 = normalizeName(name2)

  if (normalized1 === normalized2) {
    return 100
  }

  const maxLength = Math.max(normalized1.length, normalized2.length)
  if (maxLength === 0) return 0

  const distance = levenshteinDistance(normalized1, normalized2)
  return Math.round((1 - distance / maxLength) * 100)
}

function getMatchType(similarity: number, normalized1: string, normalized2: string): 'exact' | 'similar' | 'partial' {
  if (similarity === 100) return 'exact'
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return 'partial'
  return 'similar'
}

export async function findPotentialDuplicates(
  name: string,
  locationId: string,
  excludeBusinessId?: string,
  threshold: number = 70
): Promise<DuplicateMatch[]> {
  const businesses = await prisma.business.findMany({
    where: {
      locationId,
      ...(excludeBusinessId ? { id: { not: excludeBusinessId } } : {})
    },
    select: {
      id: true,
      name: true,
      owner: {
        select: {
          email: true
        }
      }
    }
  })

  const normalizedInput = normalizeName(name)
  const matches: DuplicateMatch[] = []

  for (const business of businesses) {
    const similarity = calculateSimilarity(name, business.name)
    const normalizedBusiness = normalizeName(business.name)

    if (similarity >= threshold || normalizedInput.includes(normalizedBusiness) || normalizedBusiness.includes(normalizedInput)) {
      matches.push({
        businessId: business.id,
        businessName: business.name,
        ownerEmail: business.owner.email,
        similarity,
        matchType: getMatchType(similarity, normalizedInput, normalizedBusiness)
      })
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity)
}

export async function checkForDuplicates(
  name: string,
  locationId: string,
  excludeBusinessId?: string
): Promise<{ hasDuplicates: boolean; matches: DuplicateMatch[] }> {
  const matches = await findPotentialDuplicates(name, locationId, excludeBusinessId)
  return {
    hasDuplicates: matches.length > 0,
    matches
  }
}

export async function flagBusinessAsDuplicate(
  businessId: string,
  duplicateIds: string[],
  notes?: string
): Promise<void> {
  await prisma.business.update({
    where: { id: businessId },
    data: {
      duplicateFlag: true,
      potentialDuplicates: duplicateIds,
      duplicateNotes: notes
    }
  })
}

export async function clearDuplicateFlag(businessId: string): Promise<void> {
  await prisma.business.update({
    where: { id: businessId },
    data: {
      duplicateFlag: false,
      potentialDuplicates: [],
      duplicateNotes: null
    }
  })
}
