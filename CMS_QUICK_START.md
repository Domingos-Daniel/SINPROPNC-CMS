# CMS Quick Start - Guia Prático

## 🎯 O que é o CMS?

Content Management System (CMS) permite editar todo o conteúdo do site **SEM CÓDIGO**, direto do Supabase Dashboard.

## 🚀 Primeiros Passos (5 minutos)

### 1️⃣ Acesse Supabase
```
https://app.supabase.com/project/[SEU_PROJECT_ID]/editor
```

### 2️⃣ Selecione Tabela
Escolha uma das 4 tabelas:
- `hero_slides` - Carousel principal
- `quick_services` - 6 botões de acesso rápido
- `principles` - Princípios do sindicato
- `competencies` - Competências e responsabilidades

### 3️⃣ Clique em uma linha para editar
- Todos os campos são editáveis
- Salva automaticamente
- Mudanças aparecem no site em ~10 segundos

## 📝 Exemplo 1: Editar Título do Hero

**Passo 1**: Abra tabela `hero_slides`

**Passo 2**: Clique na linha 1 (primeiro slide)

**Passo 3**: Edite o campo `title`:
```
De: "Unidos, somos mais fortes!"
Para: "Unidos somos invencíveis!"
```

**Passo 4**: Pressione Tab ou clique fora
→ Salva automaticamente

**Passo 5**: Vá para o site
→ Novo título aparece em ~10 segundos

## ➕ Exemplo 2: Adicionar Novo Slide

**Passo 1**: Na tabela `hero_slides`, clique "Insert row"

**Passo 2**: Preencha:
```
title: "Nós lutamos pelos seus direitos"
subtitle: "Denuncie abuso laboral com segurança"
button_text: "Denunciar Agora"
button_link: "/denuncia"
display_order: 3
is_active: true
```

**Passo 3**: Pressione Enter
→ Novo slide adicionado

**Passo 4**: No site, o carousel terá 4 slides
→ Navegue com setas ou dots

## 🔧 Exemplo 3: Desativar um Serviço Rápido

**Passo 1**: Abra `quick_services`

**Passo 2**: Encontre "Denúncia" (linha 5)

**Passo 3**: Mude `is_active` de `true` para `false`

**Passo 4**: O botão desaparece do site automaticamente

## 🎨 Exemplo 4: Reordenar Competências

**Passo 1**: Abra `competencies`

**Passo 2**: Quer mover "Apoio Jurídico" para primeiro lugar?
```
Mude: display_order: 4
Para: display_order: 0
```

**Passo 3**: Salva automaticamente
→ Ordem muda no site

## 🔤 Ícones Disponíveis

Ao editar campo `icon_name`, use EXATAMENTE um destes:

**Icons de Pessoas:**
- `Users` - Grupo
- `Users2` - Dois usuários

**Icons de Documento:**
- `FileText` - Documentos
- `BookOpen` - Livro aberto
- `Scale` - Lei/Balanço

**Icons de Ação:**
- `Phone` - Telefone
- `Mail` - Email
- `MapPin` - Localização
- `Heart` - Coração
- `Shield` - Proteção
- `Target` - Objetivo
- `AlertTriangle` - Alerta
- `Megaphone` - Anúncio
- `Plane` - Avião

**Exemplo**: 
```
icon_name: "Scale"      ✅ Correto
icon_name: "scale"      ❌ Errado (case-sensitive)
icon_name: "Scales"     ❌ Errado (nome errado)
```

## 🔗 Links Especiais

Ao editar `link` ou `button_link`, use:

**Links internos:**
```
/sobre-nos
/noticias
/contacto
/servicos#juridico      (com hash)
```

**Telefone:**
```
tel:+244923436908
```

**Email:**
```
mailto:sinpropnc@gmail.com
```

**Links externos:**
```
https://facebook.com/sinpropnc
```

## 📱 Categorias de Competências

Na tabela `competencies`, use `category`:

**Principal** (3 itens no grid 3 colunas):
```
category: "main"
```

**Secundária** (6 itens no grid 2 colunas):
```
category: "secondary"
```

Exemplo:
- Negociação Colectiva → `category: "main"`
- Unidade Sindical → `category: "secondary"`

## ✅ Checklist: Antes de Publicar

Antes de ativar novo conteúdo, verifique:

- [ ] `is_active = true` (senão não aparece)
- [ ] `display_order` está correto (números únicos)
- [ ] `icon_name` existe na lista (verifique ortografia)
- [ ] `link` tem formato correto (tel:, mailto:, ou /)
- [ ] Texto sem erros de digitação
- [ ] Testar no site antes de comunicar

## 🚨 Problemas Comuns

### ❌ Conteúdo não aparece
**Solução**: Confirme `is_active = true`

### ❌ Ícone aparece errado
**Solução**: Verifique ortografia exata em `icon_name`

### ❌ Link não funciona
**Solução**: Use formato correto (tel:, mailto:, /, ou https://)

### ❌ Ordem está errada
**Solução**: Ajuste `display_order` (0, 1, 2, 3, ...)

### ❌ Mudanças não aparecem
**Solução**: 
1. Refresh da página (Ctrl+F5)
2. Aguarde ~10 segundos
3. Limpe cache do navegador

## 📊 Resumo das Tabelas

### hero_slides
| Campo | Tipo | Exemplo | Obrigatório |
|-------|------|---------|-------------|
| title | text | "Unidos, somos fortes!" | Sim |
| subtitle | text | "O SINPROPNC é a voz..." | Sim |
| button_text | text | "Saber mais" | Não |
| button_link | text | "/sobre-nos" | Não |
| display_order | int | 0, 1, 2 | Sim |
| is_active | bool | true/false | Sim |

### quick_services
| Campo | Tipo | Exemplo | Obrigatório |
|-------|------|---------|-------------|
| label | text | "Jurídico" | Sim |
| icon_name | text | "Scale" | Sim |
| link | text | "/servicos" | Sim |
| display_order | int | 0-5 | Sim |
| is_active | bool | true/false | Sim |

### principles
| Campo | Tipo | Exemplo | Obrigatório |
|-------|------|---------|-------------|
| title | text | "Sindicalismo Democrático" | Sim |
| description | text | "Eleição periódica..." | Sim |
| icon_name | text | "Users" | Sim |
| display_order | int | 0-3 | Sim |
| is_active | bool | true/false | Sim |

### competencies
| Campo | Tipo | Exemplo | Obrigatório |
|-------|------|---------|-------------|
| title | text | "Negociação Colectiva" | Sim |
| description | text | "Negociar e celebrar..." | Sim |
| icon_name | text | "FileText" | Sim |
| category | text | "main"/"secondary" | Sim |
| display_order | int | 0, 1, 2... | Sim |
| is_active | bool | true/false | Sim |

## 💡 Tips & Tricks

### Cópia de conteúdo
1. Clique em linha existente
2. Copie todos os campos
3. Insert new row
4. Cole os campos
5. Edite apenas o que mudou

### Bulk updates
Para mudar `is_active` de vários itens:
1. Supabase permite edição em bulk
2. Selecione múltiplas linhas (checkbox)
3. Click "Bulk Edit"
4. Mude um campo para todos

### Backup manual
Antes de grandes mudanças:
1. Download de `.csv` na tabela
2. Guarde em folder `backups/`
3. Se necessário, reimporte

## 📞 Suporte

Se algo não funciona:

1. **Verifique Supabase status**: https://status.supabase.com
2. **Limpe cache**: Ctrl+Shift+Delete
3. **Verifique console**: F12 → Console → erros?
4. **Repita o seed**: `npm run seed`

---

**Versão**: 1.0  
**Último update**: 2024  
**Frequência de atualização**: Diária (edição manual)
