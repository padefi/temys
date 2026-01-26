<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PadronCbu extends Model
{
    use HasFactory;

    protected $table = 'padron_cbus';

    protected $fillable = [
        'tipo',
        'tipo_id',
        'tipo_clave',
        'clave',
        'alias',
        'banco',
        'tipo_cuenta',
        'predeterminado',
    ];

    public function titular()
    {
        return $this->morphTo(null, 'tipo', 'tipo_id');
    }
}
