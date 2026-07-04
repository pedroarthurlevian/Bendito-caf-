-- Bendito Café - Upgrade Sprint 1 + Sprint 3 + Segurança
-- Rode este arquivo no SQL Editor do Supabase depois do supabase-setup.sql.
-- Ele adiciona campos úteis, valida pedidos pelo banco, cria catálogo de produtos
-- e prepara o painel para pedidos/caixa em tempo real.

create extension if not exists pgcrypto;

-- 1) Campos novos sem apagar dados existentes
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists order_note text;
alter table public.orders add column if not exists order_total numeric(10,2) not null default 0;
alter table public.orders add column if not exists status_updated_at timestamptz not null default now();
alter table public.orders add column if not exists source text default 'site';
alter table public.orders alter column items_json set default '[]'::jsonb;

alter table public.reservations add column if not exists status text not null default 'Pendente';
alter table public.reservations add column if not exists status_updated_at timestamptz not null default now();

-- Evita duplicar pagamento de um mesmo pedido no caixa.
do $$
begin
  create unique index if not exists cash_entries_one_per_order_idx
  on public.cash_entries(order_id)
  where order_id is not null;
exception
  when unique_violation then
    raise notice 'Não foi possível criar índice único em cash_entries.order_id porque já existem pagamentos duplicados. Remova duplicados e rode de novo.';
end $$;

-- 2) Constraints leves para novas entradas.
alter table public.orders drop constraint if exists orders_customer_name_len_check;
alter table public.orders add constraint orders_customer_name_len_check
check (char_length(trim(customer_name)) between 2 and 80) not valid;

alter table public.orders drop constraint if exists orders_customer_phone_check;
alter table public.orders add constraint orders_customer_phone_check
check (customer_phone is null or customer_phone ~ '^[0-9]{10,13}$') not valid;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
check (payment_status in ('Aguardando pagamento no caixa', 'Recebido', 'Em preparo', 'Pronto', 'Entregue', 'Pago no caixa')) not valid;

alter table public.orders drop constraint if exists orders_order_total_check;
alter table public.orders add constraint orders_order_total_check
check (order_total >= 0) not valid;

alter table public.reservations drop constraint if exists reservations_phone_check;
alter table public.reservations add constraint reservations_phone_check
check (phone ~ '^[0-9]{10,13}$') not valid;

alter table public.reservations drop constraint if exists reservations_status_check;
alter table public.reservations add constraint reservations_status_check
check (status in ('Pendente', 'Confirmada', 'Cancelada', 'Concluída')) not valid;

-- 3) Catálogo oficial no banco. Ele será usado para calcular preço com segurança.
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  group_name text,
  subgroup text,
  badge text,
  image_url text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "public_can_read_active_products" on public.products;
create policy "public_can_read_active_products"
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "authenticated_can_manage_products" on public.products;
create policy "authenticated_can_manage_products"
on public.products
for all
to authenticated
using (true)
with check (true);

insert into public.products (id, name, description, price, group_name, subgroup, badge, image_url, active)
values
  ('cappuccino-italiano', 'Cappuccino italiano', 'Espuma cremosa, café equilibrado e final clássico para uma pausa com cara de cafeteria italiana.', 16.00, 'bebidas-quentes', 'com-cafe', 'clássico', 'assets/img/produtos/cappuccino-italiano.jpeg', true),
  ('cappuccino-cremoso', 'Cappuccino cremoso', 'Cappuccino encorpado, textura aveludada e doçura suave para acompanhar um bom livro.', 17.00, 'bebidas-quentes', 'com-cafe', 'cremoso', 'assets/img/produtos/cappuccino-cremoso.jpeg', true),
  ('expresso-com-chantilly', 'Expresso com chantilly', 'Café intenso com uma camada generosa de chantilly para deixar o espresso mais marcante.', 14.00, 'bebidas-quentes', 'com-cafe', 'especial', 'assets/img/produtos/expresso-com-chantilly.jpeg', true),
  ('affogato', 'Affogato', 'A combinação elegante de café e creme gelado: sobremesa e café no mesmo momento.', 19.00, 'doces', 'todos', 'sobremesa', 'assets/img/produtos/affogato.jpeg', true),
  ('mocha', 'Mocha', 'Café com chocolate, leite cremoso e visual marcante para quem gosta de sabor intenso.', 18.00, 'bebidas-quentes', 'com-cafe', 'chocolate', 'assets/img/produtos/mocha.jpeg', true),
  ('super-mocha', 'Super Mocha', 'Versão mais indulgente do mocha, com camadas cremosas e presença forte de chocolate.', 22.00, 'bebidas-quentes', 'com-cafe', 'premium', 'assets/img/produtos/super-mocha.jpeg', true),
  ('cappuccino-gourmet', 'Cappuccino gourmet', 'Cappuccino especial com chantilly, final aromático e aquele toque de cafeteria aconchegante.', 21.00, 'bebidas-quentes', 'com-cafe', 'gourmet', 'assets/img/produtos/cappuccino-gourmet.jpeg', true),
  ('chai-latte', 'Chai Latte', 'Leite cremoso com especiarias, canela e aroma acolhedor para uma pausa diferente.', 19.00, 'bebidas-quentes', 'sem-cafe', 'aromático', 'assets/img/produtos/chai-latte.jpeg', true),
  ('cappuccino-gelado', 'Cappuccino gelado', 'Café gelado cremoso com caramelo, perfeito para dias quentes e momentos leves.', 20.00, 'bebidas-geladas', 'gelado', 'gelado', 'assets/img/produtos/cappuccino-gelado.jpeg', true),
  ('americano-gelado', 'Americano gelado', 'Café gelado com leite em movimento, refrescante, bonito e direto ao ponto.', 15.00, 'bebidas-geladas', 'gelado', 'refrescante', 'assets/img/produtos/americano-gelado.jpeg', true),
  ('pink-lemonade', 'Pink Lemonade', 'Limonada gelada com toque frutado e visual vibrante para uma opção leve e refrescante.', 15.00, 'outras-bebidas', 'gelado', 'cítrica', 'assets/img/produtos/pink-lemonade.jpeg', true),
  ('chai-latte-gelado', 'Chai Latte gelado', 'Versão gelada do chai latte, com especiarias, leite cremoso e perfil aromático.', 20.00, 'bebidas-geladas', 'gelado', 'aromático', 'assets/img/produtos/chai-latte-gelado.jpeg', true),
  ('mat-01', 'Matcha Puro', 'Matcha servido de forma pura, com sabor marcante e perfil vegetal elegante.', 11.00, 'matcha', 'quente', 'Quente', 'assets/img/produtos/matcha-puro.jpeg', true),
  ('mat-02', 'Latte Matcha', 'Matcha com leite cremoso e acabamento delicado para uma pausa reconfortante.', 15.00, 'matcha', 'quente', 'Quente', 'assets/img/produtos/latte-matcha.jpeg', true),
  ('mat-03', 'Latte Matcha com Morango', 'Combinação refrescante de matcha, leite, morango e gelo com visual marcante.', 18.00, 'matcha', 'gelado', 'Gelado', 'assets/img/produtos/latte-matcha-com-morango.jpeg', true),
  ('mat-04', 'Latte Matcha com Coco e Menta', 'Matcha gelado com coco e menta para uma bebida leve, cremosa e refrescante.', 18.00, 'matcha', 'gelado', 'Gelado', 'assets/img/produtos/latte-matcha-com-coco-e-menta.jpeg', true),
  ('mat-05', 'Matcha Tropical', 'Matcha gelado com perfil tropical e refrescante, ideal para dias quentes.', 18.00, 'matcha', 'gelado', 'Tropical', 'assets/img/produtos/matcha-tropical.jpeg', true),
  ('mat-06', 'Latte Matcha com Maracujá', 'Matcha gelado combinado com leite e maracujá para um resultado cremoso e frutado.', 18.00, 'matcha', 'gelado', 'Gelado', 'assets/img/produtos/latte-matcha-com-maracuja.jpeg', true),
  ('mat-07', 'Matcha Maracujá Spritz', 'Bebida refrescante com matcha, maracujá e borbulhas leves para um toque especial.', 19.00, 'matcha', 'gelado', 'Spritz', 'assets/img/produtos/matcha-maracuja-spritz.jpeg', true),
  ('out-01', 'Água', 'Sem gás ou com gás.', 5.00, 'outras-bebidas', 'todos', 'Clássico', 'https://images.unsplash.com/photo-1564419439288-b2d15a86f8ff?q=80&w=1200&auto=format&fit=crop', true),
  ('out-02', 'Sucos de Polpa', 'Consultar sabores do dia.', 9.00, 'outras-bebidas', 'todos', 'Consultar', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=1200&auto=format&fit=crop', true),
  ('out-03', 'Coca-Cola 200ml', 'Refrigerante em porção de 200ml.', 5.00, 'outras-bebidas', 'todos', 'Gelado', 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1200&auto=format&fit=crop', true),
  ('add-01', 'Leite sem Lactose', 'Adicional para adaptar a bebida.', 1.50, 'adicionais', 'todos', 'Adicional', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop', true),
  ('add-02', 'Ovomaltine', 'Adicional crocante para enriquecer bebidas e sobremesas.', 3.00, 'adicionais', 'todos', 'Extra', 'assets/img/produtos/ovomaltine.jpeg', true),
  ('add-03', 'Chantilly', 'Cobertura adicional.', 3.00, 'adicionais', 'todos', 'Extra', 'assets/img/produtos/chantilly.jpeg', true),
  ('add-04', 'Leite Vegetal', 'Opção vegetal para bebidas.', 4.00, 'adicionais', 'todos', 'Adicional', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop', true),
  ('add-05', 'Borda', 'Doce de leite ou creme de avelã.', 5.00, 'adicionais', 'todos', 'Doce', 'assets/img/produtos/borda.jpeg', true),
  ('doc-01', 'Bendito Bolinho', 'Mini bolo com cobertura de ganache de chocolate. Consultar sabores.', 13.00, 'doces', 'todos', 'Vitrine', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop', true),
  ('doc-02', 'Pão Casadinho', '2 fatias de pão francês: uma com queijo e requeijão e a outra doce com creme de avelã, doce de leite ou goiabada.', 13.00, 'doces', 'todos', 'Doce', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1200&auto=format&fit=crop', true),
  ('doc-03', 'Pão de Minas', '2 fatias de pão francês, recheado com cream cheese, doce de leite e queijo de minas.', 18.00, 'doces', 'todos', 'Especial', 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=1200&auto=format&fit=crop', true),
  ('doc-04', 'Croissant com Creme de Avelã', 'Croissant de chocolate coberto com creme de avelã.', 18.00, 'doces', 'todos', 'Queridinho', 'https://images.unsplash.com/photo-1555507036-ab794f4afe5a?q=80&w=1200&auto=format&fit=crop', true),
  ('doc-05', 'Brownie', 'Brownie tradicional.', 10.00, 'doces', 'todos', 'Clássico', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop', true),
  ('doc-06', 'Brownie com Sorvete', 'Brownie tradicional com bola de sorvete de creme.', 16.00, 'doces', 'todos', 'Destaque', 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=1200&auto=format&fit=crop', true),
  ('sal-01', 'Waffle', 'Waffle de massa de pão de queijo.', 7.00, 'salgados', 'todos', 'Massa pão de queijo', 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop', true),
  ('sal-02', 'Waffle Recheado', 'Waffle de massa de pão de queijo. Sabores: presunto e queijo, creme de avelã, doce de leite e mel.', 12.00, 'salgados', 'todos', 'Sabores', 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop', true),
  ('sal-03', '4 Mini Empadas', 'Consultar sabores do dia.', 10.00, 'salgados', 'todos', 'Consultar', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop', true),
  ('sal-04', 'Assados', 'Croissant e outros, consultar sabores do dia.', 12.00, 'salgados', 'todos', 'Do dia', 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=1200&auto=format&fit=crop', true),
  ('sal-05', 'Empada', 'Consultar sabores do dia.', 13.00, 'salgados', 'todos', 'Do dia', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-01', 'Pão com Manteiga', 'Fatia de pão caseiro com manteiga.', 7.00, 'lanches', 'na-chapa', 'Na chapa', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-02', 'Pão com Manteiga, Mel e Orégano', 'Fatia de pão caseiro com manteiga, mel e orégano.', 11.00, 'lanches', 'na-chapa', 'Na chapa', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-03', 'Pão com Ovo', 'Pão francês, ovo e requeijão.', 13.00, 'lanches', 'na-chapa', 'Café da manhã', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-04', 'Misto Quente', 'Pão francês, requeijão, presunto e muçarela.', 13.00, 'lanches', 'na-chapa', 'Clássico', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-05', 'Bauru', 'Pão francês, requeijão, presunto, muçarela, tomate e orégano.', 14.00, 'lanches', 'na-chapa', 'Querido', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-06', 'Bauru com Ovo', 'Pão francês, requeijão, presunto, muçarela, ovo, tomate e orégano.', 17.00, 'lanches', 'na-chapa', 'Completo', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-07', 'Sanduiche Natural', 'Pão integral, patê de frango, alface e tomate.', 20.00, 'lanches', 'na-chapa', 'Leve', 'https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-08', 'Omelete', 'Ovos, tomate, presunto, muçarela e orégano.', 21.00, 'lanches', 'na-chapa', 'Forte', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=1200&auto=format&fit=crop', true),
  ('lan-09', 'Bacon & Ovo', 'Fatia de pão caseiro, requeijão, ovo mexido, bacon e muçarela.', 22.00, 'lanches', 'na-chapa', 'Destaque', 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?q=80&w=1200&auto=format&fit=crop', true),
  ('frapuccino-menta-e-chocolate', 'Frapuccino Menta e Chocolate', 'Bebida gelada com chocolate, toque de menta e apresentação marcante para refrescar com sabor.', 24.00, 'bebidas-geladas', 'gelado', 'menta', 'assets/img/produtos/frapuccino-menta-e-chocolate.jpeg', true),
  ('chococcino', 'Chococcino', 'Mistura cremosa de café com chocolate, gelada e encorpada para quem gosta de sabores intensos.', 20.00, 'bebidas-geladas', 'gelado', 'chocolate', 'assets/img/produtos/chococcino.jpeg', true),
  ('expresso-com-tonica', 'Expresso com tônica', 'Espresso servido com tônica e gelo, combinação refrescante e surpreendente para dias quentes.', 16.00, 'bebidas-geladas', 'gelado', 'refrescante', 'assets/img/produtos/expresso-com-tonica.jpeg', true),
  ('frapuccino-super-mocha', 'Frapuccino Super Mocha', 'Versão gelada e cremosa do mocha, com bastante chocolate e final indulgente.', 24.00, 'bebidas-geladas', 'gelado', 'premium', 'assets/img/produtos/frapuccino-super-mocha.jpeg', true),
  ('cappuccino-frozen', 'Cappuccino Frozen', 'Cappuccino batido e bem cremoso, servido gelado para unir café e refrescância.', 21.00, 'bebidas-geladas', 'gelado', 'frozen', 'assets/img/produtos/cappuccino-frozen.jpeg', true),
  ('cha-matte-gelado', 'Chá Matte Gelado', 'Chá matte servido bem gelado, leve e ideal para acompanhar um lanche da tarde.', 14.00, 'outras-bebidas', 'gelado', 'chá', 'assets/img/produtos/cha-matte-gelado.jpeg', true),
  ('soda-italiana', 'Soda Italiana', 'Bebida gaseificada, leve e colorida, perfeita para quem quer algo sem café e bem refrescante.', 16.00, 'outras-bebidas', 'gelado', 'refrescante', 'assets/img/produtos/soda-italiana.jpeg', true),
  ('guarana-da-amazonia', 'Guaraná da Amazônia', 'Bebida cremosa e gelada com sabor marcante de guaraná, ótima para uma pausa diferente.', 18.00, 'outras-bebidas', 'gelado', 'especial', 'assets/img/produtos/guarana-da-amazonia.jpeg', true),
  ('chocolate-gelado', 'Chocolate gelado', 'Chocolate gelado cremoso, com calda marcante e visual que chama atenção logo de cara.', 19.00, 'bebidas-geladas', 'gelado', 'cremoso', 'assets/img/produtos/chocolate-gelado.jpeg', true),
  ('golden-lemonade', 'Golden Lemonade', 'Limonada especial servida com gelo e toque dourado para uma opção cítrica e refrescante.', 15.00, 'outras-bebidas', 'gelado', 'cítrica', 'assets/img/produtos/golden-lemonade.jpeg', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  group_name = excluded.group_name,
  subgroup = excluded.subgroup,
  badge = excluded.badge,
  image_url = excluded.image_url,
  active = excluded.active,
  updated_at = now();

-- 4) Itens do pedido normalizados. O items_json continua existindo para compatibilidade e leitura rápida.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id),
  product_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

drop policy if exists "authenticated_can_read_order_items" on public.order_items;
create policy "authenticated_can_read_order_items"
on public.order_items
for select
to authenticated
using (true);

drop policy if exists "authenticated_can_manage_order_items" on public.order_items;
create policy "authenticated_can_manage_order_items"
on public.order_items
for all
to authenticated
using (true)
with check (true);

-- 5) Função pública segura: o cliente envia apenas id + quantidade.
-- O banco busca o preço real em public.products e calcula o total.
create or replace function public.create_public_order(
  p_customer_name text,
  p_customer_phone text,
  p_order_note text default null,
  p_coupon text default null,
  p_items jsonb default '[]'::jsonb
)
returns table(order_id uuid, order_total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_item record;
  v_requested_lines integer := 0;
  v_valid_lines integer := 0;
  v_snapshot jsonb := '[]'::jsonb;
begin
  p_customer_name := trim(coalesce(p_customer_name, ''));
  p_customer_phone := regexp_replace(coalesce(p_customer_phone, ''), '\D', '', 'g');
  p_order_note := nullif(trim(coalesce(p_order_note, '')), '');
  p_coupon := nullif(upper(trim(coalesce(p_coupon, ''))), '');

  if char_length(p_customer_name) < 2 or char_length(p_customer_name) > 80 then
    raise exception 'Nome do cliente inválido.';
  end if;

  if p_customer_phone !~ '^[0-9]{10,13}$' then
    raise exception 'Telefone do cliente inválido.';
  end if;

  if p_order_note is not null and char_length(p_order_note) > 280 then
    raise exception 'Observação muito longa.';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 40 then
    raise exception 'Itens do pedido inválidos.';
  end if;

  select count(*) into v_requested_lines
  from jsonb_to_recordset(p_items) as x(id text, quantity integer);

  select count(*) into v_valid_lines
  from jsonb_to_recordset(p_items) as x(id text, quantity integer)
  join public.products p on p.id = x.id and p.active = true
  where x.quantity between 1 and 99;

  if v_requested_lines <> v_valid_lines then
    raise exception 'Existe produto inválido ou quantidade inválida no pedido.';
  end if;

  insert into public.orders (
    customer_name,
    customer_phone,
    order_note,
    payment_method,
    payment_status,
    coupon,
    source,
    items_json,
    order_total
  ) values (
    p_customer_name,
    p_customer_phone,
    p_order_note,
    'Pagamento no caixa',
    'Aguardando pagamento no caixa',
    p_coupon,
    'site',
    '[]'::jsonb,
    0
  ) returning id into v_order_id;

  for v_item in
    select
      p.id,
      p.name,
      p.price,
      p.group_name,
      sum(x.quantity)::integer as quantity
    from jsonb_to_recordset(p_items) as x(id text, quantity integer)
    join public.products p on p.id = x.id and p.active = true
    group by p.id, p.name, p.price, p.group_name
  loop
    insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
    values (v_order_id, v_item.id, v_item.name, v_item.price, v_item.quantity, v_item.price * v_item.quantity);

    v_total := v_total + (v_item.price * v_item.quantity);
    v_snapshot := v_snapshot || jsonb_build_array(jsonb_build_object(
      'id', v_item.id,
      'product_id', v_item.id,
      'name', v_item.name,
      'price', v_item.price,
      'unit_price', v_item.price,
      'quantity', v_item.quantity,
      'total', v_item.price * v_item.quantity,
      'line_total', v_item.price * v_item.quantity,
      'group', v_item.group_name
    ));
  end loop;

  if p_coupon = 'BENDITO10' then
    v_discount := round(v_total * 0.10, 2);
  end if;

  v_total := round(v_total - v_discount, 2);

  update public.orders
  set items_json = v_snapshot,
      order_total = v_total
  where id = v_order_id;

  return query select v_order_id, v_total;
end;
$$;

revoke all on function public.create_public_order(text, text, text, text, jsonb) from public;
grant execute on function public.create_public_order(text, text, text, text, jsonb) to anon, authenticated;

-- 6) Policies atualizadas.
-- Pedidos agora devem ser criados pela função create_public_order, não por insert direto anônimo.
alter table public.orders enable row level security;
alter table public.reservations enable row level security;
alter table public.cash_entries enable row level security;

drop policy if exists "public_can_insert_orders" on public.orders;
drop policy if exists "authenticated_can_read_orders" on public.orders;
drop policy if exists "authenticated_can_update_orders" on public.orders;
drop policy if exists "authenticated_can_delete_orders" on public.orders;

create policy "authenticated_can_read_orders"
on public.orders
for select
to authenticated
using (true);

create policy "authenticated_can_update_orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

drop policy if exists "public_can_insert_reservations" on public.reservations;
drop policy if exists "authenticated_can_read_reservations" on public.reservations;
drop policy if exists "authenticated_can_update_reservations" on public.reservations;

create policy "public_can_insert_reservations"
on public.reservations
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 80
  and phone ~ '^[0-9]{10,13}$'
  and date is not null
  and time is not null
  and guests is not null
);

create policy "authenticated_can_read_reservations"
on public.reservations
for select
to authenticated
using (true);

create policy "authenticated_can_update_reservations"
on public.reservations
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_can_manage_cash_entries" on public.cash_entries;
create policy "authenticated_can_manage_cash_entries"
on public.cash_entries
for all
to authenticated
using (true)
with check (true);

-- 7) Realtime: no painel do Supabase, ative Realtime para public.orders, public.reservations e public.cash_entries
-- em Database > Replication/Publications. O código já está preparado para ouvir mudanças.
