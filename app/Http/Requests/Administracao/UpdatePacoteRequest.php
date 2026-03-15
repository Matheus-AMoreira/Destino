<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePacoteRequest extends FormRequest
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
            'nome' => ['sometimes', 'required', 'string', 'max:100'],
            'descricao' => ['sometimes', 'required', 'string'],
            'tags' => ['sometimes', 'nullable', 'string'],
            'funcionario_id' => ['sometimes', 'required', 'exists:users,id'],
            'pacote_foto_id' => ['nullable', 'exists:pacote_fotos,id'],
        ];
    }
}
