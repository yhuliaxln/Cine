<?php
// proyecto/database/migrations/2026_01_24_170807_create_peliculas_table.php

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
    Schema::create('salas', function (Blueprint $table) {
        $table->id();
        $table->string('nombre')->comment('Ej: Sala 1, Sala VIP, Sala 3D');
        $table->integer('capacidad');
        $table->string('tipo')->default('2D')->comment('2D, 3D, 4D, IMAX, VIP');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salas');
    }
};
