<?php

namespace App\Enums\Contabilidad;

enum EstadoAsiento: string 
{
    case PENDIENTE = 'PENDIENTE';
    case CONTROLADO = 'CONTROLADO';
    case ANULADO = 'ANULADO';
}