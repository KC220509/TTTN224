<?php

namespace App\Http\Requests\Api\Teamlead;

use Illuminate\Foundation\Http\FormRequest;

class AddDeviceRequest extends FormRequest
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
            'ip_address' => 'required|ip',
            'ssh_port' => 'required|integer|min:1|max:65535',
            'user_ID' => 'required|integer|exists:users,user_id',
        ];
    }

    public function messages(): array
    {
        return [
            'ip_address.ip' => 'Địa chỉ IP không hợp lệ.',
            'user_ID.exists' => 'Người dùng không tồn tại trong hệ thống.',
        ];
    }
}
