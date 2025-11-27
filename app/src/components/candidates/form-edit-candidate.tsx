/* eslint-disable @next/next/no-img-element */
"use client";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GetPositionAction } from "@/actions/position";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UpdateCandidateAction } from "@/actions/cantidatos";
import { Upload, X } from "lucide-react";
import { candidatesUpdateSchema, candidatesUpdateFormValues } from "../schema/schema-candidates";
import { GetCantidatos } from "../types/cantidates";

interface FormEditCandidateProps {
    candidate: GetCantidatos;
    handlerClose: () => void;
    token: string;
    onSuccess?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FormEditCandidate({ candidate, handlerClose, token, onSuccess }: FormEditCandidateProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [positions, setPositions] = useState<{ id: string; name: string }[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(
        candidate.imageId ? `${API}/images/${candidate.imageId}` : null
    );

    const form = useForm<candidatesUpdateFormValues>({
        resolver: zodResolver(candidatesUpdateSchema),
        defaultValues: {
            name: candidate.name,
            description: candidate.description,
            positionId: candidate.position.id,
            isActive: candidate.isActive,
            image: undefined,
        },
    });

    useEffect(() => {
        (async () => {
            const res = await GetPositionAction(token);
            if (!res.success) return toast.error("Error al cargar puestos");
            setPositions(res.data);
        })();
    }, [token]);

    const handleSubmit = () => setConfirmOpen(true);

    const confirmUpdate = async () => {
        setIsLoading(true);
        const values = form.getValues();

        const res = await UpdateCandidateAction(candidate.id, values, token);

        if (!res.success || res.status !== 200) {
            setIsLoading(false);
            if (res.status === 400 && res.message?.includes("duplicate")) {
                return toast.error("El candidato ya está registrado");
            }
            return toast.error(res.message ?? "No se pudo actualizar candidato");
        }

        toast.success(res.message || "Candidato actualizado correctamente");
        setConfirmOpen(false);
        setIsLoading(false);
        form.reset();
        handlerClose();

        if (onSuccess) onSuccess();
    };

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        form.setValue("image", undefined);
        setImagePreview(candidate.imageId ? `${API}/images/${candidate.imageId}` : null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <Card className="w-full max-w-lg px-2 py-8">
                <CardHeader className="text-center">
                    <CardTitle>Editar Candidato</CardTitle>
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
                                            <Input placeholder="Nombre del candidato" {...field} />
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
                                            <Input placeholder="Descripción del candidato" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="positionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Puesto</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un puesto" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {positions.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                {field.value ? "Candidato activo" : "Candidato inactivo"}
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

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Imagen</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {imagePreview ? (
                                                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2"
                                                            onClick={removeImage}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                            <p className="text-sm text-gray-500">Click para subir nueva imagen</p>
                                                        </div>
                                                        <Input
                                                            type="file"
                                                            accept="image/png, image/jpeg, image/jpg"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                onChange(file);
                                                                handleImageChange(file);
                                                            }}
                                                            name={field.name}
                                                            ref={field.ref}
                                                            onBlur={field.onBlur}
                                                            disabled={field.disabled}
                                                        />
                                                    </label>
                                                )}
                                            </div>
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
                title="Actualizar Candidato"
                description="¿Estás seguro de actualizar este candidato?"
                styleButton="text-white"
            />
        </div>
    );
}