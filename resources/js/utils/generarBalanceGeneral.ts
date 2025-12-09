import pdfMake from "pdfmake/build/pdfmake"
import "pdfmake/build/vfs_fonts"

pdfMake.vfs = (window as any).pdfMake.vfs

export function generarPdfBalance(balance, desde, hasta) {

    const contenido = [
        {
            text: "Balance General",
            style: "header",
            alignment: "center",
            margin: [0, 0, 0, 10]
        },
        {
            text: `Período: ${new Date(desde).toLocaleDateString()} al ${new Date(hasta).toLocaleDateString()}`,
            alignment: "center",
            margin: [0, 0, 0, 20]
        },
        {
            table: {
                headerRows: 1,
                widths: ["auto", "*", "auto", "auto", "auto", "auto"],
                body: [
                    [
                        "Código",
                        "Cuenta",
                        { text: "Saldo Inicial", alignment: "right" },
                        { text: "Debe", alignment: "right" },
                        { text: "Haber", alignment: "right" },
                        { text: "Saldo Final", alignment: "right" },
                    ],
                    ...balance.map(r => ([
                        r.codigo,
                        r.descripcion,
                        { text: r.saldoInicial ? r.saldoInicial.toFixed(2) : "", alignment: "right" },
                        { text: r.debe ? r.debe.toFixed(2) : "", alignment: "right" },
                        { text: r.haber ? r.haber.toFixed(2) : "", alignment: "right" },
                        { text: r.saldoFinal ? r.saldoFinal.toFixed(2) : "", alignment: "right" },
                    ]))
                ]
            }
        }
    ]

    const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 30, 20, 30],
        content: contenido,
        styles: {
            header: {
                fontSize: 18,
                bold: true
            }
        }
    }

    pdfMake.createPdf(docDefinition).open()
}
