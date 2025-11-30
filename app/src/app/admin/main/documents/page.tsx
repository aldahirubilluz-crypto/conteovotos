"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { saveAs } from "file-saver";

import { GenerarReportePDF, GetRecordAction } from "@/actions/registro";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [record, setRecord] = useState<GetRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const { data: session } = useSession();

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.token) return;

      const res = await GetRecordAction();
      if (res?.data && Array.isArray(res.data)) {
        setRecord(res.data);
      } else {
        setRecord([]);
        if (res?.error) console.error("Error loading record:", res.error);
      }
    };

    loadData();
  }, [session]);

  const filtered = record.filter(
    (r) =>
      (r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        r.mesa.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedCandidate || r.candidateId === selectedCandidate)
  );

  const candidates = Array.from(
    new Map(
      record.map((r) => [
        r.candidateId,
        {
          id: r.candidateId,
          name: r.candidateName,
          position: r.position?.name ?? "SIN PUESTO",
        },
      ])
    ).values()
  );

  const handleGenerarReporte = async () => {
    if (!selectedCandidate) return;

    try {
    
      const base64PDF = await GenerarReportePDF(selectedCandidate);
      const binaryString = atob(base64PDF);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      saveAs(blob, `Reporte_${selectedCandidate}.pdf`);
    } catch (error) {
      console.error("Error generando reporte PDF:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-auto space-y-6">
      <Card
        className="flex flex-row items-center gap-4 p-4"
        onClick={handleGenerarReporte}
      >
        <Button disabled={!selectedCandidate || selectedCandidate === "all"}>
          REPORTE POR CANDIDATO
        </Button>

        <Select
          onValueChange={(value) =>
            setSelectedCandidate(value === "all" ? null : value)
          }
          value={selectedCandidate || "all"}
        >
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Selecciona un candidato" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Seleccione</SelectItem>

            {candidates.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} — {c.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>
      <Card className="shadow-md w-full flex flex-col px-4 py-8">
        <CardHeader className="shrink-0">
          <CardTitle className="text-2xl font-bold">
            📊 Resultados de Votación
          </CardTitle>
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
                  <TableHead className="font-bold text-center">
                    Candidato
                  </TableHead>
                  <TableHead className="font-bold text-center">Votos</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-center">{r.mesa}</TableCell>
                      <TableCell className="text-center">
                        {r.candidateName}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {r.totalVotes}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500 py-4"
                    >
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
