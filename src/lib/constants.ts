export const TIPOS_PROPIEDAD = [
  "Casa",
  "Departamento",
  "PH",
  "Terreno",
  "Local comercial",
  "Oficina",
  "Galpón",
  "Cochera",
] as const;

export const OPERACIONES = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
] as const;

export const MONEDAS = [
  { value: "USD", label: "USD" },
  { value: "ARS", label: "ARS" },
] as const;

export const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

export const ANTIGUEDADES = [
  { value: "a_estrenar", label: "A estrenar" },
  { value: "anos", label: "Años de antigüedad" },
  { value: "en_construccion", label: "En construcción" },
] as const;

export const ITEMS_PER_PAGE = 12;

export const ADMIN_ITEMS_PER_PAGE = 50;
export const ADMIN_PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export const ADMIN_SORTABLE_COLUMNS: Record<string, string> = {
  titulo: "titulo",
  operacion: "operacion",
  tipo: "tipo_propiedad",
  precio: "precio",
  ciudad: "ciudad",
  activa: "activa",
  fecha_alta: "fecha_alta",
  fecha_archivada: "fecha_archivada",
};

export const SITE_NAME = "Matias Perez Inmuebles";
export const SITE_DESCRIPTION =
  "Encontrá tu próximo hogar. Propiedades en venta y alquiler.";
