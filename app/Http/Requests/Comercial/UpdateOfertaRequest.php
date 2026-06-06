<?php

namespace App\Http\Requests\Comercial;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfertaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'preco' => ['sometimes', 'required', 'numeric', 'min:0'],
            'inicio' => ['sometimes', 'required', 'date'],
            'fim' => ['sometimes', 'required', 'date', 'after_or_equal:inicio'],
            'disponibilidade' => ['sometimes', 'required', 'integer', 'min:0'],
            'pacote_id' => ['sometimes', 'required', 'exists:pacotes,id'],
            'hotel_id' => ['sometimes', 'required', 'exists:hotels,id'],
            'transporte_id' => ['sometimes', 'required', 'exists:transportes,id'],
        ];
    }
}
