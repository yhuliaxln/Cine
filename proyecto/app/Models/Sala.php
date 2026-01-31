<?php
// proyecto/app/Models/Sala.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'capacidad',
        'tipo',   // '2D', '3D', 'IMAX', 'VIP'
    ];

    // Una sala tiene muchos asientos
    public function asientos()
    {
        return $this->hasMany(Asiento::class);
    }

    // Una sala tiene muchas funciones
    public function funciones()
    {
        return $this->hasMany(Funcion::class);
    }
}