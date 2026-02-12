<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Model;

class Nacionalidad extends Model
{
    protected $table = 'nacionalidades';
    protected $primaryKey = 'id_nac';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id_nac',
        'nacionalidad',
        'orden',
    ];
}
