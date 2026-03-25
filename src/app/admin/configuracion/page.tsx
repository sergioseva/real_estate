import { getContactInfo, updateContactInfo } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Configuracion",
};

export default async function ConfiguracionPage() {
  const contactInfo = await getContactInfo();

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateContactInfo(formData);
    redirect("/admin/dashboard?saved=1");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Configuracion</h1>
      <p className="text-muted-foreground">
        Datos de contacto del sitio
      </p>

      <form action={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <div className="rounded-lg border border-border bg-white p-4 shadow-sm space-y-4">
          <Input
            id="contact_phone"
            name="contact_phone"
            label="Telefono"
            defaultValue={contactInfo.contact_phone}
            placeholder="+54 9 11 1234-5678"
            required
          />
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            label="Email"
            defaultValue={contactInfo.contact_email}
            placeholder="info@ejemplo.com"
            required
          />
          <Input
            id="contact_address"
            name="contact_address"
            label="Direccion"
            defaultValue={contactInfo.contact_address}
            placeholder="Buenos Aires, Argentina"
            required
          />
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            label="Numero de WhatsApp (sin +, sin espacios)"
            defaultValue={contactInfo.whatsapp_number}
            placeholder="5491112345678"
            required
          />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  );
}
