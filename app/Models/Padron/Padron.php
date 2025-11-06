<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Padron extends Model
{
    use HasFactory;

    protected $table = 'padron';

    protected $fillable = [
        'tipo_documento',
        'documento',
        'nacionalidad'
    ];

    protected $casts = [
        'tipo_documento' => 'string',
    ];
    ////CLIENTE RELACIONADO
    public function cliente()
    {
        return $this->hasOne(\App\Models\Padron\Cliente\Cliente::class, 'id_padron');
    }
}
