<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Doctor extends Model
{
    protected $fillable = [
        'department_id',
        'slug',
        'name',
        'title',
        'specialization',
        'rating',
        'reviews_count',
        'experience',
        'education',
        'str_number',
        'photo',
        'fee',
        'days',
        'clinic_room',
        'time_slots',
        'bio',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'reviews_count' => 'integer',
            'days' => 'array',
            'time_slots' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
