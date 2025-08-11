<?php

namespace App\Models\General;

use App\Models\Compras\SolicitudCompra;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Origen extends Model
{
    protected $table = 'origenes';
    use HasFactory;



    protected $fillable = [
        'descripcion',
    ];


    public function solicitudCompra()
        {
            return $this->belongsTo(SolicitudCompra::class, 'id');
        }

}
