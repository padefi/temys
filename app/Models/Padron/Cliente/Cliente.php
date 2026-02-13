<?php

namespace App\Models\Padron\Cliente;

use App\Models\Contabilidad\Comprobante;
use App\Models\Padron\PadronDatoBancario;
use App\Models\Ventas\ordenCotizacionVenta;
use App\Models\Ventas\OrdenVenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    public $timestamps = false;

    protected $fillable = [
        'id_padron',
        'apellido',
        'nombre',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    // Relación con el padrón
    public function padron()
    {
        return $this->belongsTo(\App\Models\Padron\Padron::class, 'id_padron');
    }

    // relación al modelo proveedores
    public function proveedores()
    {
        return $this->belongsToMany(\App\Models\Padron\Proveedor\Proveedor::class, 'relacion_cliente_proveedor', 'id_cliente', 'id_proveedor');
    }

    // relación al modelo CondicionIva
    public function condicionesIva()
    {
        return $this->belongsToMany(\App\Models\Padron\CondicionIva::class, 'relacion_cliente_condicion', 'id_cliente', 'id_iva')
                    ->withTimestamps();
    }

    ////ORDENES DE COTIZACION RELACIONADAS
    public function ordenesCotizacion()
    {
        return $this->hasMany(ordenCotizacionVenta::class, 'cliente_id');
    }

    public function ordenesVenta()
    {
        return $this->hasMany(OrdenVenta::class, 'cliente_id');
    }

    ////CUENTAS BANCARIAS RELACIONADAS
    public function cbu()
    {
        return $this->morphMany(PadronDatoBancario::class, 'titular', 'tipo', 'tipo_id');
    }
    // Relación con Comprobantes
    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class, 'tipo_id', 'id');
    }
}
