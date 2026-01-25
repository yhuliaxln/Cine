<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'funcion_id',
        'asiento_id',
        'user_id',
        'precio',
        'estado',
        'metodo_pago',
    ];

    public function funcion()
    {
        return $this->belongsTo(Funciones::class);   // ← Funciones (con "es")
    }

    public function asiento()
    {
        return $this->belongsTo(Asientos::class);    // ← Asientos (con "es")
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}