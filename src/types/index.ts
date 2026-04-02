export interface Property {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  precio: number;
  moneda: "ARS" | "USD";
  operacion: "venta" | "alquiler";
  tipo_propiedad: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  dormitorios: number;
  banos: number;
  ambientes: number;
  toilettes: number;
  cocheras: number;
  superficie_cubierta: number;
  superficie_total: number;
  antiguedad: "a_estrenar" | "anos" | "en_construccion";
  antiguedad_anos: number;
  expensas: number;
  expensas_moneda: "ARS" | "USD";
  apto_credito: boolean;
  latitud: number | null;
  longitud: number | null;
  amenities: string[];
  destacada: boolean;
  activa: boolean;
  archivada: boolean;
  vendida: boolean;
  fecha_alta: string;
  fecha_archivada: string | null;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path: string;
  url: string;
  display_order: number;
  descripcion: string;
}

export interface TasacionRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export interface ContactInfo {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
}

export interface PropertyFilters {
  operacion?: string;
  tipo_propiedad?: string;
  ciudad?: string;
  precio_min?: number;
  precio_max?: number;
  dormitorios?: number;
  ambientes?: number;
  search?: string;
  page?: number;
}
