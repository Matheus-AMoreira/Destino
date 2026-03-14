<?php

namespace App\Http\Controllers;

use App\Enums\Metodo;
use App\Enums\Processador;
use App\Enums\StatusCompra;
use App\Models\Compra;
use App\Models\Oferta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout confirmation page.
     */
    public function index(Request $request): Response
    {
        $ofertaId = $request->query('ofertaId');
        $oferta = Oferta::with(['pacote.fotos', 'pacote.hotel.cidade.estado'])->findOrFail($ofertaId);

        return Inertia::render('Checkout/Index', [
            'oferta' => $oferta,
        ]);
    }

    /**
     * Process the purchase.
     */
    public function processar(Request $request): RedirectResponse
    {
        $request->validate([
            'oferta_id' => 'required|exists:ofertas,id',
            'metodo' => 'required|string',
            'parcelas' => 'required|integer|min:1|max:12',
        ]);

        $oferta = Oferta::findOrFail($request->oferta_id);

        // --- Mock API Payment Simulation ---
        // In a real application, you would connect to a payment gateway here (Stripe, PayPal, etc.)
        $paymentApproved = true; 
        // ------------------------------------

        if ($paymentApproved) {
            $compra = Compra::create([
                'data_compra' => now(),
                'status' => StatusCompra::CONCLUIDO,
                'metodo' => Metodo::from($request->metodo),
                'processador_pagamento' => Processador::STRIPE, // Mock processor
                'parcelas' => $request->parcelas,
                'valor_final' => $oferta->preco,
                'user_id' => Auth::id(),
                'oferta_id' => $oferta->id,
            ]);

            return redirect()->route('checkout.confirmacao', ['compraId' => $compra->id]);
        }

        return back()->withErrors(['payment' => 'O pagamento não foi aprovado.']);
    }

    /**
     * Display the purchase confirmation/receipt page.
     */
    public function confirmacao(string $compraId): Response
    {
        $compra = Compra::with(['oferta.pacote.fotos', 'oferta.pacote.hotel.cidade.estado'])->findOrFail($compraId);

        // Security check: ensure the purchase belongs to the authenticated user
        if ($compra->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Checkout/Confirmacao', [
            'compra' => $compra,
        ]);
    }
}
