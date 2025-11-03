<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventario_recepcion_productos', function (Blueprint $table) {
            $table->dropColumn('movimiento_id');
        });
    }

    public function down(): void
    {
        Schema::table('inventario_recepcion_productos', function (Blueprint $table) {
            $table->unsignedBigInteger('movimiento_id')->nullable()->after('tipo_movimiento');
        });
    }
};
