<?php
namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    protected $fillable = [
        'id_padron',
        'razon_social',
        'nombre_fantasia'
    ];

    // Relación con el padrón
    public function padron()
    {
        return $this->belongsTo(\App\Models\Padron\Padron::class, 'id_padron');
    }

    // relación al modelo Proveedor
    public function clientes()
    {
        return $this->belongsToMany(\App\Models\Padron\Cliente\Cliente::class, 'relacion_cliente_proveedor', 'id_proveedor', 'id_cliente');
    }

    // Agrega esta relación al modelo Proveedor
    public function condicionesIva()
    {
        return $this->belongsToMany(\App\Models\Padron\CondicionIva::class, 'relacion_proveedor_condicion', 'id_proveedor', 'id_iva')
                    ->withTimestamps();
    }

    public function ordenesCotizacion()
    {
        return $this->hasMany(OrdenCotizacion::class, 'proveedor_id');
    }

    public function ordenesCompra()
    {
        return $this->hasMany(OrdenCotizacion::class, 'proveedor_id');
    }

}
