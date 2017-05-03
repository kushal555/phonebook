<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contact;
use App\PhoneNumber;
use Illuminate\Support\Facades\Lang;
use Yajra\Datatables\Datatables;

class ContactController extends Controller
{


    public function showDataTable(){

        $contacts = Contact::with('phoneNumbers');
        return Datatables::of($contacts)
                        ->make(true);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //

        $users = Contact::select(['id', 'name', 'email', 'created_at', 'updated_at'])->get();

        return Datatables::of($users)->make();
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
       
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
         

        $contact = new Contact;
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->sex = $request->sex;
        $contact->home_address = $request->home_address;
        $contact->website = $request->website;
        $contact->save();

        foreach($request->phone_numbers as $key=>$phone){
            $phone_number = new PhoneNumber;
            $phone_number->phone_number = $phone['phone_number'];
            $phone_number->number_type = $phone['number_type'];
            $phone_number->contact_id = $contact->id;
            $phone_number->save();
        }

       
         return response()->json(['message' => "Your are contact is saved"], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
