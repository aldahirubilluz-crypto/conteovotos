"use client";

import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Position = {
  id: string;
  name: string;
};

export type Candidate = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageId?: string;
  order?: number;
  isActive?: boolean;
  position?: Position | null;
};

type Props = {
  candidates: Candidate[];
};

export default function CandidatesTable({ candidates }: Props) {
  const onEdit = (id: string) => {
    console.log("editar", id);
  };
  const onDelete = (id: string) => {
    console.log("editar", id);
  };
  return (
    <Card className="w-full h-full">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Posición</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.name}</div>
                </TableCell>

                <TableCell>
                  <div className="max-w-xs truncate text-sm text-muted-foreground">
                    {c.description || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">{c.position?.name || "-"}</div>
                </TableCell>

                <TableCell>{c.order ?? "-"}</TableCell>

                <TableCell>
                  {c.isActive ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                      Inactivo
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(c.id)}
                      aria-label={`Editar ${c.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(c.id)}
                      aria-label={`Eliminar ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {candidates.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No hay candidatos para mostrar.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
