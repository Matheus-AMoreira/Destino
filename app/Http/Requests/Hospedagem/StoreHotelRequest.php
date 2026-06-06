<?php

namespace App\Http\Requests\Hospedagem;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:50'],
            'endereco' => ['required', 'string', 'max:100'],
            'diaria' => ['required', 'integer', 'min:0'],
            'cidade_id' => ['required', 'exists:cidades,id'],
            'cep' => ['nullable', 'string', 'max:9'],
            'cep_data' => ['nullable', 'array'],
        ];
    }
}
