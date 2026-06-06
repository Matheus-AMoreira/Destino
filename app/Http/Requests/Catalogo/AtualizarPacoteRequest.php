<?php

namespace App\Http\Requests\Catalogo;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string|null $nome
 * @property-read string|null $descricao
 * @property-read string|null $tags
 * @property-read string|null $funcionario_id
 * @property-read int|null $pacote_foto_id
 */
class AtualizarPacoteRequest extends FormRequest
{
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
