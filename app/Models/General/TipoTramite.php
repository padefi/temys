<?php
namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\PlanPago;

class TipoTramite extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'habilitado'];
    ////PLANES DE PAGO RELACIONADOS
    public function planesPago()
    {
        return $this->belongsToMany(PlanPago::class, 'tipo_tramite_plan_pago');
    }
}
