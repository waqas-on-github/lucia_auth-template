"use server";
import { baseSchema } from "@/schema/schema";
import { z } from "zod";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export const signUp = async (inputData: z.infer<typeof baseSchema>) => {
  try {
    // Validate and sanitize data
    const result = baseSchema.safeParse(inputData);

    if (result.error) {
      return {
        success: false,
        error: { message: "invalid data " },
        data: null,
      };
    }
    // Check if email exists
    if (await checkIfEmailExists(result.data.email)) {
      return {
        success: false,
        error: { message: "Email already exists" },
        data: null,
      };
    }

    // Hash password and create user
    const hashedPassword = await argon2.hash(result.data.password);
    const newUser = await createUser(result.data.email, hashedPassword);

    // Create session and set cookies
    const session = await createAndSetSession(newUser.id);

    return {
      success: true,
      error: null,
      data: session,
    };
  } catch (error: any) {
    console.error("SignUp Error: ", error);
    return {
      success: false,
      error: { message: error.message || "Failed to create account" },
      data: null,
    };
  }
};

const createAndSetSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return session;
};

export const checkIfEmailExists = async (email: string) => {

  return await db.user.findUnique({ where: { email } });
};

const createUser = async (email: string, password: string) => {
  return await db.user.create({
    data: { email, password },
  });
};
