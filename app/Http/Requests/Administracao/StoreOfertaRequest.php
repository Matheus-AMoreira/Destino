<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfertaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'preco' => ['required', 'numeric', 'min:0'],
            'inicio' => ['required', 'date'],
            'fim' => ['required', 'date', 'after_or_equal:inicio'],
            'disponibilidade' => ['required', 'integer', 'min:0'],
            'pacote_id' => ['required', 'exists:pacotes,id'],
            'hotel_id' => ['required', 'exists:hotels,id'],
            'transporte_id' => ['required', 'exists:transportes,id'],
        ];
    }
}
