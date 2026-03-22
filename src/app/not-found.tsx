import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        La pagina que buscas no existe
      </p>
      <Button href="/" className="mt-6">
        Volver al inicio
      </Button>
    </div>
  );
}
