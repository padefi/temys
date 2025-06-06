<?php

namespace App\Models;

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

    public function cliente()
{
    return $this->hasOne(Cliente::class, 'id_padron');
}
}
