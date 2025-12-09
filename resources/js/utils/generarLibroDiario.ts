import pdfMake from "pdfmake/build/pdfmake"
import "pdfmake/build/vfs_fonts"

pdfMake.vfs = (window as any).pdfMake.vfs

export function generarPdf(
    asientosOrdenados: any[],
    desde: string,
    hasta: string
) {
    const format = (n: any) =>
    Number(n).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const contenido: any[] = [
        {
            text: "Fecha Emisión: " + new Date().toLocaleDateString(),
            alignment: "right",
            margin: [0, 0, 0, 10],
            fontSize: 12
        },
        {
            text: "Libro Diario",
            style: "header"
        },
        {
            text: `Período: ${new Date(desde).toLocaleDateString()} al ${new Date(hasta).toLocaleDateString()}`,
            style: "subheader",
            margin: [0, 10, 0, 20]
        }
    ]

    // ==========================
    // RECORRER ASIENTOS
    // ==========================
    asientosOrdenados.forEach(asiento => {

        contenido.push({
            columns: [
                {
                    text: `Fecha: ${new Date(asiento.fecha).toLocaleDateString()}`,
                    width: "auto",
                    fontSize: 12,
                    margin: [0, 8, 0, 2]
                },
                {
                    text: `Concepto: ${asiento.concepto}`,
                    width: "*",
                    fontSize: 12,
                    margin: [10, 8, 0, 2]
                },
                {
                    text: `Asiento Nº ${String(asiento.numero).padStart(3, "0")}`,
                    width: "auto",
                    alignment: "right",
                    bold: true,
                    fontSize: 13,
                    margin: [0, 8, 0, 2]
                }
            ]
        })


        // Tabla de partidas
        const body = [
            [
                "Cuenta",
                "Descripción",
                { text: "Debe", alignment: "right" },
                { text: "Haber", alignment: "right" }
            ]
        ]

        asiento.partidas.forEach((p: any) => {
            body.push([
                p.cuenta.codigo,
                p.cuenta.descripcion,
                { text: p.debe ? format(p.debe) : "", alignment: "right" },
                { text: p.haber ? format(p.haber) : "", alignment: "right" }
            ])
        })

        contenido.push({
            table: {
                headerRows: 1,
                widths: ["auto", "*", "auto", "auto"],
                body
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 12],
            style: "tablaBody"
        })
    })

    const docDefinition: any = {
        pageSize: "A4",
        pageMargins: [20, 30, 20, 30],
        content: contenido,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: "center"
            },
            subheader: {
                fontSize: 10,
                bold: true
            },
            asientoTitulo: {
                fontSize: 12,
                bold: true
            },
            tablaBody: {
                fontSize: 8
            }
        },
        footer: function(currentPage: number, pageCount: number) {
            return {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: "right",
                margin: [0, 0, 20, 10],
                fontSize: 10
            }
        }
    }

    pdfMake.createPdf(docDefinition).open()
}
