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
        Schema::create('comprobantes_clientes_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comprobante_cliente_id')->constrained('comprobantes_clientes')->onDelete('cascade')->name('fk_compclieid_comclie');
            $table->foreignId('producto_id')->constrained('productos');
            $table->string('descripcion');
            $table->string('modelo')->nullable();
            $table->foreignId('unidad_medida_id')->constrained('unidades_medida');
            $table->decimal('cantidad', 15, 2);
            $table->decimal('precio_unitario', 15, 2);
            $table->decimal('porcentaje_descuento', 5, 2)->default(0);
            $table->foreignId('co_cuenta_id')->constrained('co_cuentas');
            $table->decimal('importe', 15, 2);
            $table->foreignId('usuario_creacion')->constrained('users');
            $table->foreignId('usuario_actualizacion')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes_clientes_detalles');
    }
};
