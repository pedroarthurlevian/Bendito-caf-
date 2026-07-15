-- Bendito Café — Sprint 8
-- Correções de imagens e desativação de itens que não estão mais no cardápio.
-- Rode no SQL Editor do Supabase depois de subir os arquivos da Sprint 8.

-- Atualiza imagens corretas dos produtos.
update public.products
set image_url = 'assets/img/produtos/affogato.jpeg', updated_at = now()
where id = 'affogato';

update public.products
set image_url = 'assets/img/produtos/expresso-com-chantilly.jpeg', updated_at = now()
where id = 'expresso-com-chantilly';

update public.products
set image_url = 'assets/img/produtos/chocolate-cremoso.jpeg', updated_at = now()
where id = 'chocolate-cremoso';

-- A imagem que antes aparecia no Chocolate Cremoso corresponde ao Chocolate Europeu.
update public.products
set image_url = 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=1200&auto=format&fit=crop', updated_at = now()
where id = 'chocolate-europeu';

update public.products
set image_url = 'assets/img/produtos/matcha-tropical.jpeg', updated_at = now()
where id = 'mat-05';

-- Desativa itens fora do cardápio atual sem apagar histórico de pedidos antigos.
update public.products
set active = false, updated_at = now()
where id in (
  'mat-06',
  'mat-07',
  'lan-07',
  'combo-primeiro-tempo',
  'combo-torcida-dupla',
  'combo-intervalo-doce',
  'combo-mesa-da-torcida'
);
