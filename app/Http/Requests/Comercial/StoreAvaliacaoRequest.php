<?php

namespace App\Http\Requests\Comercial;

use Illuminate\Foundation\Http\FormRequest;

class StoreAvaliacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pacote_id' => ['required', 'integer', 'exists:pacotes,id'],
            'compra_id' => ['required', 'uuid', 'exists:compras,id'],
            'nota' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['nullable', 'string', 'max:500'],
        ];
    }
}
