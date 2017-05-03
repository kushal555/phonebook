<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    //

    /**
     * Get the PhoneNumbers 
     */
    public function phoneNumbers()
    {
        return $this->hasMany('App\PhoneNumber');
    }
}
