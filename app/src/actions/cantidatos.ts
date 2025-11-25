const API = process.env.NEXT_PUBLIC_API_URL;

export async function getCantidatosAction(token: string) {
  try {
    const res = await fetch(`${API}/candidates/`, {
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
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, error };
  }
}
