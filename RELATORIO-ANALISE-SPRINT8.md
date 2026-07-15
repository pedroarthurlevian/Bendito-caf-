# Relatório de análise — Sprint 8

## Resultado

O cardápio digital foi conferido novamente com o PDF Cardápio BC 2025 e com as orientações recebidas por áudio.

## Pontos corrigidos

1. Imagens de Affogato e Expresso com Chantilly confirmadas nos arquivos corretos.
2. Chocolate Cremoso recebeu a nova foto enviada.
3. Chocolate Europeu ficou com a foto que estava atribuída ao Chocolate Cremoso.
4. Matcha Tropical recebeu a nova foto enviada.
5. Itens que não estão sendo vendidos foram removidos do catálogo visível.
6. Campanha da Copa foi retirada integralmente do front-end.
7. SQL criado para manter o banco sincronizado e desativar os itens removidos.

## Validações técnicas

- JavaScript validado com `node --check`.
- Caminhos das imagens locais conferidos.
- IDs duplicados no HTML conferidos.
- Referências antigas de Copa, TORCIDA10, Sanduíche Natural e Matcha com Maracujá removidas dos arquivos ativos.

## Atenção

- O arquivo `supabase-upgrade-sprint8-correcoes.sql` precisa ser executado para o banco deixar de aceitar pedidos dos produtos removidos.
- A foto enviada para Latte Matcha com Maracujá não foi usada, pois o produto foi removido conforme orientação anterior.
- Os arquivos antigos de outras sprints continuam dentro do pacote apenas como histórico; o site usa `index.html`, `assets/app.js` e os arquivos atuais.
