'use client'


import { useState, useCallback } from "react";
import toasterCustom from "../toaster-custom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    styleButton?: string
}

export function ConfirmDialog(
    {
        isOpen,
        onClose,
        onConfirm,
        title,
        description,
        styleButton
    }: ConfirmDialogProps
) {
    const [isSaving, setIsSaving] = useState(false);

    const handleConfirmClick = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            await onConfirm();
        } catch {
            toasterCustom(400, "Error al guardar:");
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, onConfirm]);

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmClick}
                        className={`bg-destructive ${styleButton}`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Guardando..." : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}