import { PosCandidate, UpdateCandidate } from "@/components/types/cantidates";

const API = process.env.API_BASE_URL;

export async function GetCantidatosAction() {
  try {
    const res = await fetch(`${API}/candidates/`, {
      method: "GET",
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok)
      return {
        success: false,
        error: json.message || "Error al obtener usuarios",
      };
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function PostCandidatesAction(
  values: PosCandidate,
  token: string
) {
  try {
    const formData = new FormData();
    formData.append("name", values.name.toUpperCase());
    formData.append("description", values.description.toUpperCase());
    formData.append("positionId", values.positionId);
    formData.append("typeCandidate", values.typeCandidate);

    if (values.image) {
      formData.append("image", values.image);
    }

    const res = await fetch(`${API}/candidates/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

export async function DeleteCandidatesAction(id: string, token: string) {
  try {
    const res = await fetch(`${API}/candidates/${id}`, {
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

export async function UpdateCandidateAction(
  id: string,
  values: UpdateCandidate,
  token: string
) {
  try {
    const formData = new FormData();

    if (values.name) formData.append("name", values.name.toUpperCase());
    if (values.description) formData.append("description", values.description.toUpperCase());
    if (values.positionId) formData.append("positionId", values.positionId);
    if (values.isActive !== undefined)
      formData.append("isActive", String(values.isActive));

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    const res = await fetch(`${API}/candidates/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    return {
      success: res.ok,
      status: json.status || res.status,
      message: json.message,
      data: json.data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      status: 500,
      message: "Error de conexión",
      data: null,
    };
  }
}
