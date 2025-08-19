<?php

namespace App\Models\General;

use App\Models\Compras\OrdenCompra;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;

class TipoMoneda extends Model
{
    use HasFactory;



    protected $fillable = [
        'codigo',
        'descripcion',
        'simbolo',
        'pais_origen',
    ];


    public function OrdenCotizacionMoneda()
    {
        return $this->belongsTo(OrdenCotizacion::class, 'id');
    }

    public function OrdenCompraMoneda()
    {
        return $this->belongsTo(OrdenCompra::class, 'id');
    }

}
