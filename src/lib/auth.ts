import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import type { NextAuthConfig } from "next-auth";

export type UserRole = "learner" | "instructor" | "company_admin" | "admin";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        companyId: user.companyId,
      };
    },
  }),
];

// Google sign-in is optional — only wired up when credentials are provided,
// so the app runs fine without a Google Cloud project configured.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: UserRole }).role ?? "learner";
        token.companyId = (user as { companyId?: string | null }).companyId ?? null;
      }

      // New OAuth sign-ins won't have a role from `authorize`, so fetch it.
      if (!user && token.email && !token.role) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email))
          .limit(1);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.companyId = dbUser.companyId;
        }
      }

      // Allow client-side session.update() to refresh role/companyId after
      // e.g. an admin promotes a user or a company is created for them.
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.companyId = session.companyId ?? token.companyId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.companyId = (token.companyId as string | null) ?? null;
      }
      return session;
    },
  },
});

/**
 * Fetch the current session's user, or `null` if signed out.
 * Use this in Server Components, Server Actions and Route Handlers.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Throws if there is no signed-in user. Returns the user otherwise.
 * Call at the top of any protected Server Action / page.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/**
 * Throws if the signed-in user does not have one of the allowed roles.
 */
export async function requireRole(...roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
