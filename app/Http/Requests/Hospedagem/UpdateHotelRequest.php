<?php

namespace App\Http\Requests\Hospedagem;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:50'],
            'endereco' => ['sometimes', 'required', 'string', 'max:100'],
            'diaria' => ['sometimes', 'required', 'integer', 'min:0'],
            'cidade_id' => ['sometimes', 'required', 'exists:cidades,id'],
            'cep' => ['sometimes', 'nullable', 'string', 'max:9'],
            'cep_data' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
