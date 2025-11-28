/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getCantidatosAction } from "@/actions/cantidatos";
import { GetPositionAction } from "@/actions/position";
import { PostRecordAction } from "@/actions/registro";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

import type { GetCantidatos } from "@/components/types/cantidates";
import type { GetPosition } from "@/components/types/position";
import {
  formSchemaRegister,
  FormValuesRegister,
} from "@/components/schema/schema-register";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [positions, setPositions] = useState<GetPosition[]>([]);
  const [candidates, setCandidates] = useState<GetCantidatos[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status } = useSession();

  const form = useForm<FormValuesRegister>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: { mesa: "", votes: {} },
  });

  useEffect(() => {
    if (!session?.user?.token) return;
    (async () => {
      const persons = await getCantidatosAction(session.user.token);
      const cargos = await GetPositionAction(session.user.token);

      if (Array.isArray(persons?.data)) setCandidates(persons.data);
      if (Array.isArray(cargos?.data)) {
        setPositions(cargos.data);
        setActiveTab(cargos.data[0]?.id ?? "");
      }
    })();
  }, [session]);

  const onSubmit = async (values: FormValuesRegister) => {
    if (!session?.user?.token) return toast.error("Token inválido");

    const currentCandidates = candidates.filter(
      (c) => c.position?.id === activeTab && c.isActive
    );

    const votesToSubmit = currentCandidates
      .map((c) => ({
        candidateId: c.id,
        totalVotes: values.votes[c.id] ?? 0,
      }))
      .filter((v) => v.totalVotes >= 0);

    if (votesToSubmit.length === 0) {
      return toast.warning("No hay candidatos en esta posición");
    }

    setIsSubmitting(true);
    let success = 0;

    for (const { candidateId, totalVotes } of votesToSubmit) {
      const res = await PostRecordAction(
        { mesa: values.mesa, candidateId, totalVotes },
        session.user.token
      );

      if (!res.success) {
        toast.error(res.message || "Error al registrar voto");
        setIsSubmitting(false);
        return;
      }
      success++;
    }

    toast.success(
      `${success} registro(s) completados para ${
        positions.find((p) => p.id === activeTab)?.name
      }`
    );

    const currentVotes = { ...values.votes };
    currentCandidates.forEach((c) => {
      delete currentVotes[c.id];
    });

    form.setValue("votes", currentVotes);
    form.setValue("mesa", "");

    setIsSubmitting(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session?.user?.token) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <p className="text-xl font-semibold">No autorizado</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <Card className="shadow-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Registro de Votos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap w-full h-full">
              {positions.map((p) => (
                <TabsTrigger key={p.id} value={p.id} className="h-12">
                  {p.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {positions.map((p) => {
              const positionCandidates = candidates.filter(
                (c) => c.position?.id === p.id && c.isActive
              );

              return (
                <TabsContent key={p.id} value={p.id} className="pt-4 space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-lg border-b pb-2">
                        {p.name}
                      </h3>

                      <FormField
                        control={form.control}
                        name="mesa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Mesa *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese número de mesa"
                                {...field}
                                className="max-w-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {positionCandidates.map((c) => (
                          <Card
                            key={c.id}
                            className="p-3 border hover:shadow-lg transition-shadow"
                          >
                            <div className="flex flex-col items-center gap-2">
                              {c.imageId ? (
                                <img
                                  src={`${API}/images/${c.imageId}`}
                                  alt={c.name}
                                  className="w-28 h-28 object-cover rounded-md border"
                                />
                              ) : (
                                <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-md border">
                                  <User className="w-10 h-10 text-gray-500" />
                                </div>
                              )}

                              <p className="font-semibold text-center">
                                {c.name}
                              </p>
                              <p className="text-xs text-gray-500 text-center line-clamp-2">
                                {c.description}
                              </p>
                            </div>

                            <FormField
                              control={form.control}
                              name={`votes.${c.id}`}
                              render={({ field }) => (
                                <FormItem className="mt-3">
                                  <FormLabel className="text-sm">
                                    Votos obtenidos
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      placeholder="0"
                                      value={field.value ?? ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                        )
                                      }
                                      className="text-center font-semibold"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </Card>
                        ))}
                      </div>

                      {positionCandidates.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No hay candidatos activos para esta posición
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-6 text-sm"
                      >
                        {isSubmitting
                          ? "Registrando..."
                          : `Registrar Votos para ${p.name}`}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
