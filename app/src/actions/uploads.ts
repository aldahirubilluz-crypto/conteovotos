"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function UploadDocument(
  file: File,
  name: string,
  token?: string
): Promise<Document> {
  if (!token) throw new Error("Token no disponible");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir el documento");

  const data = await res.json();
  return data.data as Document;
}
