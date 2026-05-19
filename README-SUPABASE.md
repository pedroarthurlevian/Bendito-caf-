# Bendito Café + Supabase

Esta versão já está preparada para salvar no Supabase:

- Pedidos -> tabela `orders`
- Reservas -> tabela `reservations`
- Caixa -> tabela `cash_entries`
- Dashboard -> lê essas 3 tabelas
- Pedidos pendentes -> lê e atualiza `orders`
- Caixa -> registra `cash_entries` e atualiza `orders`

## O que você ainda precisa fazer

### 1. Colar a Publishable key

Abra:

`assets/supabase.js`

Substitua:

`COLE_AQUI_SUA_PUBLISHABLE_KEY`

pela sua chave que começa com:

`sb_publishable_`

Não use a chave `sb_secret_`.

### 2. Conferir no Supabase

Você já criou as tabelas. Elas devem aparecer no Table Editor:

- `orders`
- `reservations`
- `cash_entries`

Se precisar recriar, use o arquivo:

`supabase-setup.sql`

### 3. Authentication

No Supabase, vá em Authentication e crie um usuário com e-mail e senha.
Esse usuário vai acessar:

`painel-login.html`

### 4. Testar localmente

Dentro da pasta do projeto:

```bash
python3 -m http.server 8000
```

Abra:

`http://localhost:8000`

### 5. Fluxo de teste

1. Abra o site
2. Faça um pedido com nome
3. Veja se entrou em `orders`
4. Acesse `painel-login.html`
5. Entre com o usuário criado no Supabase
6. Vá em `pedidos-pendentes.html`
7. Avance o pedido até `Entregue`
8. Vá em `caixa.html`
9. Registre pagamento
10. Veja se entrou em `cash_entries`

## Observação

O site público consegue criar pedidos e reservas porque suas policies permitem insert para `anon`.
O painel precisa de login porque suas policies permitem leitura e update apenas para usuários autenticados.
