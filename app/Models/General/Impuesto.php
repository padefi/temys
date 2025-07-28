<?php

namespace App\Models\General;

use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Impuesto extends Model
{
    use HasFactory;



    protected $fillable = [
        'descripcion',
        'porcentaje',
        'habilitado',
    ];


    public function cotizacionesOrdenesDetalle()
        {
            return $this->belongsTo(OrdenCotizacionDetalle::class, 'id');
        }

}
