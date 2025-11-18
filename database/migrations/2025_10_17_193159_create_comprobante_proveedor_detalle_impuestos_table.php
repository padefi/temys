<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comprobantes_proveedores_detalles_impuestos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detalle_id')->constrained('comprobantes_proveedores_detalles')->onDelete('cascade');
            $table->foreignId('impuesto_id')->constrained('impuestos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comprobantes_proveedores_detalles_impuestos');
    }
};
