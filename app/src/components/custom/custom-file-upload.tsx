"use client";

import { useState, useRef } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CustomFileUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  accept: string;
  maxSizeMB?: number;
  validateFile: (file: File) => boolean;
  description: string;
  className?: string;
  onPreview?: (file: File) => void;
}

type FieldProps<T extends FieldValues> = Omit<
  ControllerRenderProps<T>,
  "value"
> & {
  value: File | null | undefined;
  onChange: (value: File | null | undefined) => void;
};

export function CustomFileUpload<T extends FieldValues>({
  control,
  name,
  accept,
  maxSizeMB = 50,
  validateFile,
  description,
  className,
  onPreview,
}: CustomFileUploadProps<T>) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, field: FieldProps<T>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file, field);
  };

  const handleFile = (file: File | undefined, field: FieldProps<T>) => {
    if (!file) return;

    if (!validateFile(file)) {
      toast.error(`Archivo inválido: ${file.name}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Archivo demasiado grande: ${file.name}. Máx ${maxSizeMB}MB`);
      return;
    }

    field.onChange(file);
    if (onPreview) onPreview(file);
  };

  const isFile = (value: unknown): value is File => {
    return value instanceof File;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convertir field a nuestro tipo FieldProps
        const fieldProps: FieldProps<T> = {
          ...field,
          value: field.value as File | null | undefined,
          onChange: field.onChange as (value: File | null | undefined) => void,
        };

        return (
          <FormItem className={cn("space-y-4 w-full", className)}>
            <FormControl>
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                  dragOver
                    ? "border-ring bg-accent"
                    : isFile(field.value)
                    ? "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-700/20"
                    : "border-input hover:border-ring hover:bg-accent"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, fieldProps)}
                onClick={() => inputRef.current?.click()}
              >
                {isFile(field.value) ? (
                  <div className="space-y-3">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" />
                    <p className="text-lg font-medium text-green-700 dark:text-green-400">
                      Archivo cargado exitosamente
                    </p>
                    <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                      {(field.value as File).name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {((field.value as File).size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium text-foreground">
                      Arrastra y suelta tu archivo aquí
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      o{" "}
                      <span className="text-primary font-medium">
                        clic para seleccionar
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {description}
                    </p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e) => handleFile(e.target.files?.[0], fieldProps)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
