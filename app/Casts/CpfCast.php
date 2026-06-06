<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use App\ValueObjects\Cpf;
use Illuminate\Support\Facades\Crypt;

class CpfCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return Cpf|null
     */
    public function get($model, string $key, $value, array $attributes)
    {
        if (!$value) {
            return null;
        }

        try {
            $decrypted = Crypt::decryptString($value);
            return new Cpf($decrypted);
        } catch (\Throwable $e) {
            // Se a descriptografia falhar e a string for longa (ex: hash criptografado de outra chave),
            // retorna null diretamente para evitar interpretar o hash base64 como números de CPF legados.
            if (strlen($value) > 20) {
                return null;
            }

            try {
                return new Cpf(preg_replace('/\D/', '', $value));
            } catch (\Throwable $ex) {
                return null;
            }
        }
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return string|null
     */
    public function set($model, string $key, $value, array $attributes)
    {
        if ($value === null) {
            return null;
        }

        $cleanValue = $value instanceof Cpf ? $value->value : preg_replace('/\D/', '', $value);
        
        if (!$value instanceof Cpf) {
            new Cpf($cleanValue);
        }

        return Crypt::encryptString($cleanValue);
    }
}
