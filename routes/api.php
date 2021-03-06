<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('get-contacts','ContactController@showDataTable');
Route::get('get-gender-ratio','ContactController@getGenderRatio');
Route::post('import-contacts','ContactController@importCsvFile');


Route::resource('contacts', 'ContactController');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');
