"use server"

import { PosPostion, UpdatePostion } from "@/components/types/position";
import { PostCandidatesAction } from "./cantidatos";

const API = process.env.API_BASE_URL;

export async function GetPositionAction() {
  try {
    const res = await fetch(`${API}/positions/`, {
      method: "GET",
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

export async function PostPositionAction(values: PosPostion, token: string) {
  try {
    const payload = {
      ...values,
      name: values.name.toUpperCase(),
      description: values.description.toUpperCase(),
      validPercentage: values.validPercentage / 100,
    };

    const res = await fetch(`${API}/positions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || !json.data?.id) {
      return {
        success: false,
        status: json.status || res.status,
        message: json.message,
        data: null,
      };
    }

    await PostCandidatesAction(
      {
        name: "VOTOS NULOS",
        description: `VOTOS NULOS PARA ${json.data.name}`,
        positionId: json.data.id,
        typeCandidate: "NULL",
      },
      token
    );

    return {
      success: true,
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
export async function DeletePositionAction(id: string, token: string) {
  try {
    const res = await fetch(`${API}/positions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

export async function UpdatePositionAction(
  id: string,
  values: UpdatePostion,
  token: string
) {
  try {
    const payload = {
      ...values,
      name: values.name.toUpperCase(),
      description: values.description.toUpperCase(),
      validPercentage: values.validPercentage / 100,
    };

    const res = await fetch(`${API}/positions/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
