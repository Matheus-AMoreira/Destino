<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePacoteFotoRequest extends FormRequest
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
            'foto_capa_file' => ['nullable', 'prohibits:foto_capa_url', 'image', 'max:20480'],
            'foto_capa_url' => ['nullable', 'prohibits:foto_capa_file', 'url'],
            'itens' => ['nullable', 'array'],
            'itens.*.id' => ['nullable', 'integer'], // To identify existing items
            'itens.*.file' => ['nullable', 'prohibits:itens.*.url', 'image', 'max:20480'],
            'itens.*.url' => ['nullable', 'prohibits:itens.*.file', 'url'],
            'itens.*.deleted' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'foto_capa_file.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para a capa.',
            'foto_capa_url.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para a capa.',
            'foto_capa_file.max' => 'A imagem de capa não deve exceder 20MB.',
            'itens.*.file.max' => 'Cada imagem auxiliar não deve exceder 20MB.',
            'itens.*.file.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para um item auxiliar.',
            'itens.*.url.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para um item auxiliar.',
        ];
    }
}
