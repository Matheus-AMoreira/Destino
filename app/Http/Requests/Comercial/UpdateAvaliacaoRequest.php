<?php

namespace App\Http\Requests\Comercial;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvaliacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nota' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}
