<?php

namespace App\Http\Requests\Api\Operator;

use Illuminate\Foundation\Http\FormRequest;

class SendSshRequest extends FormRequest
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
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'host' => 'required|ip',
            'port' => 'required|integer|min:1|max:65535',
            'command' => 'string|max:255'
        ];
    }
}
