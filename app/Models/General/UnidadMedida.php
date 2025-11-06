<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnidadMedida extends Model
{
    use HasFactory;

    protected $table = 'unidades_medida';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'habilitado',
    ];

    // Si querés, podés agregar relaciones, por ejemplo:
    // public function detallesFactura()
    // {
    //     return $this->hasMany(ComprobanteProveedorDetalle::class, 'unidad_medida_id');
    // }
}
