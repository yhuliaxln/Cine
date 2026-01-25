<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'duracion',
        'genero',
        'fecha_estreno',
        'url_poster',
        'clasificacion',
        'en_cartelera',   // ← ¡AGREGA ESTO!
    ];

    public function funciones()
    {
        return $this->hasMany(Funcion::class);
    }
}
