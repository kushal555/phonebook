<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PhoneNumber extends Model
{
    //
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'phone_numbers';

    /**
    * Get the post that owns the comment.
    */
    public function contact()
    {
        return $this->belongsTo('App\Contact');
    }
}
