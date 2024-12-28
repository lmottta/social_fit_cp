# Comandos de Checkpoint

Este documento lista todos os comandos disponíveis para gerenciar checkpoints no projeto.

## Criar um novo checkpoint

```bash
npm run checkpoint "mensagem do checkpoint"
```

## Criar uma tag para o checkpoint

```bash
npm run checkpoint:tag "nome-da-tag" -m "descrição da tag"
```

## Listar todos os checkpoints

```bash
npm run checkpoint:list
```

## Restaurar para um checkpoint específico

```bash
npm run checkpoint:restore nome-da-tag
```

## Exemplo de restauração específica

Para restaurar o sistema para o checkpoint de autenticação v1:

```bash
npm run checkpoint:restore checkpoint-auth-v1
```
