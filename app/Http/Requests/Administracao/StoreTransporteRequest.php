<?php

namespace App\Http\Requests\Administracao;

use App\Enums\Meio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransporteRequest extends FormRequest
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
            'empresa' => ['required', 'string', 'max:100'],
            'meio' => ['required', Rule::enum(Meio::class)],
            'preco' => ['required', 'integer', 'min:0'],
        ];
    }
}
