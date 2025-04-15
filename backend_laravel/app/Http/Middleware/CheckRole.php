<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $roleID): Response
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Vui lòng đăng nhập'], 401);
        }

        if (Auth::user()->role_ID != $roleID) {
            
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }
        return $next($request); 
    }

}
