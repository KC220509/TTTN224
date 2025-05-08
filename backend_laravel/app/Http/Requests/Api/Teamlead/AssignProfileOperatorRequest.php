<?php

namespace App\Http\Requests\Api\Teamlead;

use Illuminate\Foundation\Http\FormRequest;

class AssignProfileOperatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'profile_IDs' => 'required|array',
            'profile_IDs.*' => 'exists:profiles,profile_id',
            'operator_ID' => 'required|exists:users,user_id',
            'user_ID' => 'required|exists:users,user_id',
        ];
    }
}
