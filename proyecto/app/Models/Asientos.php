<?php
// proyecto/app/Models/Asientos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asientos extends Model
{
    use HasFactory;

    protected $fillable = [
        'sala_id',
        'fila',
        'numero',
        'estado',    // 'disponible', 'ocupado', 'reservado', 'inhabilitado'
        'tipo',      // 'estandar', 'vip', 'discapacitado'
    ];

    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }

    // Un asiento puede estar en muchos tickets (histórico)
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}