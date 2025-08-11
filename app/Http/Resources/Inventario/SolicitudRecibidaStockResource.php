<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitudRecibidaStockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $mostrarCamposExtra = $request->routeIs('inventario.solicitudes.detalle', 'inventario.misSolicitudes');

         return [
        'id' => $this->id,
        'nombre_almacen_solicitante' => optional($this->almacensolicitante)->nombre,
        'nombre_almacen_proveedor' => optional($this->almacenProovedor)->nombre,
        'prioridad' => $this->prioridad,
        'fecha' => $this->fecha_creacion,
        'estado' => $this->estado,
        'motivo' => $this->when($mostrarCamposExtra, $this->motivo),

    ];
    }
}
