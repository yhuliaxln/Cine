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
    Schema::create('peliculas', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->text('descripcion')->nullable();
        $table->integer('duracion')->comment('Duración en minutos');
        $table->string('genero')->nullable();
        $table->date('fecha_estreno')->nullable();
        $table->string('url_poster')->nullable()->comment('URL del póster');
        $table->string('url_trailer')->nullable()->comment('URL del tráiler');
        $table->string('clasificacion')->nullable()->comment('Ej: ATP, +7, +12, +15, +18');
        $table->boolean('en_cartelera')->default(false)->comment('Está actualmente en cartelera');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peliculas');
    }
};
