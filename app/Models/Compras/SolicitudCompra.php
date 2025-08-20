<?php

namespace App\Models\Compras;

use App\Models\ControlAcceso\User;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\General\Origen;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class SolicitudCompra extends Model
{
    use HasFactory;

    protected $table = 'solicitud_compras';

    protected $fillable = [
        'origen_id',
        'descripcion',
        'estado',
        'usuario_id',
        'usuario_actualizacion',
    ];

    // Relación con el usuario que creó la solicitud
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Relación con el usuario que actualizó la solicitud
    public function usuarioActualizacion()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    }

    // Ordenes de Cotizacion Asociadas
    public function ordenesCotizacion()
    {
        return $this->belongsToMany(
            OrdenCotizacion::class,
            'solicitud_compra_orden_cotizaciones',
            'solicitud_compra_id',
            'orden_cotizaciones_id'
        );
    }

    // Relación con el origen que creó la solicitud
    public function origen()
    {
        return $this->belongsTo(Origen::class, 'origen_id');
    }



}
