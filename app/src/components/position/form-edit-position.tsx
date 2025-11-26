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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { useState } from "react";
import { toast } from "sonner";
import { UpdatePositionAction } from "@/actions/position";
import { GetPosition } from "../types/position";
import { PositionUpdateFormValues, positionUpdateSchema } from "../schema/schema-position";

interface FormEditPositionProps {
    position: GetPosition;
    handlerClose: () => void;
    token: string;
    onSuccess?: () => void;
}

export default function FormEditPosition({ position, handlerClose, token, onSuccess }: FormEditPositionProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PositionUpdateFormValues>({
        resolver: zodResolver(positionUpdateSchema),
        defaultValues: {
            name: position.name,
            description: position.description,
            isActive: position.isActive,
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
        form.reset();
        handlerClose();

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
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
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Estado</FormLabel>
                                            <FormDescription>
                                                {field.value ? "Puesto activo" : "Puesto inactivo"}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
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