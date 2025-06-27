<?php

namespace App\Enums;

enum TipoAlmacen: string
{
    case CENTRAL = 'central';
    case DEPOSITO = 'deposito';
    case PUNTO_DE_VENTA = 'punto de venta';
}
