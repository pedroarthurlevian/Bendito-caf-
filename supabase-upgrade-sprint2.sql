-- Bendito Café - Upgrade Sprint 2
-- Campanha temática de futebol / Copa 2026
-- Rode este arquivo no SQL Editor do Supabase DEPOIS do supabase-upgrade-sprint1-3.sql.
-- Ele adiciona os combos da torcida ao catálogo seguro do banco e libera o cupom TORCIDA10.

insert into public.products (id, name, description, price, group_name, subgroup, badge, image_url, active)
values
  ('combo-primeiro-tempo', 'Combo 1º Tempo', 'Cappuccino gelado + salgado do dia para chegar no clima antes da bola rolar.', 29.00, 'combos-torcida', 'copa2026', 'copa 2026', 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1200&auto=format&fit=crop', true),
  ('combo-torcida-dupla', 'Combo Torcida Dupla', '2 bebidas especiais + 2 lanches ou salgados do dia para assistir ao jogo em boa companhia.', 64.00, 'combos-torcida', 'copa2026', 'dupla', 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?q=80&w=1200&auto=format&fit=crop', true),
  ('combo-intervalo-doce', 'Combo Intervalo Doce', 'Bebida especial + brownie para adoçar o intervalo e voltar para o segundo tempo com energia.', 35.00, 'combos-torcida', 'copa2026', 'intervalo', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop', true),
  ('combo-mesa-da-torcida', 'Combo Mesa da Torcida', 'Pedido maior para grupos: bebidas, salgados e doces para dividir em mesa reservada.', 119.00, 'combos-torcida', 'copa2026', 'grupo', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop', true)
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

-- Atualiza a função segura para aceitar o cupom TORCIDA10 também.
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

  if p_coupon in ('BENDITO10', 'TORCIDA10') then
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
