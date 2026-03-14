<?php

namespace App\Http\Requests\Administracao;

use App\Enums\Meio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransporteRequest extends FormRequest
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
            'empresa' => ['sometimes', 'required', 'string', 'max:100'],
            'meio' => ['sometimes', 'required', Rule::enum(Meio::class)],
            'preco' => ['sometimes', 'required', 'integer', 'min:0'],
        ];
    }
}
