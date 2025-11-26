"use client"

import { getCantidatosAction } from "@/actions/cantidatos";
import CandidatesTable from "@/components/candidates/candidates-table";
import CreateCandidates from "@/components/candidates/create-candidates";
import { GetCantidatos } from "@/components/types/cantidatos";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
    const [candidates, setCandidates] = useState<GetCantidatos[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: session, status } = useSession();

    useEffect(() => {
        const loadData = async () => {
            if (!session?.user?.token) return;

            const res = await getCantidatosAction(session.user.token);

            if (res?.data && Array.isArray(res.data)) {
                setCandidates(res.data);
            } else {
                setCandidates([]);
                if (res?.error) console.error("Error loading candidates:", res.error);
            }
        };

        loadData();
    }, [session, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (status === "loading") {
        return <div>Cargando...</div>;
    }

    if (!session?.user?.token) {
        return <div>No autorizado</div>;
    }

    return (
        <div className="flex flex-col w-full h-auth items-start gap-4">

            <CreateCandidates
                token={session.user.token}
                onCandidateCreated={handleRefresh}
            />
            <CandidatesTable
                data={candidates}
                token={session.user.token}
                onRefresh={handleRefresh}
            />

        </div>
    );
}