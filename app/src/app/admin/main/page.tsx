"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getCantidatosAction } from "@/actions/cantidatos";
import { GetPositionAction } from "@/actions/position";
import { PostRecordAction } from "@/actions/registro";

import { GetCantidatos } from "@/components/types/cantidates";
import { GetPosition } from "@/components/types/position";;

import { toast } from "sonner";
import VoteTabs from "@/components/main/vote-tabs";
import VoteHeader from "@/components/main/vote-header";
import { formSchema, FormValues } from "@/components/schema/schema-register";

export default function Page() {
    const [candidates, setCandidates] = useState<GetCantidatos[]>([]);
    const [positions, setPositions] = useState<GetPosition[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, status } = useSession();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mesa: "",
            votes: {},
        },
    });

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

    const onSubmit = async (values: FormValues) => {
        if (!session?.user?.token) return toast.error("Token inválido");

        setIsSubmitting(true);
        let hasError = false;
        let registeredCount = 0;

        for (const candidateId of Object.keys(values.votes)) {
            const totalVotes = values.votes[candidateId];
            
            if (totalVotes === undefined || totalVotes === null || totalVotes < 0) continue;

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
            toast.success(`${registeredCount} ${registeredCount === 1 ? 'registro completado' : 'registros completados'} correctamente`);
            form.reset();
        } else if (registeredCount === 0) {
            toast.warning("No hay votos para registrar");
        }
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
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold">No autorizado</p>
                    <p className="text-sm mt-2">Debes iniciar sesión para acceder</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-4 md:p-6 w-full">
            <VoteHeader />
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <VoteTabs
                    positions={positions}
                    candidates={candidates}
                    form={form}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}