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
        Schema::create('relacion_comprobante_motivo_reembolso', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('comprobante_id');
            $table->unsignedBigInteger('motivo_reembolso_id');

            $table->foreign('comprobante_id')
                ->references('id')
                ->on('comprobantes')
                ->onDelete('cascade');

            $table->foreign('motivo_reembolso_id', 'fk_motivo_reembolso')
                ->references('id')
                ->on('motivos_reembolso')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_motivo_reembolso');
    }
};
