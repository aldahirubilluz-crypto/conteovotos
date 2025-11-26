
"use client"

import { getRecordAction } from "@/actions/registro";
import { GetRecord } from "@/components/types/record";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [record, setRecord] = useState<GetRecord[]>([]);
  const { data: session, } = useSession();

  console.log(record);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.token) return;

      const res = await getRecordAction(session.user.token);

      if (res?.data && Array.isArray(res.data)) {
        setRecord(res.data);
      } else {
        setRecord([]);
        if (res?.error) console.error("Error loading record:", res.error);
      }
    };

    loadData();
  }, [session]);
  return <div className="max-h-[500px] h-full">Hola</div>

}