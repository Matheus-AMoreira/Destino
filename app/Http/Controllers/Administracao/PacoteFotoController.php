<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StorePacoteFotoRequest;
use App\Http\Requests\Administracao\UpdatePacoteFotoRequest;
use App\Models\PacoteFoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PacoteFotoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Index', [
            'pacoteFotos' => PacoteFoto::all()->map(function ($pf) {
                return [
                    'id' => $pf->id,
                    'nome' => $pf->nome,
                    'foto_do_pacote' => $pf->foto_do_pacote ? Storage::url($pf->foto_do_pacote) : null,
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Create');
    }

    public function store(StorePacoteFotoRequest $request): RedirectResponse
    {
        $path = $request->file('foto_do_pacote')->store('public/pacotes');

        PacoteFoto::create([
            'nome' => $request->nome,
            'foto_do_pacote' => $path,
        ]);

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum criado com sucesso!');
    }

    public function edit(PacoteFoto $pacotedefoto): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Edit', [
            'pacoteFoto' => [
                'id' => $pacotedefoto->id,
                'nome' => $pacotedefoto->nome,
                'foto_do_pacote' => $pacotedefoto->foto_do_pacote ? Storage::url($pacotedefoto->foto_do_pacote) : null,
            ],
        ]);
    }

    public function update(UpdatePacoteFotoRequest $request, PacoteFoto $pacotedefoto): RedirectResponse
    {
        $data = ['nome' => $request->nome];

        if ($request->hasFile('foto_do_pacote')) {
            if ($pacotedefoto->foto_do_pacote) {
                Storage::delete($pacotedefoto->foto_do_pacote);
            }
            $data['foto_do_pacote'] = $request->file('foto_do_pacote')->store('public/pacotes');
        }

        $pacotedefoto->update($data);

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum atualizado com sucesso!');
    }

    public function destroy(PacoteFoto $pacotedefoto): RedirectResponse
    {
        if ($pacotedefoto->foto_do_pacote) {
            Storage::delete($pacotedefoto->foto_do_pacote);
        }
        $pacotedefoto->delete();

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum excluído com sucesso!');
    }
}
