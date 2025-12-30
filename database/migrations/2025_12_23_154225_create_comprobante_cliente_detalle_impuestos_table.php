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
        Schema::create('comprobantes_clientes_detalles_impuestos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('detalle_id')
                ->constrained('comprobantes_clientes_detalles') // 👈 PLURAL
                ->onDelete('cascade');

            $table->foreignId('impuesto_id')
                ->constrained('impuestos')
                ->onDelete('cascade');

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes_clientes_detalles_impuestos');
    }
};
