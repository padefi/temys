import pdfMake from "pdfmake/build/pdfmake"
import "pdfmake/build/vfs_fonts"

pdfMake.vfs = (window as any).pdfMake.vfs


export function generarPdf(
    cuentasOrdenadas: any[],
    proveedorNombre: string,
    desde: string,
    hasta: string) {

    const format = (n: any) =>
    Number(n).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const contenido: any[] = [
        {
            text: "Fecha Emisión: " + new Date().toLocaleDateString(),
            style: "subheader",
            margin: [0, 0, 0, 10],
            alignment: "right",   // 👈 Alineado a la derecha
            fontSize: 12,
        },
        {
            text: `Libro Mayor de ${proveedorNombre}`,
            style: "header"
        },
        {
            text: `Período: ${new Date(desde).toLocaleDateString()} al ${new Date(hasta).toLocaleDateString()}`,
            style: "subheader",
            margin: [0, 10, 0, 10],
            fontSize: 12,
        },
        { text: "\n" }
    ]

    cuentasOrdenadas.forEach((grupo) => {
        contenido.push(
            { text: `${grupo.cuenta.codigo} - ${grupo.cuenta.descripcion}`, style: "subheader", margin: [0, 10, 0, 4] }
        )

        const body = [
            [
                "Fecha",
                "Asiento",
                "Concepto",
                { text: "Debe", alignment: "right" },
                { text: "Haber", alignment: "right" },
                { text: "Saldo", alignment: "right" },
            ]
        ]

        let saldo = 0

        grupo.movimientos.forEach((m: any) => {
            saldo += Number(m.debe) - Number(m.haber)

            body.push([
                m.fecha,
                String(m.numero).padStart(3, "0"),
                m.concepto,
                { text: m.debe ? format(m.debe) : "", alignment: "right" },
                { text: m.haber ? format(m.haber) : "", alignment: "right" },
                { text: format(saldo), alignment: "right" },
            ])
        })

        contenido.push({
            table: {
                headerRows: 1,
                widths: ["auto", "auto", "*", "auto", "auto", "auto"],
                body
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 10],
            style: "tablaBody"
        })
    })

    const docDefinition: any = {
        pageSize: "A4",
        pageMargins: [20, 30, 20, 30],
        content: contenido,
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                alignment: "center"
            },
            subheader: {
                fontSize: 10,
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
