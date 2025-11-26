import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import FormCandidates from "./form-candidates";

interface CreateCandidateProps {
    token: string;
    onCandidateCreated: () => void;
}

export default function CreateCandidates({ token, onCandidateCreated }: CreateCandidateProps) {
    const [modalCreate, setModalCreate] = useState(false)

    const handlerModal = () => setModalCreate(true)
    const handlerClose = () => setModalCreate(false)

    return (
        <div>
            <Button onClick={handlerModal}>
                <Plus className="mr-1" /> Agregar Candidato
            </Button>

            {modalCreate && (
                <FormCandidates
                    handlerClose={handlerClose}
                    token={token}
                    onSuccess={onCandidateCreated}
                />
            )}
        </div>
    )
}