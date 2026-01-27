<?php
// proyecto/app/Models/Funciones.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funciones extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelicula_id',
        'sala_id',
        'fecha_hora_inicio',
        'fecha_hora_fin',      
        'precio',
    ];

    protected $casts = [
        'fecha_hora_inicio' => 'datetime',
        'fecha_hora_fin'    => 'datetime',
    ];

    public function pelicula()
    {
        return $this->belongsTo(Pelicula::class);
    }

    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}