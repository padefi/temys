<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('condicion_iva', function (Blueprint $table) {
            $table->id(); // id bigint autoincremental
            $table->string('descripcion', 100)->unique();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('condicion_iva');
    }
};
