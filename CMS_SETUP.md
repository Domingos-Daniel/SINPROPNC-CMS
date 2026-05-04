# SINPROPNC CMS Setup Guide

## Visão Geral

O site agora está 100% integrado com Supabase para gerenciar conteúdo dinamicamente. Todas as seções principais (Hero Carousel, Quick Services, Principles, Competencies) vêm do banco de dados.

## Tabelas Criadas

### 1. `hero_slides` - Carousel da Home
- `id` (uuid) - Identificador único
- `title` (text) - Título do slide
- `subtitle` (text) - Subtítulo
- `button_text` (text) - Texto do botão CTA
- `button_link` (text) - Link do botão
- `gradient_from` (text) - Cor do gradiente (hex)
- `gradient_to` (text) - Cor final do gradiente (hex)
- `image_url` (text) - URL da imagem (opcional)
- `display_order` (integer) - Ordem de exibição
- `is_active` (boolean) - Se o slide está ativo
- Timestamps: `created_at`, `updated_at`

### 2. `quick_services` - Acesso Rápido
- `id` (uuid)
- `label` (text) - Nome do serviço
- `icon_name` (text) - Nome do ícone lucide-react
- `link` (text) - URL do link
- `display_order` (integer)
- `is_active` (boolean)
- Timestamps

### 3. `principles` - Princípios do Sindicato
- `id` (uuid)
- `title` (text)
- `description` (text)
- `icon_name` (text) - Ícone lucide-react
- `display_order` (integer)
- `is_active` (boolean)
- Timestamps

### 4. `competencies` - Competências
- `id` (uuid)
- `title` (text)
- `description` (text)
- `icon_name` (text)
- `category` (text) - "main" ou "secondary"
- `display_order` (integer)
- `is_active` (boolean)
- Timestamps

## Setup Inicial

### 1. Copiar arquivo SQL para Supabase
Copie todo o conteúdo de `/scripts/setup-cms.sql` e execute no SQL Editor do Supabase:

```
https://app.supabase.com/project/[PROJECT_ID]/sql/new
```

Isto criará todas as tabelas, RLS policies e dados iniciais.

### 2. Executar Script de Seed (Alternativa)
Se preferir usar TypeScript para popular os dados:

```bash
npm run seed
```

Este comando:
- Conecta ao Supabase usando Service Role Key
- Limpa dados antigos
- Insere dados de exemplo
- Valida RLS policies

## Ícones Disponíveis

Os seguintes ícones do lucide-react estão disponíveis:

- `Scale` - Balanço/Lei
- `FileText` - Documentos
- `Users` - Grupo de pessoas
- `BookOpen` - Livro aberto
- `AlertTriangle` - Alerta
- `Phone` - Telefone
- `Heart` - Coração
- `Users2` - Dois usuários
- `Megaphone` - Megafone
- `Shield` - Escudo
- `Target` - Alvo/Objetivo
- `Plane` - Avião
- `Mail` - Email
- `MapPin` - Localização

Para adicionar novos ícones, edite `/lib/icons.ts` e importe do lucide-react.

## Editar Conteúdo

### Via Supabase Dashboard
1. Acesse https://app.supabase.com
2. Abra seu projeto
3. Vá para Table Editor
4. Selecione a tabela desejada
5. Clique em uma linha para editar ou crie uma nova
6. Salve automaticamente

### Exemplo: Editar Título do Hero
1. Tabela: `hero_slides`
2. Encontre o slide (por display_order)
3. Edite `title` e `subtitle`
4. Salve
5. A página home atualiza automaticamente (cache em 10 segundos)

## RLS (Row Level Security) Policies

- **SELECT**: Público pode ler dados onde `is_active = true`
- **INSERT/UPDATE/DELETE**: Apenas usuários autenticados (para admin panel futuro)

## Caching & Revalidação

A home page faz fetch dos dados no build-time (Server Component). Para ver mudanças:

1. **Dev Mode**: Recarga automática com hot reload
2. **Production**: Aguarde redeployment ou use ISR (Incremental Static Regeneration)

## Próximos Passos

### 1. Admin Panel (Futuro)
Criar página `/admin` com autenticação para editar conteúdo via UI.

### 2. Mais Campos
Adicionar suporte para:
- Imagens do hero (com upload)
- Conteúdo em markdown
- Múltiplas idiomas
- Tags/categorias

### 3. Sincronização de Cache
Implementar webhook para invalidar cache quando dados são editados.

## Variáveis de Ambiente

Já configuradas no projeto:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para seed)

## Troubleshooting

### Dados não aparecem na página
1. Verifique se `is_active = true` na tabela
2. Verifique `display_order` está correto
3. Limpe cache do navegador (Ctrl+F5)
4. Verifique console para erros

### Ícones quebrados
1. Confirme o nome do ícone em `/lib/icons.ts`
2. Verifique ortografia exata (case-sensitive)
3. Se novo ícone, adicione à importação em icons.ts

### Permissões RLS
Se receber erro de permissão:
1. Verifique que `is_active = true`
2. Confirme RLS policies estão criadas
3. Execute `setup-cms.sql` novamente

## Contato & Suporte

Para dúvidas sobre CMS, verifique:
- Documentação Supabase: https://supabase.com/docs
- Lucide Icons: https://lucide.dev
