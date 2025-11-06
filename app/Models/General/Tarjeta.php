<?php
// app/Models/General/Tarjeta.php
namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarjeta extends Model
{
    protected $table='tarjetas';
    use HasFactory;

    protected $fillable = [
        'tipo', 'numero_tarjeta', 'cuenta_bancaria_id', 'vencimiento',
        'nombre_titular', 'cuenta'
    ];
    ////CUENTA BANCARIA RELACIONADA
    public function cuentaBancaria()
    {
        return $this->belongsTo(CuentaBancaria::class, 'cuenta_bancaria_id');
    }

}

