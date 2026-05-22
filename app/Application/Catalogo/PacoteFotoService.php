<?php

namespace App\Application\Catalogo;

use App\Application\Shared\ActivityLogService;
use App\Domain\Catalogo\Repositories\PacoteRepositoryInterface;
use Illuminate\Support\Facades\Storage;

use App\Domain\Catalogo\DTOs\PacoteFotoAdminDTO;
use App\Domain\Catalogo\DTOs\PacoteFotoEditDTO;
use App\Domain\Catalogo\DTOs\PacoteFotoAlbumDTO;

class PacoteFotoService
{
    public function __construct(
        private readonly PacoteRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    /** @return PacoteFotoAdminDTO[] */
    public function listar(): array
    {
        $rows = $this->repo->listarAlbuns();
        return array_map(fn($r) => new PacoteFotoAdminDTO(
            id: $r->id,
            nome: $r->nome,
            fotoCapa: $r->is_url ? $r->foto_capa : ($r->foto_capa ? Storage::url($r->foto_capa) : ''),
            storageType: $r->storage_type,
            itemsCount: $r->fotos_count ?? 0,
        ), $rows);
    }

    public function buscarParaEdicao(int $id): ?PacoteFotoEditDTO
    {
        $album = $this->repo->buscarAlbumPorId($id);
        if (!$album) return null;

        $fotos = $this->repo->buscarFotosDoAlbum($id);

        $fotoAlbumDTOs = array_map(fn($f) => new PacoteFotoAlbumDTO(
            id: $f->id,
            caminhoUrl: $f->isUrl ? $f->caminho : Storage::url($f->caminho),
            isUrl: $f->isUrl,
            ordem: $f->ordem ?? 0,
        ), $fotos);

        return new PacoteFotoEditDTO(
            id: $album->id,
            nome: $album->nome,
            fotoCapa: $album->isUrl ? $album->fotoCapa : ($album->fotoCapa ? Storage::url($album->fotoCapa) : ''),
            isUrl: $album->isUrl,
            itens: $fotoAlbumDTOs,
        );
    }

    public function criar(string $nome, string $fotoCapa, bool $isUrl, array $itens = []): int
    {
        $id = $this->repo->criarAlbum([
            'nome' => $nome,
            'foto_capa' => $fotoCapa,
            'is_url' => $isUrl,
            'storage_type' => $isUrl ? 'url' : 'local',
        ]);

        foreach ($itens as $index => $item) {
            if (!empty($item['caminho'])) {
                $this->repo->criarFotoItem([
                    'pacote_foto_id' => $id,
                    'caminho' => $item['caminho'],
                    'is_url' => $item['is_url'] ?? false,
                    'ordem' => $index,
                ]);
            }
        }

        $this->log->logCreated('PacoteFoto', $id, ['nome' => $nome]);
        return $id;
    }

    public function atualizar(int $id, array $dados, array $itens = []): bool
    {
        $result = $this->repo->atualizarAlbum($id, $dados);

        foreach ($itens as $index => $itemData) {
            if (!empty($itemData['deleted']) && !empty($itemData['id'])) {
                $item = $this->repo->buscarFotoItemPorId((int) $itemData['id']);
                if ($item && !$item->isUrl) {
                    Storage::delete($item->caminho);
                }
                $this->repo->deletarFotoItem((int) $itemData['id']);
                continue;
            }

            if (!empty($itemData['id'])) {
                $updateData = ['ordem' => $index];
                if (!empty($itemData['caminho'])) {
                    $old = $this->repo->buscarFotoItemPorId((int) $itemData['id']);
                    if ($old && !$old->isUrl) {
                        Storage::delete($old->caminho);
                    }
                    $updateData['caminho'] = $itemData['caminho'];
                    $updateData['is_url'] = $itemData['is_url'] ?? false;
                }
                $this->repo->atualizarFotoItem((int) $itemData['id'], $updateData);
                continue;
            }

            if (!empty($itemData['caminho'])) {
                $this->repo->criarFotoItem([
                    'pacote_foto_id' => $id,
                    'caminho' => $itemData['caminho'],
                    'is_url' => $itemData['is_url'] ?? false,
                    'ordem' => $index,
                ]);
            }
        }

        $this->log->logUpdated('PacoteFoto', $id, [], $dados);
        return $result;
    }

    public function deletar(int $id): bool
    {
        $album = $this->repo->buscarAlbumPorId($id);
        if (!$album) return false;

        if (!$album->isUrl && $album->fotoCapa) {
            Storage::delete($album->fotoCapa);
        }

        $fotos = $this->repo->buscarFotosDoAlbum($id);
        foreach ($fotos as $item) {
            if (!$item->isUrl) {
                Storage::delete($item->caminho);
            }
            $this->repo->deletarFotoItem($item->id);
        }

        $this->log->logDeleted('PacoteFoto', $id);
        return $this->repo->deletarAlbum($id);
    }

    public function checkUploadService(): bool
    {
        try {
            $disk = Storage::disk();
            $testFile = 'connectivity_test_' . time() . '.txt';
            if (!$disk->put($testFile, 'test')) return false;
            $disk->delete($testFile);
            return true;
        } catch (\Exception) {
            return false;
        }
    }
}
