<?php
namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Model;

class ComprobanteArchivo extends Model
{
    protected $table = 'comprobante_archivos';
    protected $fillable = ['comprobante_id', 'nombre', 'path', 'mime', 'size'];

    ////COMPROBANTE RELACIONADO
    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }
}
