import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { useState } from "react";
import { toast } from "sonner";
import { PostPositionAction } from "@/actions/position";
import { PositionFormValues, positionSchema } from "../schema/schema-position";

interface FormPositionProps {
  handlerClose: () => void;
  token: string;
  onSuccess?: () => void;
}

export default function FormPosition({
  handlerClose,
  token,
  onSuccess,
}: FormPositionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: "",
      description: "",
      totalVotes: undefined,
      validPercentage: undefined,
      typePosition: "ORGANO",
    },
  });

  const handleSubmit = () => setConfirmOpen(true);

  const confirmCreate = async () => {
    setIsLoading(true);
    const values = form.getValues();

    const res = await PostPositionAction(values, token);

    if (!res.success || res.status !== 200) {
      setIsLoading(false);
      if (res.status === 400 && res.message?.includes("duplicate")) {
        return toast.error("El nombre del puesto ya existe");
      }
      return toast.error(res.message ?? "No se pudo crear el puesto");
    }

    toast.success(res.message || "Puesto creado correctamente");
    setConfirmOpen(false);
    setIsLoading(false);
    form.reset();
    handlerClose();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
      <Card className="w-full max-w-md px-2 py-8">
        <CardHeader className="text-center">
          <CardTitle>Crear Puesto</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del puesto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción breve" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalVotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Electores</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje Válido (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Puesto</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {["AUTORIDAD", "ORGANO"].map((option) => (
                          <Button
                            key={option}
                            type="button"
                            variant={
                              field.value === option ? "default" : "outline"
                            }
                            className={`
    px-4 py-2 rounded-xl transition-all duration-200 font-medium
    border
    ${
      field.value === option
        ? "bg-primary text-white border-primary shadow-lg scale-105 ring-2 ring-primary/50"
        : "bg-background text-foreground border-primary/40 hover:border-primary hover:shadow-md hover:scale-105"
    }
  `}
                            onClick={() => field.onChange(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end gap-2 px-0 pt-8">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handlerClose}
                  disabled={isLoading}
                >
                  Cerrar
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isLoading}
                  className="text-white"
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              </CardFooter>
            </div>
          </Form>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCreate}
        title="Crear Puesto"
        description="¿Estás seguro de crear este puesto?"
        styleButton="text-white"
      />
    </div>
  );
}
