<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Foundation\Http\FormRequest;

class StorePacoteRequest extends FormRequest
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
            'nome' => ['required', 'string', 'max:100'],
            'descricao' => ['required', 'string'],
            'funcionario_id' => ['required', 'exists:users,id'],
            'pacote_foto_id' => ['nullable', 'exists:pacote_fotos,id'],
        ];
    }
}
