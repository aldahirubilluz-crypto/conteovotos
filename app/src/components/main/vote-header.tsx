import { Vote } from "lucide-react";

export default function VoteHeader() {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Vote className="h-8 w-8" />
                Registro de Votos
            </h1>
            <p className="text-gray-600 mt-2">
                Registre los votos por mesa de votación
            </p>
        </div>
    );
}