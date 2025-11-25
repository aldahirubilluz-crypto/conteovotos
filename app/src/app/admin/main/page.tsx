/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCantidatosAction } from "@/actions/cantidatos";
import CandidatesTable from "@/components/cantidatos/candidates-table";
import CreateCantdidates from "@/components/cantidatos/create-candidates";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function VoteProcessPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.token) return;

      const res = await getCantidatosAction(session.user.token);

      if (res?.data && Array.isArray(res.data)) {
        setAgents(res.data);
      } else {
        setAgents([]);
        if (res?.error) console.error("Error loading users:", res.error);
      }
    };

    loadData();
  }, [session]);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <CreateCantdidates />
      <CandidatesTable candidates={agents} />
    </div>
  );
}
