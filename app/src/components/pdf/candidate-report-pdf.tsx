// src/components/pdf/candidate-report-pdf.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { GetRecord } from "@/components/types/record";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 30,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  colMesa: {
    width: "50%",
    padding: 8,
    textAlign: "left",
  },
  colVotos: {
    width: "50%",
    padding: 8,
    textAlign: "center",
  },
  headerText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cellText: {
    fontSize: 11,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#64748b",
    fontSize: 9,
    borderTop: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: "#2563eb",
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
  },
});

interface Props {
  candidateRecords: GetRecord[];
  candidateName: string;
}

export default function CandidateReportPDF({ candidateRecords, candidateName }: Props) {
  // Calcular el total de votos - especificar el tipo del acumulador
  const totalVotos = candidateRecords.reduce<number>((sum, r) => sum + Number(r.totalVotes), 0);
  
  // Fecha actual
  const fecha = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Resultados Electorales</Text>
          <Text style={styles.subtitle}>
            Candidato: {candidateName} | Fecha: {fecha}
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableHeader}>
            <View style={styles.colMesa}>
              <Text style={styles.headerText}>Mesa Electoral</Text>
            </View>
            <View style={styles.colVotos}>
              <Text style={styles.headerText}>Votos Obtenidos</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {candidateRecords.map((record, index) => (
            <View
              key={record.id}
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.tableRowAlt : {},
              ]}
            >
              <View style={styles.colMesa}>
                <Text style={styles.cellText}>{record.mesa}</Text>
              </View>
              <View style={styles.colVotos}>
                <Text style={styles.cellText}>{record.totalVotes}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {`Total de votos: ${totalVotos} | Total de mesas: ${candidateRecords.length}`}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {`Documento generado el ${new Date().toLocaleString("es-PE")}`}
        </Text>
      </Page>
    </Document>
  );
}