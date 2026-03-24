"use server";

import { queryOne } from "@/lib/db";
import { verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await queryOne<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM admin_users WHERE email = $1",
    [email]
  );

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Email o contraseña incorrectos" };
  }

  await createSession(user.id, email);
  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
