<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:50'],
            'endereco' => ['sometimes', 'required', 'string', 'max:100'],
            'diaria' => ['sometimes', 'required', 'integer', 'min:0'],
            'cidade_id' => ['sometimes', 'required', 'exists:cidades,id'],
        ];
    }
}
