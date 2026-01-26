<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_comprobantes_plan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comprobante_id');
            $table->unsignedBigInteger('plan_id');

            // Nombres más cortos para las FKs
            $table->foreign('comprobante_id', 'fk_rcp_comprobante')
                  ->references('id')->on('comprobantes')
                  ->onDelete('cascade');

            $table->foreign('plan_id', 'fk_rcp_plan')
                  ->references('id')->on('plan')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobantes_plan');
    }
};
