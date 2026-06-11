<?php

namespace Database\Factories;

use App\Models\Identidade\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Identidade\Usuario>
 */
class UserFactory extends Factory
{
    protected $model = Usuario::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'nome' => $this->faker->firstName(),
            'sobre_nome' => $this->faker->lastName(),
            'cpf' => $this->faker->unique()->numerify('###########'),
            'email' => $this->faker->unique()->safeEmail(),
            'telefone' => $this->faker->numerify('119########'),
            'password' => Hash::make('password'),
            'is_valid' => true,
            'email_verified_at' => now(),
            'role_id' => null,
        ];
    }
}
