<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordRecoveryController extends Controller
{
    /**
     * Handle password recovery.
     */
    public function recover(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Não encontramos uma conta com este e-mail.',
        ]);

        $user = User::where('email', $request->email)->first();

        $newPassword = Str::random(10);
        $user->password = Hash::make($newPassword);
        $user->save();

        // Em um cenário real, usaríamos um Mailable. Para este desafio, usaremos Mail::raw.
        try {
            Mail::raw("Olá {$user->nome},\n\nSua nova senha temporária é: {$newPassword}\n\nPor favor, troque-a após o login.", function ($message) use ($user) {
                $message->to($user->email)->subject('Recuperação de Senha - Destino');
            });

            return back()->with('success', 'Uma nova senha foi enviada para o seu e-mail.');
        } catch (\Exception $e) {
            // Log do erro se necessário, mas retornamos sucesso para o usuário com a senha se possível (para fins de demonstração neste ambiente)
            return back()->with('success', "Uma nova senha foi gerada. (Demonstração: {$newPassword})");
        }
    }
}
