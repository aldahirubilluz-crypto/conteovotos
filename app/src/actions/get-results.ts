const API = process.env.NEXT_PUBLIC_API_URL;

export async function getResults() {
  try {
    const res = await fetch(`${API}/results`, { cache: "no-store" });
    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        data: [],
        message: json?.message || "Error al obtener los resultados",
      };
    }
    return {
      success: true,
      data: json?.data ?? [],
      message: json?.message,
    };
  } catch (err) {
    console.error("Error en action getResults:", err);
    return {
      success: false,
      data: [],
      message: "Error en el servidor",
    };
  }
}

export async function getPosition() {
  try {
    const res = await fetch(`${API}/results/position`, { cache: "no-store" });
    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        data: [],
        message: json?.message || "Error al obtener los resultados",
      };
    }
    return {
      success: true,
      data: json?.data ?? [],
      message: json?.message,
    };
  } catch (err) {
    console.error("Error en action getResults:", err);
    return {
      success: false,
      data: [],
      message: "Error en el servidor",
    };
  }
}

