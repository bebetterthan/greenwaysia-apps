<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::where('is_published', true);

        if ($request->has('limit')) {
            $query->limit($request->limit);
        }

        $news = $query->orderBy('published_at', 'desc')->get();

        $lang = $request->get('lang', 'en');

        $newsData = $news->map(function ($item) use ($lang) {
            return [
                'id' => $item->id,
                'title' => $lang === 'id' ? $item->title_id : $item->title_en,
                'content' => $lang === 'id' ? $item->content_id : $item->content_en,
                'image_url' => $item->image_url,
                'external_link' => $item->external_link,
                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $newsData,
        ]);
    }

    public function show($id, Request $request)
    {
        $news = News::where('is_published', true)->findOrFail($id);

        $lang = $request->get('lang', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $news->id,
                'title' => $lang === 'id' ? $news->title_id : $news->title_en,
                'content' => $lang === 'id' ? $news->content_id : $news->content_en,
                'image_url' => $news->image_url,
                'external_link' => $news->external_link,
                'published_at' => $news->published_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }
}
