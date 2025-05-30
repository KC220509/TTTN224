<?php

namespace App\Http\Requests\Api\Teamlead;

use Illuminate\Foundation\Http\FormRequest;

class AddProfileRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'command_list_id' => 'required|exists:command_lists,command_list_id',
            'device_group_id' => 'required|exists:device_groups,device_group_id',
            'user_ID' => 'required|integer|exists:users,user_id',
        ];
    }
}
