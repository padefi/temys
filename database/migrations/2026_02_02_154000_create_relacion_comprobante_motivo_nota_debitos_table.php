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
        Schema::create('relacion_comprobante_motivo_nota_debito', function (Blueprint $table) {
            $table->id();
             // 🔹 Comprobante origen (ej: Anticipo, NC)
            $table->unsignedBigInteger('comprobante_id');

            // 🔹 Comprobante destino (ej: Factura)
            $table->unsignedBigInteger('motivo_nota_debito_id');

            // 🔹 Foreign keys
            $table->foreign('comprobante_id','fk_comp_nd_id')
                ->references('id')
                ->on('comprobantes')
                ->onDelete('cascade');

            $table->foreign('motivo_nota_debito_id','fk_motivo_nota_deb_id')
                ->references('id')
                ->on('motivos_nota_debito')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_motivo_nota_debito');
    }
};
