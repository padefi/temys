<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tipo_comprobantes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('codigo_arca', 5)->nullable()->comment('Código según ARCA');
            $table->enum('signo', ['debe','haber'])->default('debe')->comment('Determina si afecta al debe o al haber');
            $table->enum('categoria', ['factura','nota_credito','nota_debito','anticipo','recibo','otros'])->default('otros');
            $table->boolean('afecta_saldo')->default(true);
            $table->boolean('habilitado')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tipo_comprobantes');
    }
};
