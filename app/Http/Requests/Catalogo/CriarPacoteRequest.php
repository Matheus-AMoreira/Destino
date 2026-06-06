<?php

namespace App\Http\Requests\Catalogo;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $nome
 * @property-read string $descricao
 * @property-read string|null $tags
 * @property-read string $funcionario_id
 * @property-read int|null $pacote_foto_id
 */
class CriarPacoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:100'],
            'descricao' => ['required', 'string'],
            'tags' => ['nullable', 'string'],
            'funcionario_id' => ['required', 'exists:users,id'],
            'pacote_foto_id' => ['nullable', 'exists:pacote_fotos,id'],
        ];
    }
}
