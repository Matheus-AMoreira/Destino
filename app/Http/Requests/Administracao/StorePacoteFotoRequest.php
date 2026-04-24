<?php

namespace App\Http\Requests\Administracao;

use Illuminate\Foundation\Http\FormRequest;

class StorePacoteFotoRequest extends FormRequest
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
            'foto_capa_file' => ['nullable', 'required_without:foto_capa_url', 'prohibits:foto_capa_url', 'image', 'max:20480'],
            'foto_capa_url' => ['nullable', 'required_without:foto_capa_file', 'prohibits:foto_capa_file', 'url'],
            'itens' => ['nullable', 'array'],
            'itens.*.file' => ['nullable', 'required_without:itens.*.url', 'prohibits:itens.*.url', 'image', 'max:20480'],
            'itens.*.url' => ['nullable', 'required_without:itens.*.file', 'prohibits:itens.*.file', 'url'],
        ];
    }

    public function messages(): array
    {
        return [
            'foto_capa_file.required_without' => 'Você deve fornecer uma imagem ou uma URL para a capa.',
            'foto_capa_file.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para a capa.',
            'foto_capa_url.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para a capa.',
            'foto_capa_file.max' => 'A imagem de capa não deve exceder 20MB.',
            'itens.*.file.max' => 'Cada imagem auxiliar não deve exceder 20MB.',
            'itens.*.file.required_without' => 'Cada item deve ter uma imagem ou uma URL.',
            'itens.*.file.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para um item auxiliar.',
            'itens.*.url.prohibits' => 'Não envie arquivo e URL ao mesmo tempo para um item auxiliar.',
        ];
    }
}
