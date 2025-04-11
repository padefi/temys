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
        Schema::create('modules', function (Blueprint $table)
        {
            $table->id();
            $table->string('name')->collation('utf8mb4_general_ci')->unique();
            $table->timestamps();
        });

        Schema::create('role_has_modules', function (Blueprint $table)
        {
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('role_id');

            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->onDelete('cascade');

            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->onDelete('cascade');

            $table->primary(['module_id', 'role_id'], 'role_has_modules_module_id_role_id_primary');
        });

        Schema::create('model_has_modules', function (Blueprint $table)
        {
            $table->unsignedBigInteger('module_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_modules_model_id_model_type_index');
            $table->primary(['module_id', 'model_id', 'model_type'], 'model_has_modules_module_model_type_primary');
        });

        Schema::create('model_has_module_rol', function (Blueprint $table)
        {
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('role_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->onDelete('cascade');
                
            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_module_rol_model_id_model_type_index');
            $table->primary(['module_id', 'role_id', 'model_id', 'model_type'], 'model_has_module_rol_module_model_type_role_id_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('role_has_modules', function (Blueprint $table)
        {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::table('model_has_modules', function (Blueprint $table)
        {
            $table->dropForeign(['module_id']);
        });

        Schema::table('model_has_module_rol', function (Blueprint $table)
        {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::dropIfExists('modules');
        Schema::dropIfExists('role_has_modules');
        Schema::dropIfExists('model_has_modules');
        Schema::dropIfExists('model_has_module_rol');
    }
};
