import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import type { AdapterUser } from "next-auth/adapters"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

export const authConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),

    // Email/Password Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: AdapterUser | null }) {
      if (user) {
        token.id = user.id
        // Fetch role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        })
        token.role = dbUser?.role || "OWNER"
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },

    async signIn({ user, account }: { user: AdapterUser; account: any }) {
      // For OAuth providers, ensure user has correct defaults
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser && !existingUser.authProvider) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                authProvider: account.provider,
                providerId: account.providerAccountId,
              }
            })
          }
        } catch (error) {
          console.error("Error during sign in:", error)
        }
      }

      return true
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
} as NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
