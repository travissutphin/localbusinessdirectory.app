import { auth } from "./auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
  return user
}

export async function requireOwner() {
  const user = await requireAuth()
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw new Error("Forbidden: Owner or Admin access required")
  }
  return user
}
