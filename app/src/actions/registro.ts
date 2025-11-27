"use server"

import CandidateReportPDF from "@/components/pdf/candidate-report-pdf";
import { GetRecord, PosRecord } from "@/components/types/record";
import { renderToBuffer } from "@react-pdf/renderer";

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

export async function generarReportePDF(
  candidateRecords: GetRecord[],
  candidateName: string
) {
  try {
    const pdfDocument = CandidateReportPDF({
      candidateRecords,
      candidateName
    });

    const buffer = await renderToBuffer(pdfDocument);

    return buffer.toString("base64");
  } catch (error) {
    console.error("Error generando PDF:", error);
    throw new Error("No se pudo generar el reporte PDF");
  }
}