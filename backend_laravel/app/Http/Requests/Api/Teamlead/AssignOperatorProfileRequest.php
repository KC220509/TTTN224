<?php

namespace App\Http\Requests\Api\Teamlead;

use Illuminate\Foundation\Http\FormRequest;

class AssignOperatorProfileRequest extends FormRequest
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
            'operator_IDs' => 'required|array',
            'operator_IDs.*' => 'required|exists:users,user_id',
            'profile_ID' => 'exists:profiles,profile_id',
            'user_ID' => 'required|exists:users,user_id',
        ];
    }
}
