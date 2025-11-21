/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomFileUpload } from "@/components/custom/custom-file-upload";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpToLine,
  FileText,
} from "lucide-react";

const candidates = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María Gómez" },
  { id: 3, name: "Luis Castillo" },
];

const votesSchema = z.object({
  votos: z.record(z.string(), z.preprocess(Number, z.number().min(0))),
});

const pdfSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf")
    .refine((file) => file.size <= 50 * 1024 * 1024),
});

export default function VoteProcessPage() {
  const [step, setStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [votesData, setVotesData] = useState<any>(null);

  const voteForm = useForm({
    resolver: zodResolver(votesSchema),
    defaultValues: {
      votos: Object.fromEntries(candidates.map((c) => [c.id, "0"])),
    },
  });

  const pdfForm = useForm({
    resolver: zodResolver(pdfSchema),
    defaultValues: { file: undefined },
  });

  const onPreview = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submitVotes = (data: any) => {
    setVotesData(data.votos);
    toast.success("Votos registrados");
    setStep(1);
  };

  const submitPdf = async (values: any) => {
    if (!values.file || !votesData) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("votos", JSON.stringify(votesData));

      await fetch("/api/votacion", {
        method: "POST",
        body: formData,
      });

      toast.success("Votación enviada correctamente");
    } catch {
      toast.error("Error al enviar la votación");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-900">
        Proceso de Registro de Votación
      </h1>

      <div className="relative w-full overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          {/* SLIDE 1 */}
          <div className="w-full min-h-[500px] shrink-0 bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">
              Paso 1: Ingresar Votos
            </h2>

            <Form {...voteForm}>
              <form
                className="space-y-6"
                onSubmit={voteForm.handleSubmit(submitVotes)}
              >
                {candidates.map((c) => (
                  <FormField
                    key={c.id}
                    control={voteForm.control}
                    name={`votos.${c.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <FormLabel className="text-base font-medium">
                            {c.name}
                          </FormLabel>
                          <FormControl className="max-w-[140px]">
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              className="text-right"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                >
                  <ArrowRightFromLine />
                  Continuar
                </Button>
              </form>
            </Form>
          </div>

          <div className="w-full min-h-[500px] shrink-0 bg-white p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Paso 2: Subir Acta PDF</h2>

              <Form {...pdfForm}>
                <form
                  onSubmit={pdfForm.handleSubmit(submitPdf)}
                  className="space-y-5"
                >
                  <FormField
                    control={pdfForm.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>Seleccionar archivo PDF</FormLabel>
                        <FormControl>
                          <CustomFileUpload
                            control={pdfForm.control}
                            name="file"
                            label="Seleccionar PDF"
                            accept=".pdf"
                            maxSizeMB={50}
                            description="Solo PDF • Máx 50MB"
                            validateFile={(file) =>
                              file.type === "application/pdf"
                            }
                            onPreview={onPreview}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full h-12 font-semibold"
                  >
                    <ArrowUpToLine />
                    Enviar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 font-semibold"
                    onClick={() => setStep(0)}
                  >
                    <ArrowLeftFromLine />
                    Regresar
                  </Button>
                </form>
              </Form>
            </div>

            <div className="bg-gray-50 rounded-xl border p-4 flex items-center justify-center">
              {previewUrl ? (
                <iframe src={previewUrl} className="w-full h-[500px]" />
              ) : (
                <div className="text-center space-y-2 text-gray-500">
                  <FileText className="w-14 h-14 mx-auto opacity-50" />
                  <p>Aquí aparecerá la vista previa del PDF</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
