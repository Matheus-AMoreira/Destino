<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
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
            'nome' => ['required', 'string', 'max:50'],
            'endereco' => ['required', 'string', 'max:100'],
            'diaria' => ['required', 'integer', 'min:0'],
            'cidade_id' => ['required', 'exists:cidades,id'],
        ];
    }
}
