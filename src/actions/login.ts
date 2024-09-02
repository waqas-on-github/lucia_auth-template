"use server";
import { baseSchema } from "@/schema/schema";
import { z } from "zod";
import { checkIfEmailExists } from "./signup";
import argon2 from "argon2";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export const logIn = async (inputData: z.infer<typeof baseSchema>) => {
  try {
    const result = baseSchema.safeParse(inputData);

    if (result.error) {
      return {
        success: false,
        data: null,
        error: { message: "invalid data" },
      };
    }

    /// check email existance
    const user = await checkIfEmailExists(result.data.email);
    // if email dont exists
    if (!user || !user.email) {
      return {
        success: false,
        data: null,
        error: { message: "invalid crediantials " },
      };
    }
    // if email exists  verify password
    if (user && user.password) {
      const isCorrectPassword = await argon2.verify(
        user?.password,
        result.data.password
      );
      // if we faile to verify password
      if (!isCorrectPassword) {
        return {
          success: false,
          error: { message: "invalid cidantials " },
          data: null,
        };
      }

      // if password is correct we will reach here so we will set cookies
      const session = await lucia.createSession(user?.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return {
        success: true,
        data: { email: user.email, id: user.id },
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: { message: "failed to login user" },
    };
  }
};
