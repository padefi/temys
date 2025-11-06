<?php
// app/Models/General/CuentaBancaria.php
namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banco extends Model
{
    protected $table='bancos';
    use HasFactory;

    protected $fillable = [
        'banco', 'sucursal', 'codigo_sucursal', 'direccion',
        'telefono', 'contacto', 'mail', 'observaciones'
    ];
    ////CUENTA BANCARIA RELACIONADA
    public function cuentaBancaria()
    {
        return $this->hasMany(CuentaBancaria::class, 'banco_id');
    }
    ////CHEQUES RELACIONADOS
    public function cheques() {
        return $this->hasMany(Cheque::class);
    }
}
