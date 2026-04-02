export function SoldRibbon({ operacion }: { operacion: "venta" | "alquiler" }) {
  return (
    <div className="absolute top-0 right-0 z-10 overflow-hidden w-36 h-36 pointer-events-none">
      <div className="absolute top-5 -right-9 w-48 rotate-45 bg-red-600 py-2 text-center text-base font-bold uppercase tracking-wider text-white shadow-md">
        {operacion === "alquiler" ? "Alquilada" : "Vendida"}
      </div>
    </div>
  );
}
