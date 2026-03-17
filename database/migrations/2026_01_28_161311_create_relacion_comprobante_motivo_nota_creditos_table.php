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
        Schema::create('relacion_comprobante_motivo_nota_credito', function (Blueprint $table) {
            $table->id();
             // 🔹 Comprobante origen (ej: Anticipo, NC)
            $table->unsignedBigInteger('comprobante_id');

            // 🔹 Comprobante destino (ej: Factura)
            $table->unsignedBigInteger('motivo_nota_credito_id');

            // 🔹 Foreign keys
            $table->foreign('comprobante_id','fk_comp_id')
                ->references('id')
                ->on('comprobantes')
                ->onDelete('cascade');

            $table->foreign('motivo_nota_credito_id','fk_motivo_nota_cred')
                ->references('id')
                ->on('motivos_nota_credito')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_motivo_nota_credito');
    }
};
