<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_tramite_plan_pago', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tipo_tramite_id');
            $table->unsignedBigInteger('plan_pago_id');

            $table->foreign('tipo_tramite_id')->references('id')->on('tipo_tramites')->onDelete('cascade');
            $table->foreign('plan_pago_id')->references('id')->on('plan_pagos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_tramite_plan_pago');
    }
};
