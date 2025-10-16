<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SavedLocationController extends Controller
{
    public function index(Request $request)
    {
        $savedLocations = $request->user()->savedLocations()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $savedLocations
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location_type' => 'required|in:mangrove,plantation',
            'location_data' => 'required|array',
            'name' => 'required|string|max:255',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $savedLocation = $request->user()->savedLocations()->create([
            'location_type' => $request->location_type,
            'location_data' => $request->location_data,
            'name' => $request->name,
            'notes' => $request->notes
        ]);

        return response()->json([
            'success' => true,
            'data' => $savedLocation
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $savedLocation = $request->user()->savedLocations()->find($id);

        if (!$savedLocation) {
            return response()->json([
                'success' => false,
                'message' => 'Saved location not found'
            ], 404);
        }

        $savedLocation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Saved location deleted successfully'
        ]);
    }
}
