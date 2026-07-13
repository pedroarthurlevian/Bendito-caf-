# Sprint 2 — Tema Copa 2026 / Combos da Torcida

Esta versão adiciona uma campanha temática de futebol para a Bendito Café, com foco em chamar público em dias de jogo sem usar marcas oficiais.

## O que foi implementado

- Nova seção `Copa 2026` na página inicial.
- Banner visual com clima verde/amarelo/café.
- Cards de combos com botão de adicionar direto ao carrinho.
- Nova categoria no cardápio: `Combos da Torcida`.
- Quatro combos novos:
  - Combo 1º Tempo — R$ 29,00
  - Combo Torcida Dupla — R$ 64,00
  - Combo Intervalo Doce — R$ 35,00
  - Combo Mesa da Torcida — R$ 119,00
- Cupom `TORCIDA10` com 10% de desconto.
- Botão de reserva pelo WhatsApp.
- Contador simples até a final da campanha.
- Ajustes de SEO/meta description.

## Importante sobre marcas oficiais

A campanha foi feita como tema de futebol, sem usar logo, mascote, troféu, emblema ou identidade oficial de qualquer organização esportiva. Isso reduz risco comercial e mantém o visual seguro para uso no site.

## SQL necessário

Depois de subir os arquivos, rode no Supabase:

```sql
supabase-upgrade-sprint2.sql
```

Esse arquivo adiciona os combos na tabela `products` e atualiza a função `create_public_order` para aceitar o cupom `TORCIDA10`.

Se você não rodar esse SQL, os combos vão aparecer no site, mas pedidos com eles podem falhar porque o banco ainda não conhece esses produtos.

## Teste recomendado

1. Abra o site.
2. Clique em `Copa 2026`.
3. Adicione o `Combo Torcida Dupla`.
4. Abra o carrinho.
5. Use o cupom `TORCIDA10`.
6. Finalize um pedido com nome e telefone.
7. Confira se o pedido aparece no painel.
