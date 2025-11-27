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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GetPositionAction } from "@/actions/position";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PostCandidatesAction } from "@/actions/cantidatos";
import { Upload, X } from "lucide-react";
import { candidateSchema, CandidatesFormValues } from "../schema/schema-candidates";


interface FormCandidateProps {
    handlerClose: () => void;
    token: string;
    onSuccess?: () => void;
}

export default function FormCandidate({ handlerClose, token, onSuccess }: FormCandidateProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [positions, setPositions] = useState<{ id: string; name: string }[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<CandidatesFormValues>({
        resolver: zodResolver(candidateSchema),
        defaultValues: { name: "", description: "", positionId: "", image: undefined },
    });

    useEffect(() => {
        (async () => {
            const res = await GetPositionAction(token);
            if (!res.success) return toast.error("Error al cargar puestos");
            setPositions(res.data);
        })();
    }, [token]);

    const handleSubmit = () => setConfirmOpen(true);

    const confirmCreate = async () => {
        setIsLoading(true);
        const values = form.getValues();

        const res = await PostCandidatesAction(values, token);

        if (!res.success || res.status !== 200) {
            setIsLoading(false);
            if (res.status === 400 && res.message?.includes("duplicate")) {
                return toast.error("El candidato ya está registrado");
            }
            return toast.error(res.message ?? "No se pudo registrar candidato");
        }

        toast.success(res.message || "Candidato creado correctamente");
        setConfirmOpen(false);
        setIsLoading(false);
        form.reset();
        setImagePreview(null);
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
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        form.setValue("image", undefined);
        setImagePreview(null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <Card className="w-full max-w-lg px-2 py-8">
                <CardHeader className="text-center">
                    <CardTitle className="text-lg text-foreground">Registrar Candidato</CardTitle>
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
                                name="image"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Imagen (opcional)</FormLabel>
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
                                                            <p className="text-sm text-gray-500">Click para subir imagen</p>
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
                title="Registrar Candidato"
                description="¿Estás seguro de registrar este candidato?"
                styleButton="text-white"
            />
        </div>
    );
}