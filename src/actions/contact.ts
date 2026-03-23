"use server";

import { Resend } from "resend";
import { getContactInfo } from "./settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const telefono = (formData.get("telefono") as string) || "No proporcionado";
  const mensaje = formData.get("mensaje") as string;

  if (!nombre || !email || !mensaje) {
    return { error: "Todos los campos obligatorios deben completarse." };
  }

  const contactInfo = await getContactInfo();

  const { error } = await resend.emails.send({
    from: `Sitio Web <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
    to: contactInfo.contact_email,
    subject: `Nueva consulta de ${nombre}`,
    replyTo: email,
    text: [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Telefono: ${telefono}`,
      "",
      "Mensaje:",
      mensaje,
    ].join("\n"),
  });

  if (error) {
    return { error: "No se pudo enviar el mensaje. Intenta de nuevo." };
  }

  return { success: true };
}
