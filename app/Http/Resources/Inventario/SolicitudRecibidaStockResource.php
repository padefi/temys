<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitudRecibidaStockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
public function toArray(Request $request): array
{
    $mostrarCamposExtra = $request->routeIs('inventario.solicitudes.detalle','inventario.misSolicitudes');
    return [
        'id' => $this->id,
        'nombre_producto' => optional($this->producto)->nombre,
        'nombre_almacen' => optional($this->almacensolicitante)->nombre,
        'prioridad' => $this->prioridad,
        'fecha' => $this->fecha_creacion,
        'estado'=>$this->estado,
        'motivo' => $this->when($mostrarCamposExtra, $this->motivo),
        'cantidad' => $this->when($mostrarCamposExtra, $this->cantidad),
    ];
}

}
