# Atualização Sprint 1 + Sprint 3 — Bendito Café

## O que foi corrigido

- Corrigido o botão do produto em destaque que apontava para um ID inexistente.
- Corrigidos telefone e e-mail do rodapé/localização.
- Adicionados telefone e observação ao pedido.
- Adicionadas validações no pedido e na reserva.
- Reserva agora bloqueia datas passadas, domingo e horários fora do funcionamento.
- Pedido agora tenta usar a função segura `create_public_order` no Supabase.
- Se a função ainda não existir, o site usa fallback compatível com a tabela antiga e avisa para rodar o SQL.
- Painel, tela de pedidos e caixa foram protegidos contra XSS com escape de dados vindos do banco.
- Painel, pedidos e caixa ficaram prontos para atualização em tempo real via Supabase Realtime.
- Caixa agora evita pagamento duplicado do mesmo pedido e valida valor recebido.
- Dashboard agora lê `order_total` quando existir e usa fallback antigo se não existir.

## Arquivo que você precisa rodar no Supabase

Rode no SQL Editor do Supabase:

```sql
supabase-upgrade-sprint1-3.sql
```

Esse SQL:

- adiciona campos novos em `orders` e `reservations`;
- cria `products` com o catálogo oficial;
- cria `order_items`;
- cria a função `create_public_order` para calcular preço pelo banco;
- remove insert direto anônimo em `orders`;
- mantém reserva pública com validações;
- adiciona proteção contra duplicidade de pagamento no caixa.

## Importante sobre Realtime

O código já tem `.channel(...).on('postgres_changes', ...)`, mas no Supabase você precisa ativar Realtime para:

- `orders`
- `reservations`
- `cash_entries`

Caminho comum: **Database > Replication/Publications** e marque as tabelas na publicação `supabase_realtime`.

## Próximo passo recomendado

Depois de testar esta versão, o próximo avanço profissional é criar uma tela administrativa de produtos para editar nome, preço, status ativo/inativo e imagem diretamente no banco, sem precisar mexer no `assets/app.js`.
