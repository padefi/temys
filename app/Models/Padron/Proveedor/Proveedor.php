<?php
namespace App\Models\Padron\Proveedor;

use App\Models\Contabilidad\Comprobante;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\CondicionIva;
use App\Models\Padron\Padron;
//use App\Models\Padron\PadronCbu;
use App\Models\Padron\Proveedor\ProveedorDatoBancario;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    public $timestamps = false;

    protected $fillable = [
        'id_padron',
        'razon_social',
        'nombre_fantasia',
        'tipo',
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
        return $this->belongsTo(Padron::class, 'id_padron');
    }

    // relación al modelo Proveedor
    public function clientes()
    {
        return $this->belongsToMany(Cliente::class, 'relacion_cliente_proveedor', 'id_proveedor', 'id_cliente');
    }

    public function actividadesEconomicas()
    {
        return $this->belongsToMany(ActividadEconomicaProveedor::class, 'relacion_proveedor_actividad', 'id_proveedor', 'id_actividad')
                    ->withPivot(['fecha_creacion', 'usuario_creacion']);
    }

    // Agrega esta relación al modelo Proveedor
    public function condicionesIva()
    {
        return $this->belongsToMany(CondicionIva::class, 'relacion_proveedor_condicion', 'id_proveedor', 'id_iva')
                    ->withPivot(['fecha_creacion', 'usuario_creacion']);/* ->withTimestamps(); */
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
    public function datosBancarios()
    {
        //return $this->morphMany(PadronCbu::class, 'titular', 'tipo', 'tipo_id');
        return $this->hasMany(ProveedorDatoBancario::class, 'proveedor_id');
    }
    // Relación con ComprobantesProveedores
    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class, 'tipo_id', 'id');
    }

}
