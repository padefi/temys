<?php

namespace App\Models\Ventas;

use App\Models\ControlAcceso\User;
use App\Models\General\Origen;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class solicitudVenta extends Model
{
    /** @use HasFactory<\Database\Factories\SolicitudVentaFactory> */
    use HasFactory;

    protected $table = 'solicitud_ventas';

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
    public function ordenCotizacionVenta()
    {
        return $this->belongsToMany(
            OrdenCotizacionVenta::class,
            'solicitud_venta_orden_cotizaciones',
            'solicitud_venta_id',
            'orden_cotizaciones_id'
        );
    }

    // Relación con el origen que creó la solicitud
    public function origen()
    {
        return $this->belongsTo(Origen::class, 'origen_id');
    }
}
