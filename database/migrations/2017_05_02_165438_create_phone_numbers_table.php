<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhoneNumbersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('phone_numbers', function (Blueprint $table) {
            $table->increments('id');

            $table->string('phone_number')->nullable();
            $table->string('number_type')->nullable();
            $table->integer('contact_id')->unsigned();
            $table->timestamps();

             $table->foreign('contact_id')->references('id')->on('contacts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('phone_numbers', function (Blueprint $table) {
           $table->dropForeign(['contact_id']);
        });
        Schema::dropIfExists('phone_numbers');
    }
}
