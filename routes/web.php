<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(public_path('index.html'));
});

Route::get('/about', function () {
    return response()->file(public_path('about.html'));
});

Route::get('/contact', function () {
    return response()->file(public_path('contact.html'));
});

Route::get('/impacts', function () {
    return response()->file(public_path('impacts.html'));
});

Route::get('/maps', function () {
    return response()->file(public_path('maps.html'));
});

Route::get('/news', function () {
    return response()->file(public_path('news.html'));
});

Route::get('/login', function () {
    return response()->file(public_path('login.html'));
});

Route::get('/register', function () {
    return response()->file(public_path('register.html'));
});

Route::get('/forgot-password', function () {
    return response()->file(public_path('forgot-password.html'));
});

Route::get('/profile', function () {
    return response()->file(public_path('profile.html'));
});

Route::get('/saved-locations', function () {
    return response()->file(public_path('saved-locations.html'));
});
