"use server";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const { email, password } = credentialsSchema.parse(raw);
  await signIn("credentials", {
    redirectTo: "/admin",
    email,
    password,
  });
}

