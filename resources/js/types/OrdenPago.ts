export interface OrdenPago {
    id: number;
    plan_pago_id: number;
    moneda_id: string;
    metodo_pago_id: number;
    importe: number;
    fecha_pago: Date;
    banco_origen_id: number;
    cuenta_origen_id: number;
    tarjeta_origen_id: number;
    cbu_pago: string;
    estado: string;
    usuario_creacion: number;
    usuario_pago?: number;
    created_at: Date;
    updated_at?: Date;

}
