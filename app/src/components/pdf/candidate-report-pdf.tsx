import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { GetRecord } from "../types/record";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  // Header Section
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: 2,
    borderBottomColor: "#1e40af",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 9,
    color: "#64748b",
  },

  // Info Section
  infoSection: {
    marginTop: 12,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderLeft: 3,
    borderLeftColor: "#3b82f6",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  infoLabel: {
    width: "30%",
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
  },

  infoValue: {
    width: "70%",
    fontSize: 9,
    color: "#1e293b",
  },

  // Table Section
  tableSection: {
    marginTop: 15,
  },

  table: {
    width: "100%",
    marginTop: 8,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingVertical: 8,
  },

  headerText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
  },

  tableBody: {
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: "#cbd5e1",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 24,
    alignItems: "center",
  },

  rowAlt: {
    backgroundColor: "#f8fafc",
  },

  cell: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
    textAlign: "center",
    color: "#334155",
  },

  cellLeft: {
    textAlign: "left",
  },

  // Summary Section
  summarySection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#dbeafe",
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: "#2563eb",
  },

  summaryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: "#bfdbfe",
  },

  summaryRowLast: {
    borderBottom: 0,
    paddingTop: 5,
    marginTop: 3,
  },

  summaryLabel: {
    fontSize: 9.5,
    color: "#475569",
    fontWeight: "bold",
  },

  summaryValue: {
    fontSize: 9.5,
    color: "#1e40af",
    fontWeight: "bold",
  },

  summaryTotal: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 25,
    left: 30,
    right: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#e2e8f0",
  },

  footerText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 7.5,
    marginBottom: 2,
  },
});

interface PropsRecords {
  candidateRecords: GetRecord[];
}

export default function CandidateReportPDF({ candidateRecords }: PropsRecords) {
  if (!candidateRecords || candidateRecords.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No hay datos disponibles</Text>
        </Page>
      </Document>
    );
  }

  const first = candidateRecords[0];
  const candidateName = first?.candidateName || "No especificado";
  const positionName = first?.position?.name || "No especificado";
  const typePosition =
    first?.position?.typePosition === "AUTORIDAD"
      ? "AUTORIDAD DE LA UNSCH"
      : "ORGANO DE GOBIERNO DE LA UNSCH";

  const totalGeneral = candidateRecords.reduce(
    (sum, r) => sum + Number(r.totalVotes || 0),
    0
  );

  const totalPersonal = candidateRecords
    .filter((r) => r.typeVote === "DOCENTES")
    .reduce((sum, r) => sum + Number(r.totalVotes || 0), 0);

  const totalPublico = candidateRecords
    .filter((r) => r.typeVote === "PUBLICO")
    .reduce((sum, r) => sum + Number(r.totalVotes || 0), 0);

  const totalMesas = candidateRecords.length;
  const fechaGeneracion = new Date().toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Votación por Candidato</Text>
          <Text style={styles.subtitle}>Generado el {fechaGeneracion}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información del Candidato</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre Completo:</Text>
            <Text style={styles.infoValue}>{candidateName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo Postulado:</Text>
            <Text style={styles.infoValue}>{positionName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo de Cargo:</Text>
            <Text style={styles.infoValue}>{typePosition}</Text>
          </View>
        </View>

        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Detalle de Votación por Mesa</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, { width: "12%" }]}>N°</Text>
              <Text style={[styles.headerText, { width: "43%" }]}>
                Mesa Electoral
              </Text>
              <Text style={[styles.headerText, { width: "25%" }]}>
                Tipo de Voto
              </Text>
              <Text style={[styles.headerText, { width: "20%" }]}>Votos</Text>
            </View>

            <View style={styles.tableBody}>
              {candidateRecords.map((record, index) => (
                <View
                  key={record.id}
                  style={[styles.row, index % 2 === 1 ? styles.rowAlt : {}]}
                >
                  <Text style={[styles.cell, { width: "12%" }]}>
                    {index + 1}
                  </Text>

                  <Text
                    style={[styles.cell, styles.cellLeft, { width: "43%" }]}
                  >
                    {record.mesa}
                  </Text>

                  <Text style={[styles.cell, { width: "25%" }]}>
                    {record.typeVote === "DOCENTES"
                      ? "Personal"
                      : "Estudiantes"}
                  </Text>

                  <Text
                    style={[styles.cell, { width: "20%", fontWeight: "bold" }]}
                  >
                    {record.totalVotes}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen de Resultados</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Mesas:</Text>
            <Text style={styles.summaryValue}>{totalMesas}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Votos Personal:</Text>
            <Text style={styles.summaryValue}>{totalPersonal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Votos Estudiantes:</Text>
            <Text style={styles.summaryValue}>{totalPublico}</Text>
          </View>

          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={[styles.summaryLabel, { fontSize: 11 }]}>
              TOTAL GENERAL:
            </Text>
            <Text style={styles.summaryTotal}>{totalGeneral} votos</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documento generado automáticamente por el Sistema de Conteo
            Electoral
          </Text>
          <Text style={styles.footerText}>
            Este documento tiene validez oficial para efectos de auditoría y
            verificación
          </Text>
        </View>
      </Page>
    </Document>
  );
}
