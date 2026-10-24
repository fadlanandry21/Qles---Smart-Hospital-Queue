<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'slug',
        'code',
        'prefix',
        'name',
        'counter',
        'room',
        'description',
        'avg_service_time_minutes',
        'current_number',
        'next_number',
        'total_waiting',
        'status',
        'last_called_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'avg_service_time_minutes' => 'integer',
            'total_waiting' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
