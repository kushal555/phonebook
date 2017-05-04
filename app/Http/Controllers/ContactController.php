<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contact;
use App\PhoneNumber;
use Illuminate\Support\Facades\Lang;
use Yajra\Datatables\Datatables;
use Validator;
use Carbon\Carbon;
use Excel;

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
        $contact= Contact::where("id",$id)->with('phoneNumbers')->first();
         return response()->json(['contact' => $contact], 200);
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
        $contact = Contact::find($id);
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->sex = $request->sex;
        $contact->home_address = $request->home_address;
        $contact->website = $request->website;
        $contact->save();

        // Delete the Deleted Phone number
        // foreach($request->phone_numbers_delete as $phone){
        //     $phone_number = isset($phone['id'])? PhoneNumber::find($phone['id']): new PhoneNumber;
        //     $phone_number->phone_number = $phone['phone_number'];
        //     $phone_number->number_type = $phone['number_type'];
        //     $phone_number->contact_id = $contact->id;
        //     $phone_number->save();
        // }
        if(!empty($request->phone_numbers_delete)){
            PhoneNumber::destroy($request->phone_numbers_delete);
        }
        
         foreach($request->phone_numbers as $key=>$phone){
            $phone_number = isset($phone['id'])? PhoneNumber::find($phone['id']): new PhoneNumber;
            $phone_number->phone_number = $phone['phone_number'];
            $phone_number->number_type = $phone['number_type'];
            $phone_number->contact_id = $contact->id;
            $phone_number->save();
        }
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

    public function getGenderRatio(){

        $user_info = \DB::table('contacts')
                 ->select('sex', \DB::raw('count(*) as total'))
                 ->groupBy('sex')
                 ->get();
       #$contact =Contact::groupBy('sex')->count();
       
    //     list($key,$value)=array_divide($user_info);
    //    print_r($key);exit;
    //    dd($key);
       return response()->json(['contact' => $user_info], 200);
    }

    public function importCsvFile(Request $request){
        // dd($request->files->extension());
        
        $current_time = Carbon::now()->toDayDateTimeString();
        Validator::make($request->all(),["files"=>"required|mimes:csv,txt"])->validate();
        $path = $request->files->move('files', $current_time.'.csv');
        dd($path);
    }
}
