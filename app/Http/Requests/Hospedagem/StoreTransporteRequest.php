<?php

namespace App\Http\Requests\Hospedagem;

use App\Enums\Hospedagem\Meio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransporteRequest extends FormRequest
{
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
