<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    protected $fillable = [
        'reference_code',
        'ticket_number',
        'user_id',
        'patient_name',
        'patient_phone',
        'nik',
        'department_id',
        'doctor_id',
        'appointment_date',
        'time_slot',
        'payment_method',
        'complaint',
        'status',
        'queue_number',
        'estimated_call',
        'people_ahead',
        'call_count',
        'called_at',
        'serving_at',
        'completed_at',
        'admin_note',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date',
            'people_ahead' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(AppointmentStatusHistory::class);
    }
}
