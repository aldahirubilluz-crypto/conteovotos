import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import FormPosition from "./form-position"

interface CreatePositionProps {
    token: string;
    onPositionCreated: () => void;  // ← Agregar esta línea
}

export default function CreatePosition({ token, onPositionCreated }: CreatePositionProps) {  // ← Agregar onPositionCreated aquí
    const [modalCreate, setModalCreate] = useState(false)

    const handlerModal = () => setModalCreate(true)
    const handlerClose = () => setModalCreate(false)

    return (
        <div>
            <Button onClick={handlerModal}>
                <Plus className="mr-1" /> Agregar Puesto
            </Button>

            {modalCreate && (
                <FormPosition
                    handlerClose={handlerClose}
                    token={token}
                    onSuccess={onPositionCreated}  // ← Agregar esta línea
                />
            )}
        </div>
    )
}