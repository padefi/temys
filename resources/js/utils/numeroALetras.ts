export function numeroALetras(valor: number): string {
  const unidades = [
    "", "uno", "dos", "tres", "cuatro", "cinco",
    "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "trece", "catorce", "quince",
    "dieciséis", "diecisiete", "dieciocho", "diecinueve"
  ]

  const decenas = [
    "", "", "veinte", "treinta", "cuarenta",
    "cincuenta", "sesenta", "setenta", "ochenta", "noventa"
  ]

  const centenas = [
    "", "ciento", "doscientos", "trescientos", "cuatrocientos",
    "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"
  ]

  const convertir = (n: number): string => {
    if (n === 0) return ""
    if (n < 20) return unidades[n]
    if (n < 100)
      return decenas[Math.floor(n / 10)] +
        (n % 10 ? " y " + unidades[n % 10] : "")
    if (n === 100) return "cien"
    if (n < 1000)
      return centenas[Math.floor(n / 100)] +
        (n % 100 ? " " + convertir(n % 100) : "")
    if (n < 1_000_000) {
      const miles = Math.floor(n / 1000)
      const resto = n % 1000
      return (
        (miles === 1 ? "mil" : convertir(miles) + " mil") +
        (resto ? " " + convertir(resto) : "")
      )
    }
    if (n < 1_000_000_000) {
      const millones = Math.floor(n / 1_000_000)
      const resto = n % 1_000_000
      return (
        (millones === 1 ? "un millón" : convertir(millones) + " millones") +
        (resto ? " " + convertir(resto) : "")
      )
    }
    return n.toString()
  }

  const entero = Math.floor(valor)
  const centavos = Math.round((valor - entero) * 100)

  return (
    convertir(entero).trim() +
    " pesos" +
    (centavos ? ` con ${centavos}/100` : "")
  )
}
