"use server";

import { z } from "zod";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function login(prevState: any, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  // 1. Validate Input
  const validated = credentialsSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  try {
    // 2. Attempt Login
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // 3. Handle Errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: { root: ["Invalid credentials"] } };
        default:
          return { error: { root: ["Something went wrong"] } };
      }
    }
    // NEVER catch the redirect error thrown by Next.js
    throw error;
  }
}
