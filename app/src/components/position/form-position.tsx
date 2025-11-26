import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function FormPosition({ handlerClose, token, onSuccess }: FormPositionProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues: { name: "", description: "" },
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
        
        // Llamar al callback para actualizar la tabla
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
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

                            <CardFooter className="flex justify-end gap-2 px-0 pb-0">
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