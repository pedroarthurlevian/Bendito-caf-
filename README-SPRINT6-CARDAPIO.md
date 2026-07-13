# Sprint 6 — Conferência com Cardápio BC 2025

Esta versão foi revisada comparando o site com o PDF `Cardápio BC 2025.pdf`.

## Correções principais

- Preços das bebidas quentes ajustados para o cardápio PDF.
- Preços das bebidas geladas ajustados para o cardápio PDF.
- Produtos que estavam faltando no site foram adicionados:
  - Café Coado
  - Expresso
  - Expresso Duplo
  - Café na Prensa Francesa
  - Chá Matte quente
  - Chocolate Cremoso
  - Chocolate Europeu
- Lanches, salgados, doces, adicionais, Matcha e outras bebidas revisados contra o PDF.
- Fotos da Sprint 4 e Sprint 5 mantidas e vinculadas aos itens corretos.
- Combos da Torcida foram mantidos como campanha extra da Sprint 2.

## SQL necessário

Rode no Supabase:

```sql
supabase-upgrade-sprint6-cardapio.sql
```

Isso é necessário porque os pedidos usam a tabela `products` no banco para calcular o total com segurança.

## Observação

Alguns produtos adicionados a partir do PDF ainda usam imagem temporária online, pois não foram enviadas fotos reais deles ainda.
