<?php
namespace App\Models\Padron\Proveedor;

use App\Models\Contabilidad\Comprobante;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\CondicionIva;
use App\Models\Padron\Padron;
use App\Models\Padron\PadronCbu;

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
        return $this->belongsTo(Padron::class, 'id_padron');
    }

    // relación al modelo Proveedor
    public function clientes()
    {
        return $this->belongsToMany(Cliente::class, 'relacion_cliente_proveedor', 'id_proveedor', 'id_cliente');
    }

    // Agrega esta relación al modelo Proveedor
    public function condicionesIva()
    {
        return $this->belongsToMany(CondicionIva::class, 'relacion_proveedor_condicion', 'id_proveedor', 'id_iva')
                    ->withTimestamps();
    }
    ////ORDENES DE COTIZACION RELACIONADAS
    public function ordenesCotizacion()
    {
        return $this->hasMany(OrdenCotizacion::class, 'proveedor_id');
    }

    public function ordenesCompra()
    {
        return $this->hasMany(OrdenCotizacion::class, 'proveedor_id');
    }
    ////CUENTAS BANCARIAS RELACIONADAS
    public function cbu()
    {
        return $this->morphMany(PadronCbu::class, 'titular', 'tipo', 'tipo_id');
    }
    // Relación con ComprobantesProveedores
    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class, 'tipo_id', 'id');
    }




}
