<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrdenEntregaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fecha_envio' => $this->fecha_envio instanceof \Carbon\Carbon
    ? $this->fecha_envio->format('Y-m-d')
    : null,

'fecha_creacion' => $this->fecha_creacion instanceof \Carbon\Carbon
    ? $this->fecha_creacion->format('Y-m-d H:i:s')
    : null,
            'usuario_creacion' => optional($this->usuarioCreacion)->name ?? '-',
            'estado' => $this->estado,
            'origen' => optional($this->origen)->nombre ?? '-',
            'destino' => optional($this->destino)->nombre ?? '-',
            'productos' => $this->detalles->map(function ($detalle) {
                return [
                    'nombre' => optional($detalle->producto)->nombre ?? '-',
                    'cantidad' => $detalle->cantidad_enviada,
                    'fecha_creacion' => $detalle->fecha_creacion instanceof \Carbon\Carbon ? $detalle->fecha_creacion->format('Y-m-d H:i:s') : null,
                    'usuario_creacion' => optional($detalle->usuarioCreacion)->name ?? '-',
                ];
            })->values(),
        ];
    }
}