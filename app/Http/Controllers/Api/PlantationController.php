<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plantation;
use Illuminate\Http\Request;

class PlantationController extends Controller
{
    public function index(Request $request)
    {
        $query = Plantation::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('country')) {
            $query->where('country', $request->country);
        }

        $plantations = $query->get();

        $geojson = [
            'type' => 'FeatureCollection',
            'features' => $plantations->map(function ($plantation) {
                return [
                    'type' => 'Feature',
                    'geometry' => $plantation->geometry,
                    'properties' => [
                        'id' => $plantation->id,
                        'objectid' => $plantation->objectid,
                        'type' => $plantation->type,
                        'percent' => $plantation->percent,
                        'spec_1' => $plantation->spec_1,
                        'spec_2' => $plantation->spec_2,
                        'spec_3' => $plantation->spec_3,
                        'spec_4' => $plantation->spec_4,
                        'spec_5' => $plantation->spec_5,
                        'spec_simp' => $plantation->spec_simp,
                        'country' => $plantation->country,
                    ],
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
        $plantation = Plantation::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'type' => 'Feature',
                'geometry' => $plantation->geometry,
                'properties' => [
                    'id' => $plantation->id,
                    'objectid' => $plantation->objectid,
                    'type' => $plantation->type,
                    'percent' => $plantation->percent,
                    'spec_1' => $plantation->spec_1,
                    'spec_2' => $plantation->spec_2,
                    'spec_3' => $plantation->spec_3,
                    'spec_4' => $plantation->spec_4,
                    'spec_5' => $plantation->spec_5,
                    'spec_simp' => $plantation->spec_simp,
                    'country' => $plantation->country,
                ],
            ],
        ]);
    }
}
