<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inventario_orden_entregas', function (Blueprint $table) {
            $table->unsignedBigInteger('movimiento_id')->after('destino_id');
            $table->enum('tipo_movimiento', ['solicitud_stock']);        
        });
    }

    public function down()
    {
        
    }
};
