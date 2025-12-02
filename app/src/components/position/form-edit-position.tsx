import { useState } from "react";
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
import { toast } from "sonner";

import { UpdatePositionAction } from "@/actions/position";
import { GetPosition } from "../types/position";
import {
  PositionUpdateFormValues,
  positionUpdateSchema,
} from "../schema/schema-position";

interface FormEditPositionProps {
  position: GetPosition;
  handlerClose: () => void;
  token: string;
  onSuccess?: () => void;
}

export default function FormEditPosition({
  position,
  handlerClose,
  token,
  onSuccess,
}: FormEditPositionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PositionUpdateFormValues>({
    resolver: zodResolver(positionUpdateSchema),
    defaultValues: {
      name: position.name,
      description: position.description,
      typePosition: position.typePosition as "AUTORIDAD" | "ORGANO",
      totalVotes: position.totalVotes,
      validPercentage: position.validPercentage,
    },
  });

  const handleSubmit = () => setConfirmOpen(true);

  const confirmUpdate = async () => {
    setIsLoading(true);
    const values = form.getValues();

    const res = await UpdatePositionAction(position.id, values, token);

    if (!res.success || res.status !== 200) {
      setIsLoading(false);

      if (res.status === 400 && res.message?.includes("duplicate")) {
        return toast.error("El nombre del puesto ya existe");
      }

      return toast.error(res.message ?? "No se pudo actualizar el puesto");
    }

    toast.success(res.message || "Puesto actualizado correctamente");
    setConfirmOpen(false);
    setIsLoading(false);
    handlerClose();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <Card className="w-full max-w-md px-2 py-8 gap-2">
        <CardHeader className="text-center">
          <CardTitle>Editar Puesto</CardTitle>
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
                    <FormLabel>Total de Votos</FormLabel>
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
                    <div className="flex gap-2">
                      {["AUTORIDAD", "ORGANO"].map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={
                            field.value === option ? "default" : "outline"
                          }
                          className={`
                                                        px-4 py-2 rounded-xl transition-all duration-200 font-medium border
                                                        ${
                                                          field.value === option
                                                            ? "bg-primary text-white border-primary shadow-lg scale-105"
                                                            : "bg-background text-foreground border-primary/40 hover:border-primary hover:shadow-md"
                                                        }
                                                    `}
                          onClick={() => field.onChange(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end gap-2 px-0 pt-4">
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
                >
                  {isLoading ? "Actualizando..." : "Actualizar"}
                </Button>
              </CardFooter>
            </div>
          </Form>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmUpdate}
        title="Actualizar Puesto"
        description="¿Estás seguro de actualizar este puesto?"
        styleButton="text-white"
      />
    </div>
  );
}
