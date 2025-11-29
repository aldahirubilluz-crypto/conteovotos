"use client";

import { GetPositionAction } from "@/actions/position";
import CreatePosition from "@/components/position/create-position";
import PositionTable from "@/components/position/position-table";
import { GetPosition } from "@/components/types/position";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [position, setPosition] = useState<GetPosition[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    const loadData = async () => {
      
      const res = await GetPositionAction();

      if (res?.data && Array.isArray(res.data)) {
        const formatted = res.data.map((p) => ({
          ...p,
          validPercentage: p.validPercentage * 100,
        }));
        setPosition(formatted);
      } else {
        setPosition([]);
        if (res?.error) console.error("Error loading positions:", res.error);
      }
    };

    loadData();
  }, [session, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (!session?.user?.token) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="flex flex-col w-full h-auth items-start gap-4">
      <CreatePosition
        token={session.user.token}
        onPositionCreated={handleRefresh}
      />
      <PositionTable
        data={position}
        token={session.user.token}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
