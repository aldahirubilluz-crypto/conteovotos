import { PositionChip } from "../types/results";

interface Props {
    selectedPosition: PositionChip;
    totalVotesWithNulls: number; // Nuevo prop
}

export function HeaderInfo({ selectedPosition, totalVotesWithNulls }: Props) {
    const currentPercentage = selectedPosition.totalVotesPosition > 0
        ? ((totalVotesWithNulls / selectedPosition.totalVotesPosition) * 100).toFixed(1)
        : "0.0";

    const isValid = parseFloat(currentPercentage) >= (selectedPosition.validPercentage * 100);

    const totalVotesCasted = selectedPosition.candidates.reduce((sum, c) => sum + c.votes, 0);

    const votesNeeded = Math.max(
        0,
        Math.ceil((selectedPosition.validPercentage * selectedPosition.totalVotesPosition)) - totalVotesWithNulls
    );

    const votesRemaining = Math.max(0, selectedPosition.totalVotesPosition - totalVotesWithNulls);

    return (
        <div className="bg-card dark:bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            <div className="bg-primary p-4">
                <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                    {selectedPosition.positionName}
                </h2>
                <p className="text-primary-foreground/80">
                    {selectedPosition.candidates.length} candidatos • Total:{" "}
                    {Math.round(totalVotesCasted).toLocaleString("es-PE")} votos
                </p>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${isValid
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-500 dark:border-green-600'
                        : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 dark:border-yellow-600'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Estado de Votación
                            </p>
                            <span className="text-2xl">
                                {isValid ? '✅' : '⚠️'}
                            </span>
                        </div>
                        <p className={`text-xl font-bold ${isValid
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-yellow-700 dark:text-yellow-400'
                            }`}>
                            {isValid ? 'VÁLIDO' : 'NO ALCANZADO'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Requiere {(selectedPosition.validPercentage * 100).toFixed(0)}% de participación
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                            Participación Actual
                        </p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-primary">
                                {currentPercentage}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                                de {selectedPosition.totalVotesPosition.toLocaleString("es-PE")} votantes
                            </p>
                        </div>
                        <div className="mt-3 bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${Math.min(parseFloat(currentPercentage), 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-border bg-card">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                            Votos Pendientes
                        </p>
                        <div className="flex flex-row space-y-2 gap-8">
                            <div className="w-full text-center">
                                <p className="text-sm text-muted-foreground">
                                    Para validez mínima:
                                </p>
                                <p className={`text-2xl font-bold ${votesNeeded === 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {votesNeeded === 0 ? '✓ Alcanzado' : votesNeeded.toLocaleString("es-PE")}
                                </p>
                            </div>
                            <div className="w-full border-l border-border text-center">
                                <p className="text-sm text-muted-foreground">
                                    Para completar 100%:
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {votesRemaining.toLocaleString("es-PE")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {!isValid && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 dark:border-yellow-600 rounded">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                                    Votación aún no alcanza el mínimo requerido
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Se necesitan <strong>{votesNeeded.toLocaleString("es-PE")}</strong> votos adicionales
                                    para alcanzar el {(selectedPosition.validPercentage * 100).toFixed(0)}% de participación requerida.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}