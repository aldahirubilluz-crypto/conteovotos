/* eslint-disable @next/next/no-img-element */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2, User } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { toast } from "sonner";
import { GetCantidatos } from "../types/cantidates";
import { DeleteCandidatesAction } from "@/actions/cantidatos";
import FormEditCandidate from "./form-edit-candidate";

type PropsTable = {
  data: GetCantidatos[];
  token: string;
  onRefresh: () => void;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CandidatesTable({
  data,
  token,
  onRefresh,
}: PropsTable) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<GetCantidatos | null>(null);

  const onEdit = (candidate: GetCantidatos) => {
    setSelectedCandidate(candidate);
    setEditOpen(true);
  };

  const onDelete = (id: string) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const res = await DeleteCandidatesAction(selectedId, token);

    if (!res.success || res.status !== 200) {
      return toast.error(res.message ?? "No se pudo eliminar el candidato");
    }

    toast.success(res.message || "Candidato eliminado correctamente");
    setDeleteOpen(false);
    setSelectedId("");
    onRefresh();
  };

  return (
    <>
      <Card className="w-full h-auto">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Posición</TableHead>
                <TableHead>Tipo de Posición</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {c.imageId ? (
                        <img
                          src={`${API}/images/${c.imageId}`}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {c.description || "-"}
                    </div>
                  </TableCell>

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

                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {c.position.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.position.typePosition === "AUTORIDAD" ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {c.position.typePosition}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                        {c.position.typePosition}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(c)}
                        aria-label={`Editar ${c.name}`}
                        className="text-yellow-600 hover:bg-yellow-400 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(c.id)}
                        aria-label={`Eliminar ${c.name}`}
                        className="text-destructive hover:bg-red-400 hover:text-white dark:hover:bg-red-400 dark:hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
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

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Candidato"
        description="¿Estás seguro de eliminar este candidato? Esta acción no se puede deshacer."
        styleButton="text-white"
      />

      {editOpen && selectedCandidate && (
        <FormEditCandidate
          candidate={selectedCandidate}
          handlerClose={() => setEditOpen(false)}
          token={token}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
