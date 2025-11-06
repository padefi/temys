<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 🔹 Cambiar enum
        DB::statement("ALTER TABLE inventario_recepcion_productos MODIFY COLUMN estado ENUM('Completa','Parcial','Pendiente','Cancelado') NOT NULL DEFAULT 'Pendiente'");

        // 🔹 Agregar columna de relación
        Schema::table('inventario_recepcion_productos', function (Blueprint $table) {
            $table->unsignedBigInteger('orden_entrega_id')->nullable()->after('destino_id');
            $table->foreign('orden_entrega_id')
                  ->references('id')
                  ->on('inventario_orden_entregas')
                  ->onDelete('set null');
        });

    }

    public function down(): void
    {
        Schema::table('inventario_recepcion_productos', function (Blueprint $table) {
            $table->dropForeign(['orden_entrega_id']);
            $table->dropColumn('orden_entrega_id');
        });

        // Volver a enum original
        DB::statement("ALTER TABLE inventario_recepcion_productos MODIFY COLUMN estado ENUM('Completa','Parcial','Pendiente') NOT NULL DEFAULT 'Pendiente'");

       
    }
};