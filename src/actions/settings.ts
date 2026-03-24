"use server";

import { query } from "@/lib/db";
import type { ContactInfo } from "@/types";
import { revalidatePath } from "next/cache";

const CONTACT_KEYS: (keyof ContactInfo)[] = [
  "contact_phone",
  "contact_email",
  "contact_address",
  "whatsapp_number",
];

const DEFAULTS: ContactInfo = {
  contact_phone: "+54 9 11 1234-5678",
  contact_email: "info@matiasperezinmuebles.com",
  contact_address: "Buenos Aires, Argentina",
  whatsapp_number: "5491112345678",
};

export async function getContactInfo(): Promise<ContactInfo> {
  const rows = await query<{ key: string; value: string }>(
    "SELECT key, value FROM site_settings WHERE key = ANY($1)",
    [CONTACT_KEYS]
  );

  const result = { ...DEFAULTS };
  for (const row of rows) {
    if (row.key in result) {
      result[row.key as keyof ContactInfo] = row.value;
    }
  }
  return result;
}

export async function updateContactInfo(formData: FormData) {
  for (const key of CONTACT_KEYS) {
    const value = (formData.get(key) as string) || DEFAULTS[key];
    await query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
      [key, value]
    );
  }

  revalidatePath("/", "layout");
  return { success: true };
}
