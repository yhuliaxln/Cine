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
    Schema::create('tickets', function (Blueprint $table) {
        $table->id();
        $table->foreignId('funcion_id')->constrained('funciones')->onDelete('cascade');
        $table->foreignId('asiento_id')->constrained('asientos')->onDelete('restrict');
        $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null')
            ->comment('Empleado que vendió el ticket');
        $table->decimal('precio', 10, 2);
        $table->enum('estado', ['vendido', 'reservado', 'reembolsado'])->default('vendido');
        $table->string('metodo_pago')->nullable()->comment('efectivo, tarjeta, transferencia');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
