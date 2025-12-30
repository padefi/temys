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
        Schema::create('comprobantes_clientes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->foreign('cliente_id')->references('id')->on('clientes');
            $table->date('fecha_factura');
            $table->date('fecha_vencimiento')->nullable();
            $table->foreignId('condicion_venta_id')->constrained('condiciones_venta');
            $table->string('punto_venta', 10);
            $table->string('numero_factura', 20);
            $table->foreignId('tipo_comprobante_id')->constrained('tipo_comprobantes'); // ej: Factura A, Recibo, etc.
            $table->unsignedBigInteger('moneda_id');
            $table->foreign('moneda_id')->references('id')->on('tipo_monedas')->nullable();
            $table->string('estado')->default('Pendiente'); // Pendiente, Pagado, Anulado, etc.
            $table->text('descripcion')->nullable();
            $table->foreignId('usuario_creacion')->constrained('users');
            $table->timestamps();

            $table->unique(
                ['cliente_id', 'tipo_comprobante_id', 'punto_venta', 'numero_factura'],
                'comprobante_unico_por_cliente'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobante_clientes');
    }
};
