<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::table('inventario_movimiento_stocks', function (Blueprint $table) {
            // Agregamos columnas para relación polimórfica
            $table->unsignedBigInteger('movible_id')->nullable()->after('tipo_movimiento');
            $table->string('movible_type')->nullable()->after('movible_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventario_movimiento_stocks', function (Blueprint $table) {
            $table->dropColumn(['movible_id', 'movible_type']);
        });
    }
};
