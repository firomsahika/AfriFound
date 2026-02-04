"use server";

import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  getCurrentUser,
} from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  const { name, email, password, role } = validated.data;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as "FOUNDER" | "INVESTOR" | "DEVELOPER" | "MENTOR",
    },
  });

  // Generate tokens
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  // Store refresh token in database
  await db.session.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Set cookies
  await setAuthCookies(accessToken, refreshToken);

  return {
    success: true,
    message: "Account created successfully",
  };
}

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  const { email, password } = validated.data;

  // Find user
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  // Store refresh token
  await db.session.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Set cookies
  await setAuthCookies(accessToken, refreshToken);

  return {
    success: true,
    message: "Logged in successfully",
  };
}

export async function logout() {
  const user = await getCurrentUser();

  if (user) {
    // Delete all sessions for this user
    await db.session.deleteMany({
      where: { userId: user.id },
    });
  }

  await clearAuthCookies();
  redirect("/");
}

export async function getSession() {
  const user = await getCurrentUser();
  return user;
}
