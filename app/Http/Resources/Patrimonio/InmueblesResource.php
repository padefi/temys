<?php

namespace App\Http\Resources\Patrimonio;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InmueblesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'num_inmueble' => $this->id,
            'nombre_seccional' => $this->seccional,
            'num_partida' => $this->num_partida,
            'estado' => $this->estado,
            'nombres_inmueble'=>[
                'nombre_completo' => $this->nombre_completo,
                'nombre_fantasia' => $this->nombre_fantasia,
            ],
            'tipo_inmueble_nombre' => $this->tipo_inmueble,
            'tipo_ocupacion_nombre' => $this->tipo_ocupacion,

            // 👇 AGRUPADO
            'superficie' => [
                'cubierta' => $this->superficie_cubierta,
                'libre' => $this->superficie_libre,
                'total' => $this->superficie_total,
            ],

            // 👇 AGRUPADO
            'creacion' => [
                'fecha' => $this->fecha_creacion,
                'usuario' => $this->usuario_creacion,
            ],

            // 👇 AGRUPADO
            'actualizacion' => [
                'fecha' => $this->fecha_actualizacion,
                'usuario' => $this->usuario_actualizacion,
            ],

            // 👇 CONTACTOS (NUEVO)
            'contactos' => $this->whenLoaded('contactos', function () {
                return $this->contactos->map(function ($contacto) {
                    return [
                        'id' => $contacto->id,
                        'contacto' => $contacto->contacto,
                        'descripcion' => $contacto->descripcion,
                        'tipo_contacto' => [
                            'id' => $contacto->tipoContacto->id ?? null,
                            'descripcion' => $contacto->tipoContacto->descripcion ?? null,
                        ],
                    ];
                });
            }),
        ];
    }
        
    
}

