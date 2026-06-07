<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models\Catalogo{
/**
 * @property int $id
 * @property int $pacote_foto_id
 * @property string $caminho
 * @property bool $is_url
 * @property int $ordem
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Catalogo\PacoteFoto $album
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereCaminho($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereIsUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereOrdem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem wherePacoteFotoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereUpdatedAt($value)
 */
	class FotoItem extends \Eloquent {}
}

namespace App\Models\Catalogo{
/**
 * @property int $id
 * @property string $nome
 * @property string $descricao
 * @property string $funcionario_id
 * @property int|null $pacote_foto_id
 * @property array<array-key, mixed>|null $tag_ids
 * @property float|null $media_avaliacao
 * @property int|null $total_avaliacoes
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Catalogo\PacoteFoto|null $album
 * @property-read \App\Models\Identidade\Usuario $funcionario
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comercial\Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Catalogo\Tag> $tags
 * @property-read int|null $tags_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereDescricao($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereFuncionarioId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereMediaAvaliacao($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote wherePacoteFotoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereTagIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereTotalAvaliacoes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereUpdatedAt($value)
 */
	class Pacote extends \Eloquent {}
}

namespace App\Models\Catalogo{
/**
 * @property int $id
 * @property string $nome
 * @property string $storage_type
 * @property string $foto_capa
 * @property bool $is_url
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Catalogo\FotoItem> $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereFotoCapa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereIsUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereStorageType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereUpdatedAt($value)
 */
	class PacoteFoto extends \Eloquent {}
}

namespace App\Models\Catalogo{
/**
 * @property int $id
 * @property string $nome
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Catalogo\Pacote> $pacotes
 * @property-read int|null $pacotes_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereUpdatedAt($value)
 */
	class Tag extends \Eloquent {}
}

namespace App\Models\Comercial{
/**
 * @property int $id
 * @property int $nota
 * @property string|null $comentario
 * @property string $user_id
 * @property int $pacote_id
 * @property string $compra_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Comercial\Compra $compra
 * @property-read \App\Models\Catalogo\Pacote $pacote
 * @property-read \App\Models\Identidade\Usuario $usuario
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereComentario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereCompraId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereNota($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao wherePacoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereUserId($value)
 */
	class Avaliacao extends \Eloquent {}
}

namespace App\Models\Comercial{
/**
 * @property string $id
 * @property \Carbon\CarbonImmutable $data_compra
 * @property string $status
 * @property string $metodo
 * @property string $processador_pagamento
 * @property int $parcelas
 * @property float $valor_final
 * @property string $user_id
 * @property int $oferta_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Comercial\Oferta $oferta
 * @property-read \App\Models\Identidade\Usuario $usuario
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereDataCompra($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereMetodo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereOfertaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereParcelas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereProcessadorPagamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereValorFinal($value)
 */
	class Compra extends \Eloquent {}
}

namespace App\Models\Comercial{
/**
 * @property int $id
 * @property float $preco
 * @property string $inicio
 * @property string $fim
 * @property int $disponibilidade
 * @property string $status
 * @property bool $is_available
 * @property int $pacote_id
 * @property int $hotel_id
 * @property int $transporte_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Hospedagem\Hotel $hotel
 * @property-read \App\Models\Catalogo\Pacote $pacote
 * @property-read \App\Models\Hospedagem\Transporte $transporte
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereDisponibilidade($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereFim($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereHotelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereInicio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta wherePacoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta wherePreco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereTransporteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereUpdatedAt($value)
 */
	class Oferta extends \Eloquent {}
}

namespace App\Models\Geografia{
/**
 * @property int $id
 * @property string $nome
 * @property int $estado_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Geografia\Estado $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereEstadoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereUpdatedAt($value)
 */
	class Cidade extends \Eloquent {}
}

namespace App\Models\Geografia{
/**
 * @property int $id
 * @property string $sigla
 * @property string $nome
 * @property int|null $regiao_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Geografia\Regiao|null $regiao
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereRegiaoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereSigla($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereUpdatedAt($value)
 */
	class Estado extends \Eloquent {}
}

namespace App\Models\Geografia{
/**
 * @property int $id
 * @property string $sigla
 * @property string $nome
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereSigla($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereUpdatedAt($value)
 */
	class Regiao extends \Eloquent {}
}

namespace App\Models\Hospedagem{
/**
 * @property int $id
 * @property string $nome
 * @property string $endereco
 * @property int $diaria
 * @property int $cidade_id
 * @property string|null $cep
 * @property array<array-key, mixed>|null $cep_data
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Geografia\Cidade $cidade
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCep($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCepData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCidadeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereDiaria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereEndereco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereUpdatedAt($value)
 */
	class Hotel extends \Eloquent {}
}

namespace App\Models\Hospedagem{
/**
 * @property int $id
 * @property string $empresa
 * @property string $meio
 * @property int $preco
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereEmpresa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereMeio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte wherePreco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereUpdatedAt($value)
 */
	class Transporte extends \Eloquent {}
}

namespace App\Models\Identidade{
/**
 * Modelo de log de auditoria.
 *
 * Registra ações realizadas por usuários do sistema,
 * incluindo quem fez, quem foi afetado e quais dados mudaram.
 *
 * @property string $id
 * @property string|null $user_id
 * @property string|null $target_user_id
 * @property string $action
 * @property string|null $description
 * @property array<array-key, mixed>|null $changes
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property-read \App\Models\Identidade\Usuario|null $performer
 * @property-read \App\Models\Identidade\Usuario|null $target
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereChanges($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereTargetUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserId($value)
 */
	class AuditLog extends \Eloquent {}
}

namespace App\Models\Identidade{
/**
 * @property int $id
 * @property string $slug
 * @property string|null $description
 * @property bool $is_staff
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Identidade\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Identidade\Usuario> $usuarios
 * @property-read int|null $usuarios_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereIsStaff($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permission whereUpdatedAt($value)
 */
	class Permission extends \Eloquent {}
}

namespace App\Models\Identidade{
/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property bool $is_staff
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Identidade\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Identidade\Usuario> $usuarios
 * @property-read int|null $usuarios_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereIsStaff($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereUpdatedAt($value)
 */
	class Role extends \Eloquent {}
}

