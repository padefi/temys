<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comprobantes_proveedores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proveedor_id');
            $table->foreign('proveedor_id')->references('id')->on('proveedores');
            $table->date('fecha_factura');
            $table->date('fecha_vencimiento')->nullable();
            $table->foreignId('condicion_venta_id')->constrained('condiciones_venta');
            $table->string('punto_venta', 10);
            $table->string('numero_factura', 20);
            $table->foreignId('tipo_comprobante_id')->constrained('tipo_comprobantes'); // ej: Factura A, Recibo, etc.
            $table->unsignedBigInteger('moneda_id');
            $table->foreign('moneda_id')->references('id')->on('tipo_monedas');
            $table->string('estado')->default('Pendiente'); // Pendiente, Pagado, Anulado, etc.
            $table->text('descripcion')->nullable();
            $table->foreignId('usuario_creacion')->constrained('users');
            $table->timestamps();

            $table->unique(
                ['proveedor_id', 'tipo_comprobante_id', 'punto_venta', 'numero_factura'],
                'comprobante_unico_por_proveedor'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comprobantes_proveedores');
    }
};
