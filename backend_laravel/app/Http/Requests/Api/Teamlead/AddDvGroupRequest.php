<?php

namespace App\Http\Requests\Api\Teamlead;

use Illuminate\Foundation\Http\FormRequest;

class AddDvGroupRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:device_groups,name',
            'user_ID' => 'required|integer|exists:users,user_id',
            'deviceList' => 'required|array',
            'deviceList.*.device_id' => 'required|integer|exists:devices,device_id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Tên nhóm thiết bị đã tồn tại.',
        ];
    }
}
