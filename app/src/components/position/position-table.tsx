import { GetPosition } from "../types/position";
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
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../ui/dialog-confirm";
import { toast } from "sonner";
import { PostDeleteAction } from "@/actions/position";
import FormEditPosition from "./form-edit-position";
type PropsTable = {
    data: GetPosition[];
    token: string;
    onRefresh: () => void;
};

export default function PositionTable({ data, token, onRefresh }: PropsTable) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedPosition, setSelectedPosition] = useState<GetPosition | null>(null);

    const onEdit = (position: GetPosition) => {
        setSelectedPosition(position);
        setEditOpen(true);
    };

    const onDelete = (id: string) => {
        setSelectedId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {

        const res = await PostDeleteAction(selectedId, token);

        if (!res.success || res.status !== 200) {

            return toast.error(res.message ?? "No se pudo eliminar el puesto");
        }

        toast.success(res.message || "Puesto eliminado correctamente");
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
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Activo</TableHead>
                                <TableHead>Creado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((c) => (
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
                                            {c.createdAt.toString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(c)}
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

                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="py-8 text-center text-sm text-muted-foreground">
                                            No hay puestos para mostrar.
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
                title="Eliminar Puesto"
                description="¿Estás seguro de eliminar este puesto? Esta acción no se puede deshacer."
                styleButton="text-white"
            />

            {editOpen && selectedPosition && (
                <FormEditPosition
                    position={selectedPosition}
                    handlerClose={() => setEditOpen(false)}
                    token={token}
                    onSuccess={onRefresh}
                />
            )}
        </>
    );
}