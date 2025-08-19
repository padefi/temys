<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Branch extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'street_id',
        'number',
        'phone',
        'email',
        'status',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    /* public function street()
    {
        return $this->belongsTo(Street::class, 'street_id');
    } */

    public function userCreated()
    {
        return $this->belongsTo(User::class, 'model_id_created');
    }

    public function userUpdated()
    {
        return $this->belongsTo(User::class, 'model_id_updated');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'model_has_branches', 'branch_id', 'model_id');
    }
}
