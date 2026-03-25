<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_adjuntos', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion', 100);
            $table->boolean('habilitado')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion')->nullable();
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            $table->unique('descripcion');

            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });

        DB::table('tipo_adjuntos')->insert([
            [
                'id' => 1,
                'descripcion' => 'CONSTANCIA DE INSCRIPCION',
                'habilitado' => 1,
                'fecha_creacion' => now(),
                'usuario_creacion' => null,
                'fecha_actualizacion' => null,
                'usuario_actualizacion' => null,
            ],
            [
                'id' => 2,
                'descripcion' => 'CONSTANCIA DE CBU',
                'habilitado' => 1,
                'fecha_creacion' => now(),
                'usuario_creacion' => null,
                'fecha_actualizacion' => null,
                'usuario_actualizacion' => null,
            ],
            [
                'id' => 3,
                'descripcion' => 'EXENCIONES',
                'habilitado' => 1,
                'fecha_creacion' => now(),
                'usuario_creacion' => null,
                'fecha_actualizacion' => null,
                'usuario_actualizacion' => null,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_adjuntos');
    }
};
