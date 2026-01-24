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
    Schema::create('asientos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('sala_id')->constrained('salas')->onDelete('cascade');
        $table->string('fila')->comment('Ej: A, B, C, ...');
        $table->integer('numero')->comment('Número del asiento en la fila');
        $table->string('tipo')->default('estandar')->comment('estandar, vip, discapacitado');
        $table->enum('estado', ['disponible', 'ocupado', 'reservado', 'mantenimiento'])->default('disponible');
        $table->timestamps();

        // Evita duplicados de asiento en la misma sala
        $table->unique(['sala_id', 'fila', 'numero']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asientos');
    }
};
