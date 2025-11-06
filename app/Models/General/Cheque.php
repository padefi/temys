<?php
// app/Models/General/Cheque.php
namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cheque extends Model
{
    protected $table='cheques';
    use HasFactory;

    protected $fillable = [
        'numero', 'cuenta_bancaria_id'
    ];
    ////CUENTA BANCARIA RELACIONADA
    public function cuentaBancaria() {
        return $this->belongsTo(CuentaBancaria::class);
    }
}
