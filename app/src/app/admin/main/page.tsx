/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getCantidatosAction } from "@/actions/cantidatos";
import { GetPositionAction } from "@/actions/position";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GetCantidatos } from "@/components/types/cantidatos";
import { GetPosition } from "@/components/types/position";
import { PostRecordAction } from "@/actions/registro";
import { User, Vote, CheckCircle2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

// 🧾 Schema formulario
const formSchema = z.object({
    mesa: z.string().min(1, "La mesa es requerida"),
    votes: z.record(z.string(), z.number().min(0)),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
    const [candidates, setCandidates] = useState<GetCantidatos[]>([]);
    const [positions, setPositions] = useState<GetPosition[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, status } = useSession();

    // 📝 Formulario
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mesa: "",
            votes: {},
        },
    });

    // 📥 obtener data
    useEffect(() => {
        const loadData = async () => {
            if (!session?.user?.token) return;

            const persons = await getCantidatosAction(session.user.token);
            const cargo = await GetPositionAction(session.user.token);

            if (Array.isArray(persons?.data)) setCandidates(persons.data);
            if (Array.isArray(cargo?.data)) setPositions(cargo.data);
        };

        loadData();
    }, [session]);

    // 📤 Enviar votos
    const onSubmit = async (values: FormValues) => {
        if (!session?.user?.token) return toast.error("Token inválido");

        setIsSubmitting(true);
        let hasError = false;
        let registeredCount = 0;

        for (const candidateId of Object.keys(values.votes)) {
            const totalVotes = values.votes[candidateId];
            if (!totalVotes || totalVotes <= 0) continue;

            const res = await PostRecordAction(
                { mesa: values.mesa, candidateId, totalVotes },
                session.user.token
            );

            if (!res.success) {
                toast.error(res.message || "Error al registrar voto");
                hasError = true;
                break;
            }
            registeredCount++;
        }

        setIsSubmitting(false);

        if (!hasError && registeredCount > 0) {
            toast.success(`${registeredCount} ${registeredCount === 1 ? 'voto registrado' : 'votos registrados'} correctamente`);
            form.reset();
        } else if (registeredCount === 0) {
            toast.warning("No hay votos para registrar");
        }
    };

    // Calcular total de votos por posición
    const getTotalVotesByPosition = (positionId: string) => {
        const votes = form.watch("votes") || {};
        return candidates
            .filter(c => c.position.id === positionId)
            .reduce((sum, c) => {
                const voteValue = votes[c.id];
                return sum + (typeof voteValue === 'number' ? voteValue : 0);
            }, 0);
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!session?.user?.token) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle className="text-red-600">No autorizado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Debes iniciar sesión para acceder a esta página.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Vote className="h-8 w-8" />
                    Registro de Votos
                </h1>
                <p className="text-gray-600 mt-2">Registre los votos por mesa de votación</p>
            </div>

            <Tabs defaultValue={positions[0]?.id ?? ""} className="w-full">
                <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                    {positions.map(pos => (
                        <TabsTrigger key={pos.id} value={pos.id} className="min-w-fit">
                            {pos.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Input de Mesa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Información de Mesa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="mesa">Número de Mesa *</Label>
                                <Input
                                    id="mesa"
                                    placeholder="Ejemplo: Mesa 001"
                                    {...form.register("mesa")}
                                    className="max-w-sm"
                                />
                                {form.formState.errors.mesa && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.mesa.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs de Candidatos */}
                    {positions.map(pos => {
                        const totalVotes = getTotalVotesByPosition(pos.id);
                        const positionCandidates = candidates.filter(c => c.position.id === pos.id && c.isActive);

                        return (
                            <TabsContent key={pos.id} value={pos.id} className="space-y-4">
                                {/* Resumen de votos */}
                                {totalVotes > 0 && (
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Total de votos para {pos.name}:</span>
                                                <span className="text-2xl font-bold text-blue-600">{totalVotes}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {positionCandidates.map(c => {
                                        const voteCount = form.watch(`votes.${c.id}`) || 0;

                                        return (
                                            <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-3">
                                                        {/* Imagen del candidato */}
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                                                            {c.imageId ? (
                                                                <img
                                                                    src={`${API}/images/${c.imageId}`}
                                                                    alt={c.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <CardTitle className="text-base truncate">{c.name}</CardTitle>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {c.description}
                                                    </p>
                                                    <div className="space-y-1">
                                                        <Label htmlFor={`votes-${c.id}`} className="text-sm">
                                                            Votos obtenidos
                                                        </Label>
                                                        <Input
                                                            id={`votes-${c.id}`}
                                                            type="number"
                                                            min="0"
                                                            placeholder="0"
                                                            {...form.register(`votes.${c.id}`, {
                                                                valueAsNumber: true,
                                                            })}
                                                            className="text-lg font-semibold"
                                                        />
                                                    </div>
                                                </CardContent>
                                                {voteCount > 0 && (
                                                    <CardFooter className="bg-green-50 border-t">
                                                        <div className="flex items-center gap-2 text-green-700">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <span className="text-sm font-medium">
                                                                {voteCount} {voteCount === 1 ? 'voto' : 'votos'}
                                                            </span>
                                                        </div>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>

                                {positionCandidates.length === 0 && (
                                    <Card>
                                        <CardContent className="py-12 text-center text-gray-500">
                                            No hay candidatos activos para este puesto
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        );
                    })}

                    <Button
                        type="submit"
                        className="w-full md:w-auto px-8 py-6 text-lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Registrando...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Registrar Votos
                            </>
                        )}
                    </Button>
                </form>
            </Tabs>
        </div>
    );
}