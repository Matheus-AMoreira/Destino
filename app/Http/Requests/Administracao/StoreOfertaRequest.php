<?php

namespace App\Http\Requests\Administracao;

use App\Enums\OfertaStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'status' => ['required', Rule::enum(OfertaStatus::class)],
            'pacote_id' => ['required', 'exists:pacotes,id'],
            'hotel_id' => ['required', 'exists:hotels,id'],
            'transporte_id' => ['required', 'exists:transportes,id'],
        ];
    }
}
