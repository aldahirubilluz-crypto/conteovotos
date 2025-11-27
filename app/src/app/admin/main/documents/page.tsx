"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getRecordAction } from "@/actions/registro";
import type { GetRecord } from "@/components/types/record";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
  const [record, setRecord] = useState<GetRecord[]>([]);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  /* ---------------------- LOAD DATA ---------------------- */
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

  /* ---------------------- FILTER ---------------------- */
  const filtered = record.filter(
    (r) =>
      r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      r.mesa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-auto flex">
      <Card className="shadow-md w-full flex flex-col px-4 py-8">
        
        <CardHeader className="shrink-0">
          <CardTitle className="text-2xl font-bold">📊 Resultados de Votación</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-end mb-4">
            <Input
              placeholder="Buscar por candidato o mesa..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-center">Mesa</TableHead>
                  <TableHead className="font-bold text-center">Candidato</TableHead>
                  <TableHead className="font-bold text-center">Votos</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-center">{r.mesa}</TableCell>
                      <TableCell className="text-center">{r.candidateName}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {r.totalVotes}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
