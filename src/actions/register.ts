"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
});

export async function register(prevState: any, formData: FormData) {
    const raw = Object.fromEntries(formData.entries());

    // 1. Validate Input
    const validated = registerSchema.safeParse(raw);
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const { email, password, name, username } = validated.data;

    // 2. Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        return { error: { root: ["User with this email already exists"] } };
    }

    // 3. Check if username is taken
    const existingUsername = await db.query.users.findFirst({
        where: eq(users.username, username),
    });

    if (existingUsername) {
        return { error: { root: ["Username is already taken"] } };
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Create user
    await db.insert(users).values({
        id: generateId(),
        email,
        name,
        username,
        passwordHash,
        role: "user",
    });

    redirect("/login");
}
