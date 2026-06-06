<?php

namespace App\Services\Identidade;

use App\Models\Identidade\AuditLog;
use App\Models\Identidade\Usuario;

/**
 * Serviço de auditoria.
 *
 * Responsável por registrar logs de auditoria para ações
 * realizadas no sistema, como alterações de perfil, permissões,
 * cargos e status de usuários.
 */
class AuditService
{
    /**
     * Registra um log de auditoria genérico.
     *
     * @param string      $action       Ação realizada (ex: 'user.profile.updated')
     * @param string|null $targetUserId ID do usuário afetado pela ação
     * @param string|null $description  Descrição legível da ação
     * @param array|null  $changes      Valores antigos e novos ({old: ..., new: ...})
     */
    public function log(
        string $action,
        ?string $targetUserId,
        ?string $description = null,
        ?array $changes = null,
    ): void {
        AuditLog::create([
            'user_id' => auth()->id(),
            'target_user_id' => $targetUserId,
            'action' => $action,
            'description' => $description,
            'changes' => $changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Registra atualização de perfil do usuário.
     *
     * Calcula o diff entre os dados antigos e novos,
     * registrando apenas os campos que foram alterados.
     *
     * @param string $targetUserId ID do usuário cujo perfil foi atualizado
     * @param array  $oldData      Dados anteriores do perfil
     * @param array  $newData      Dados atualizados do perfil
     */
    public function logProfileUpdate(string $targetUserId, array $oldData, array $newData): void
    {
        // Calcula apenas os campos que mudaram
        $changedOld = [];
        $changedNew = [];

        foreach ($newData as $key => $newValue) {
            $oldValue = $oldData[$key] ?? null;

            if ($oldValue !== $newValue) {
                $changedOld[$key] = $oldValue;
                $changedNew[$key] = $newValue;
            }
        }

        // Só registra se houver alterações efetivas
        if (empty($changedOld)) {
            return;
        }

        $this->log(
            action: 'user.profile.updated',
            targetUserId: $targetUserId,
            description: 'Perfil do usuário atualizado.',
            changes: ['old' => $changedOld, 'new' => $changedNew],
        );
    }

    /**
     * Registra atualização de permissões do usuário.
     *
     * @param string $targetUserId ID do usuário cujas permissões foram alteradas
     * @param array  $oldSlugs     Slugs das permissões anteriores
     * @param array  $newSlugs     Slugs das permissões atualizadas
     */
    public function logPermissionsUpdate(string $targetUserId, array $oldSlugs, array $newSlugs): void
    {
        $this->log(
            action: 'user.permissions.updated',
            targetUserId: $targetUserId,
            description: 'Permissões do usuário atualizadas.',
            changes: ['old' => $oldSlugs, 'new' => $newSlugs],
        );
    }

    /**
     * Registra atualização do cargo (role) do usuário.
     *
     * @param string      $targetUserId ID do usuário cujo cargo foi alterado
     * @param string|null $oldRoleName  Nome do cargo anterior
     * @param string|null $newRoleName  Nome do novo cargo
     */
    public function logRoleUpdate(string $targetUserId, ?string $oldRoleName, ?string $newRoleName): void
    {
        $this->log(
            action: 'user.role.updated',
            targetUserId: $targetUserId,
            description: 'Cargo do usuário atualizado.',
            changes: ['old' => $oldRoleName, 'new' => $newRoleName],
        );
    }

    /**
     * Registra atualização do status (ativo/inativo) do usuário.
     *
     * @param string $targetUserId ID do usuário cujo status foi alterado
     * @param bool   $oldStatus    Status anterior
     * @param bool   $newStatus    Novo status
     */
    public function logStatusUpdate(string $targetUserId, bool $oldStatus, bool $newStatus): void
    {
        $this->log(
            action: 'user.status.updated',
            targetUserId: $targetUserId,
            description: 'Status do usuário atualizado.',
            changes: ['old' => $oldStatus, 'new' => $newStatus],
        );
    }

    /**
     * Registra a criação de um novo usuário.
     *
     * @param string $targetUserId ID do usuário criado
     * @param string $description  Descrição da criação
     */
    public function logUserCreated(string $targetUserId, string $description): void
    {
        $this->log(
            action: 'user.created',
            targetUserId: $targetUserId,
            description: $description,
        );
    }

    /**
     * Registra a exclusão de um usuário.
     *
     * @param string $targetUserId ID do usuário excluído
     * @param string $description  Descrição da exclusão
     */
    public function logUserDeleted(string $targetUserId, string $description): void
    {
        $this->log(
            action: 'user.deleted',
            targetUserId: $targetUserId,
            description: $description,
        );
    }
}
