<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mangrove;
use Illuminate\Http\Request;

class MangroveController extends Controller
{
    public function index(Request $request)
    {
        $resolution = $request->get('resolution', '250k');

        $mangroves = Mangrove::where('resolution', $resolution)->get();

        $geojson = [
            'type' => 'FeatureCollection',
            'features' => $mangroves->map(function ($mangrove) {
                return [
                    'type' => 'Feature',
                    'geometry' => $mangrove->geometry,
                    'properties' => $mangrove->properties ?? [],
                ];
            })->toArray(),
        ];

        return response()->json([
            'success' => true,
            'data' => $geojson,
        ]);
    }

    public function show($id)
    {
        $mangrove = Mangrove::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'type' => 'Feature',
                'geometry' => $mangrove->geometry,
                'properties' => $mangrove->properties ?? [],
            ],
        ]);
    }
}
