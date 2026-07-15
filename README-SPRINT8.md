# Sprint 8 — Correções finais do cardápio digital

## Correções aplicadas

- Affogato com a imagem correta de café expresso com sorvete.
- Expresso com Chantilly com a imagem correta de café preto e chantilly.
- Nova foto oficial aplicada ao Chocolate Cremoso.
- A imagem anterior do Chocolate Cremoso foi movida para o Chocolate Europeu.
- Nova foto oficial aplicada ao Matcha Tropical.
- Removidos do cardápio digital:
  - Latte Matcha com Maracujá (`mat-06`)
  - Matcha Maracujá Spritz (`mat-07`)
  - Sanduíche Natural (`lan-07`)
  - Todos os Combos da Torcida
- Campanha da Copa removida da página inicial, navegação, faixa promocional, cardápio e cupom.
- Cupom `TORCIDA10` removido; `BENDITO10` continua funcionando.
- SEO e textos da página inicial atualizados para não mencionar a campanha encerrada.

## SQL necessário

Rode no Supabase:

```sql
supabase-upgrade-sprint8-correcoes.sql
```

Os produtos removidos são apenas desativados (`active = false`), não apagados. Isso preserva histórico de pedidos antigos.

## Para uma instalação nova do banco

Execute os arquivos nesta ordem:

1. `supabase-setup.sql`
2. `supabase-upgrade-sprint1-3.sql`
3. `supabase-upgrade-sprint6-cardapio.sql`
4. `supabase-upgrade-sprint8-correcoes.sql`

Não execute novamente o SQL antigo da Sprint 2, pois a campanha da Copa foi encerrada e removida desta versão.
