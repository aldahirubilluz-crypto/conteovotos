/* eslint-disable @next/next/no-img-element */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CheckCircle2 } from "lucide-react";
import { VoteTabsProps } from "../types/register";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function VoteTabs({
  positions,
  candidates,
  form,
  isSubmitting,
}: VoteTabsProps) {

  return (
    <Tabs defaultValue={positions[0]?.id ?? ""} className="w-full">
      <TabsList className="mb-6 w-full justify-start overflow-x-auto">
        {positions.map((pos) => (
          <TabsTrigger key={pos.id} value={pos.id} className="min-w-fit">
            {pos.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {positions.map((pos) => {
        const positionCandidates = candidates.filter(
          (c) => c.position.id === pos.id && c.isActive
        );

        return (
          <TabsContent key={pos.id} value={pos.id} className="space-y-4">
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">Información de Mesa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="mesa">Número de Mesa *</Label>
                  <Input
                    id="mesa"
                    placeholder="Ejemplo: Mesa 001"
                    {...form.register("mesa")}
                    className="max-w-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionCandidates.map((c) => {

                return (
                  <Card
                    key={c.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="px-4 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                          {c.imageId ? (
                            <img
                              src={`${API}/images/${c.imageId}`}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base truncate">
                            {c.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-foreground line-clamp-2">
                        {c.description}
                      </p>
                      <div className="flex flex-col gap-2 py-2">
                        <Label htmlFor={`votes-${c.id}`} className="text-sm">
                          Votos obtenidos
                        </Label>
                        <Input
                          id={`votes-${c.id}`}
                          type="number"
                          min="0"
                          placeholder="0"
                          {...form.register(`votes.${c.id}`, {
                            valueAsNumber: true,
                          })}
                          className="text-lg font-semibold"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {positionCandidates.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No hay candidatos activos para este puesto
                </CardContent>
              </Card>
            )}
          </TabsContent>
        );
      })}

      <Button
        type="submit"
        className="w-full md:w-auto px-8 py-6 text-lg m-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Registrando...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Registrar Votos
          </>
        )}
      </Button>
    </Tabs>
  );
}
