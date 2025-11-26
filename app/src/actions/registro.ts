import { PosRecord } from "@/components/types/record";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getRecordAction(token: string) {
  try {
    const res = await fetch(`${API}/votes/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok)
      return {
        success: false,
        error: json.message || "Error al obtener usuarios",
      };
    return { success: true, data: json.data ?? [] };
  } catch (error) {
    return { success: false, error };
  }
}

export async function PostRecordAction(values: PosRecord, token: string) {
  try {
    const res = await fetch(`${API}/votes/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const json = await res.json();

    return {
      success: res.ok,
      status: json.status || res.status,
      message: json.message,
      data: json.data,
    };

  } catch {
    return {
      success: false,
      status: 500,
      message: "Error de conexión",
      data: null,
    };
  }
}
