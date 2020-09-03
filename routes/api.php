<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::prefix('auth')->group(function (){
	Route::post('login', 'AuthController@login');
	Route::post('logout', 'AuthController@logout');
	Route::post('singup', 'AuthController@singup');
	Route::post('refresh', 'AuthController@refresh');
});

Route::prefix('structure')->group(function(){
	Route::get('', 'Structure\StructureController@structure');
	Route::get('users', 'Structure\StructureController@users');
});

Route::group(['middleware' => ['jwt.verify']], function() {
	Route::prefix('reagent')->group(function () {
		Route::prefix('storage')->group(function(){
			Route::get('', 'Reagent\StorageController@view');
			Route::get('all', 'Reagent\StorageController@viewAll');
			Route::post('expenses', 'Reagent\ExpensesController@create');
			Route::get('archives', 'Reagent\StorageController@viewArchive');
			Route::put('archive/{id}', 'Reagent\StorageController@toArchive');
			Route::get('print/{id}', 'Reagent\StorageController@print');
		});
		Route::prefix('arrivals')->group(function(){
			Route::get('', 'Reagent\ArrivalsController@view');
			Route::post('', 'Reagent\ArrivalsController@create');
			Route::get('{id}/materials', 'Reagent\ArrivalsController@materials');
			Route::put('updloc/{id}', 'Reagent\ArrivalsController@updateLocation');
		});
		Route::prefix('expenses')->group(function(){
			Route::get('', 'Reagent\ExpensesController@view');
			Route::post('correct', 'Reagent\ExpensesController@create_correct');
			Route::post('{id}/renewal', 'Reagent\ExpensesController@renewal');
		});
		Route::prefix('writeoff')->group(function(){
			Route::post('', 'Reagent\WriteoffController@view');
		});
		Route::prefix('material')->group(function(){
			Route::get('', 'Reagent\MaterialController@view');
		});
		Route::prefix('moving')->group(function(){
			Route::get('', 'Reagent\MovingController@view');
			Route::post('', 'Reagent\MovingController@create');
			Route::get('{id}/materials', 'Reagent\MovingController@materials');
			Route::put('allow/{id}/{from}', 'Reagent\MovingController@allowUpdate');
			Route::put('deny/{id}', 'Reagent\MovingController@denyUpdate');
		});
		Route::prefix('locations')->group(function(){
			Route::get('', 'Reagent\LocationController@view');
			Route::post('', 'Reagent\LocationController@create');
			Route::put('{id}', 'Reagent\LocationController@update');
		});
		Route::prefix('corrections')->group(function(){
			Route::get('', 'Reagent\CorrectionController@view');
			Route::put('allow/{id}', 'Reagent\CorrectionController@allowUpdate');
			Route::put('deny/{id}', 'Reagent\CorrectionController@denyUpdate');
		});
	});
	Route::prefix('equipment')->group(function () {
		Route::prefix('metrolog')->group(function(){
			Route::get('', 'Equipment\MetrologController@view');
			Route::post('', 'Equipment\EquipmentController@create');
		});
		Route::prefix('equipments')->group(function(){
			Route::get('{id}', 'Equipment\EquipmentController@view');
			Route::post('{id}/passed', 'Equipment\EquipmentController@passed');
			// Route::delete('{id}/{id_passed}/pdelete', 'Equipment\EquipmentController@deleteVerification');
			Route::put('{id}/update', 'Equipment\EquipmentController@update');
			Route::put('{id}/{inst}/iupdate', 'Equipment\EquipmentController@iupdate');
			Route::get('file/{name}', 'Equipment\EquipmentController@download');
			Route::post('{id}/moving', 'Equipment\EquipmentController@moving');
			Route::post('maintenance', 'Equipment\EquipmentController@maintenance');
		});
		Route::prefix('verification')->group(function(){
			Route::get('', 'Equipment\VerificationController@view');
			Route::post('', 'Equipment\VerificationController@create');
			Route::get('{id}/equipments', 'Equipment\VerificationController@equipments');
			Route::put('{check}/play', 'Equipment\VerificationController@play');
			Route::delete('{check}/vdelete', 'Equipment\VerificationController@check_delete');
			Route::delete('{id}/edelete', 'Equipment\VerificationController@eq_delete');
			Route::put('{check}/{id}/before', 'Equipment\VerificationController@before');
			Route::put('{check}/{id}/after', 'Equipment\VerificationController@after');
		});
		Route::prefix('support')->group(function(){
			Route::get('documents', 'Equipment\SupportController@docType');
			Route::get('locations', 'Equipment\SupportController@forNewEquipment');
			Route::get('maintenances', 'Equipment\SupportController@maintenances');
		});
		Route::prefix('instructions')->group(function(){
			Route::get('', 'Equipment\InstructionsController@view');
			Route::post('', 'Equipment\InstructionsController@create');
			Route::post('{id}/update', 'Equipment\InstructionsController@update');
			Route::get('file/{id}', 'Equipment\InstructionsController@download');
		});
		Route::prefix('maintenances')->group(function(){
			Route::get('', 'Equipment\MaintenancesController@view');
			Route::post('', 'Equipment\MaintenancesController@create');
			Route::put('{id}', 'Equipment\MaintenancesController@update');
		});
		Route::prefix('repair')->group(function(){
			Route::get('', 'Equipment\RepairController@view');
			Route::post('{id}', 'Equipment\RepairController@create');
			Route::put('{id}/allow', 'Equipment\RepairController@allow');
			Route::put('{id}/deny', 'Equipment\RepairController@deny');
			Route::put('{id}/finish', 'Equipment\RepairController@finish');
		});
		Route::prefix('printer')->group(function(){
			Route::post('sticker', 'Equipment\PrinterController@sticker');
			Route::post('table', 'Equipment\PrinterController@table');
			Route::post('protocol', 'Equipment\PrinterController@protocol');
			Route::post('csm', 'Equipment\PrinterController@csm');
		});
	});
});