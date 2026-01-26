<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('relacion_comprobante_comprobante', function (Blueprint $table) {
            $table->id();

            // 🔹 Comprobante origen (ej: Anticipo, NC)
            $table->unsignedBigInteger('comprobante_origen_id');

            // 🔹 Comprobante destino (ej: Factura)
            $table->unsignedBigInteger('comprobante_destino_id');

            // 🔹 Foreign keys
            $table->foreign('comprobante_origen_id', 'fk_comp_origen')
                ->references('id')
                ->on('comprobantes')
                ->onDelete('cascade');

            $table->foreign('comprobante_destino_id', 'fk_comp_destino')
                ->references('id')
                ->on('comprobantes')
                ->onDelete('cascade');

            // 🔹 Importe aplicado
            $table->decimal('importe_aplicado', 12, 2);

            $table->date('fecha_aplicacion')->nullable();

            $table->timestamps();


        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_comprobante');
    }
};
