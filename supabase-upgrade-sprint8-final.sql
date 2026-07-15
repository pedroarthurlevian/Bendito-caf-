-- Bendito Café — Sprint 8 Final
-- Reativa o Latte Matcha com Maracujá com nome, descrição, preço e foto corretos.
-- Rode no SQL Editor do Supabase depois do SQL anterior da Sprint 8.

insert into public.products (
  id, name, description, price, group_name, subgroup, badge, image_url, active
)
values (
  'mat-06',
  'Latte Matcha com Maracujá',
  'Matcha, leite, maracujá e gelo.',
  18.00,
  'matcha',
  'gelado',
  'Gelado',
  'assets/img/produtos/latte-matcha-com-maracuja.jpeg',
  true
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  group_name = excluded.group_name,
  subgroup = excluded.subgroup,
  badge = excluded.badge,
  image_url = excluded.image_url,
  active = true,
  updated_at = now();

-- Mantém removidos os itens que você confirmou que não fazem parte do cardápio digital.
update public.products
set active = false, updated_at = now()
where id in (
  'mat-07',
  'lan-07',
  'combo-primeiro-tempo',
  'combo-torcida-dupla',
  'combo-intervalo-doce',
  'combo-mesa-da-torcida'
);
