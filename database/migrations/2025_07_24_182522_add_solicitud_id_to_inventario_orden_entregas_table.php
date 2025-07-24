<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inventario_orden_entregas', function (Blueprint $table) {
            $table->unsignedBigInteger('solicitud_id')->after('destino_id');

            $table->foreign('solicitud_id')
                ->references('id')
                ->on('inventario_solicitar_stocks')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('inventario_orden_entregas', function (Blueprint $table) {
            $table->dropForeign(['solicitud_id']);
            $table->dropColumn('solicitud_id');
        });
    }
};
