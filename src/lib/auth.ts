import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/lib/db";
import { TimeSpan } from "lucia";

const adapter = new PrismaAdapter(db?.session, db?.user);
// initilize new lucia instance
export const lucia = new Lucia(adapter, {
  // cookies opetion confugrable
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  sessionExpiresIn: new TimeSpan(10, "s"),
});

// !IMPORTENT

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    // next.js throws when you attempt to set cookie when rendering page
    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {} // todo DO PROPER ERROR HANDLING
    return result;
  }
);
