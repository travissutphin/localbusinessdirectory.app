import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "./db"
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import type { AdapterUser } from "next-auth/adapters"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import { createEmailService } from "./email-factory"
import { getMagicLinkEmailHtml, getMagicLinkEmailText } from "./email-templates"

export const authConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Magic Link Email Provider
    EmailProvider({
      server: process.env.EMAIL_SERVER || "smtp://resend:placeholder@smtp.resend.com:587",
      from: process.env.EMAIL_FROM || "My Home Based Business <noreply@myhbb.app>",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const emailService = createEmailService()
        const result = await emailService.send({
          from: process.env.EMAIL_FROM || "My Home Based Business <noreply@myhbb.app>",
          to: email,
          subject: "Sign in to My Home Based Business",
          html: getMagicLinkEmailHtml(url),
          text: getMagicLinkEmailText(url),
        })

        if (result.error) {
          console.error("Failed to send magic link email:", result.error)
          throw new Error("Failed to send verification email")
        }

        console.log(`Magic link email sent to ${email}`)
      },
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
      // For email provider, set authProvider
      if (account?.provider === "email") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser && !existingUser.authProvider) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                authProvider: "email",
                emailVerified: new Date(),
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
    maxAge: 24 * 60 * 60, // 24 hours - reduced for security
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
} as NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
