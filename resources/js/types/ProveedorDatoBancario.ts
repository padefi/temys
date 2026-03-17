export type TipoClave = 'Cbu' | 'Cvu' | 'Undefined';
export type TipoCuenta = 'Caja de Ahorro' | 'Cuenta Corriente' | 'Undefined';

export type ProveedorDatoBancario = {
  id: number
  tipo_clave: TipoClave
  clave: string
  alias?: string | null
  entidad_financiera: number
  moneda: number | null
  tipo_cuenta: TipoCuenta
  predeterminado: boolean
}
