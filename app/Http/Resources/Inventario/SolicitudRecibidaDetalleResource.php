<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitudRecibidaDetalleResource extends JsonResource
{
   public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'prioridad' => $this->prioridad,
        'motivo' => $this->motivo,
        'estado'=>$this->estado,
        'nombre_almacen_solicitante' => optional($this->almacensolicitante)->nombre,
        'nombre_almacen_proveedor' => optional($this->almacenProovedor)->nombre,
        'fecha'=>$this->fecha_creacion,

        'detalles' => $this->whenLoaded('detalles', function () {
            return $this->detalles->map(function ($detalle) {
                return [
                    'producto_id' => $detalle->producto_id,
                    'nombre_producto' => optional($detalle->producto)->nombre,
                    'cantidad' => $detalle->cantidad,
                    'cantidad_aprobada' => $detalle->cantidad_aprobada,
                ];
            });
        }),
    ];
}

}
