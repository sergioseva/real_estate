"use server";

import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", CONTACT_KEYS);

  const result = { ...DEFAULTS };
  if (data) {
    for (const row of data) {
      if (row.key in result) {
        result[row.key as keyof ContactInfo] = row.value;
      }
    }
  }
  return result;
}

export async function updateContactInfo(formData: FormData) {
  const supabase = await createClient();

  const updates = CONTACT_KEYS.map((key) => ({
    key,
    value: (formData.get(key) as string) || DEFAULTS[key],
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(updates, { onConflict: "key" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
