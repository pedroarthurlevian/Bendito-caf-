function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

let supabaseClientPromise = null

async function getSupabaseClient() {
  if (!supabaseClientPromise) {
    supabaseClientPromise = import('./supabase.js').then(module => {
      if (!module.isSupabaseConfigured()) {
        throw new Error('Supabase ainda não está configurado em assets/supabase.js')
      }
      return module.supabase
    })
  }

  return supabaseClientPromise
}

const catalog = [
  {
    id: 'cafe-coado',
    name: 'Café Coado',
    desc: 'Café coado tradicional.',
    price: 6.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Com café',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'expresso',
    name: 'Expresso',
    desc: 'Uma dose de café expresso.',
    price: 7.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Com café',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'expresso-duplo',
    name: 'Expresso Duplo',
    desc: 'Duas doses de café expresso.',
    price: 8.50,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Com café',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'cappuccino-italiano',
    name: 'Cappuccino Italiano',
    desc: 'Café expresso com leite.',
    price: 10.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Clássico',
    image: 'assets/img/produtos/cappuccino-italiano.jpeg'
  },
  {
    id: 'cappuccino-cremoso',
    name: 'Cappuccino Cremoso',
    desc: 'Mistura para cappuccino e leite.',
    price: 12.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Cremoso',
    image: 'assets/img/produtos/cappuccino-cremoso.jpeg'
  },
  {
    id: 'cafe-prensa-francesa',
    name: 'Café na Prensa Francesa',
    desc: 'Café coado na Prensa Francesa.',
    price: 11.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Com café',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'expresso-com-chantilly',
    name: 'Expresso com Chantilly',
    desc: 'Café expresso duplo com chantilly.',
    price: 12.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Especial',
    image: 'assets/img/produtos/expresso-com-chantilly.jpeg'
  },
  {
    id: 'affogato',
    name: 'Affogato',
    desc: 'Café expresso e sorvete.',
    price: 13.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Sobremesa',
    image: 'assets/img/produtos/affogato.jpeg'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    desc: 'Café expresso, leite e chocolate.',
    price: 15.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Chocolate',
    image: 'assets/img/produtos/mocha.jpeg'
  },
  {
    id: 'super-mocha',
    name: 'Super Mocha',
    desc: 'Café expresso, leite, chocolate e canela.',
    price: 16.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Premium',
    image: 'assets/img/produtos/super-mocha.jpeg'
  },
  {
    id: 'cappuccino-gourmet',
    name: 'Cappuccino Gourmet',
    desc: 'Mistura para cappuccino, leite, borda de creme de avelã e chantilly.',
    price: 18.00,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'Gourmet',
    image: 'assets/img/produtos/cappuccino-gourmet.jpeg'
  },
  {
    id: 'cha-matte-quente',
    name: 'Chá Matte',
    desc: 'Sabores: tradicional, limão, pêssego, gengibre, canela e tangerina.',
    price: 11.00,
    group: 'bebidas-quentes',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'chocolate-cremoso',
    name: 'Chocolate Cremoso',
    desc: 'Mistura para chocolate e leite.',
    price: 12.00,
    group: 'bebidas-quentes',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/chocolate-cremoso.jpeg'
  },
  {
    id: 'chocolate-europeu',
    name: 'Chocolate Europeu',
    desc: 'Mistura para chocolate e leite. Chocolate mais grosso.',
    price: 15.00,
    group: 'bebidas-quentes',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'chai-latte',
    name: 'Chai Latte',
    desc: 'Xarope de Chai e leite.',
    price: 18.00,
    group: 'bebidas-quentes',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/chai-latte.jpeg'
  },
  {
    id: 'cappuccino-gelado',
    name: 'Cappuccino',
    desc: 'Mistura para cappuccino, leite e gelo.',
    price: 13.90,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Gelado',
    image: 'assets/img/produtos/cappuccino-gelado.jpeg'
  },
  {
    id: 'americano-gelado',
    name: 'Americano Gelado',
    desc: 'Café expresso duplo, água, leite, macadâmia e gelo.',
    price: 16.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Gelado',
    image: 'assets/img/produtos/americano-gelado.jpeg'
  },
  {
    id: 'frapuccino-menta-e-chocolate',
    name: 'Frappuccino Menta e Chocolate',
    desc: 'Café expresso, leite, menta, calda de chocolate e gelo.',
    price: 17.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Gelado',
    image: 'assets/img/produtos/frapuccino-menta-e-chocolate.jpeg'
  },
  {
    id: 'chococcino',
    name: 'Chococcino',
    desc: 'Mistura para cappuccino e chocolate, ovomaltine, leite e gelo.',
    price: 18.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Chocolate',
    image: 'assets/img/produtos/chococcino.jpeg'
  },
  {
    id: 'expresso-com-tonica',
    name: 'Expresso com Tônica',
    desc: 'Café expresso duplo, água tônica, xarope e gelo. Sabores: gengibre, pêssego, avelã, caramelo salgado e baunilha.',
    price: 18.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Refrescante',
    image: 'assets/img/produtos/expresso-com-tonica.jpeg'
  },
  {
    id: 'frapuccino-super-mocha',
    name: 'Frappuccino Super Mocha',
    desc: 'Café expresso, leite, macadâmia, canela, calda de chocolate, chantilly e gelo.',
    price: 18.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Mocha',
    image: 'assets/img/produtos/frapuccino-super-mocha.jpeg'
  },
  {
    id: 'cappuccino-frozen',
    name: 'Cappuccino Frozen',
    desc: 'Mistura para cappuccino, leite, sorvete de creme, caramelo salgado e gelo.',
    price: 22.00,
    group: 'bebidas-geladas',
    subgroup: 'com-cafe',
    badge: 'Frozen',
    image: 'assets/img/produtos/cappuccino-frozen.jpeg'
  },
  {
    id: 'cha-matte-gelado',
    name: 'Chá Matte',
    desc: 'Sabores: tradicional, limão, pêssego, gengibre, canela e tangerina.',
    price: 12.00,
    group: 'bebidas-geladas',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/cha-matte-gelado.jpeg'
  },
  {
    id: 'soda-italiana',
    name: 'Soda Italiana',
    desc: 'Água com gás, xarope e gelo. Sabores: maçã verde, gengibre, menta, cranberry, coco, tangerina, grenadine, morango e limão.',
    price: 13.00,
    group: 'bebidas-geladas',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/soda-italiana.jpeg'
  },
  {
    id: 'chocolate-gelado',
    name: 'Chocolate',
    desc: 'Mistura para chocolate, leite e gelo.',
    price: 13.90,
    group: 'bebidas-geladas',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/chocolate-gelado.jpeg'
  },
  {
    id: 'pink-lemonade',
    name: 'Pink Limonade',
    desc: 'Purê de morango, suco de limão taiti e gelo.',
    price: 15.00,
    group: 'bebidas-geladas',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/pink-lemonade.jpeg'
  },
  {
    id: 'chai-latte-gelado',
    name: 'Chai Latte',
    desc: 'Xarope de Chai, leite e gelo.',
    price: 18.00,
    group: 'bebidas-geladas',
    subgroup: 'sem-cafe',
    badge: 'Sem café',
    image: 'assets/img/produtos/chai-latte-gelado.jpeg'
  },
  {
    id: 'mat-01',
    name: 'Matcha Puro',
    desc: 'Matcha e água.',
    price: 11.00,
    group: 'matcha',
    subgroup: 'quente',
    badge: 'Quente',
    image: 'assets/img/produtos/matcha-puro.jpeg'
  },
  {
    id: 'mat-02',
    name: 'Latte Matcha',
    desc: 'Matcha, leite e coco.',
    price: 15.00,
    group: 'matcha',
    subgroup: 'quente',
    badge: 'Quente',
    image: 'assets/img/produtos/latte-matcha.jpeg'
  },
  {
    id: 'mat-03',
    name: 'Latte Matcha com Morango',
    desc: 'Matcha, leite, purê de morango e gelo.',
    price: 18.00,
    group: 'matcha',
    subgroup: 'gelado',
    badge: 'Gelado',
    image: 'assets/img/produtos/latte-matcha-com-morango.jpeg'
  },
  {
    id: 'mat-04',
    name: 'Latte Matcha com Coco e Menta',
    desc: 'Matcha, leite, coco, menta e gelo.',
    price: 18.00,
    group: 'matcha',
    subgroup: 'gelado',
    badge: 'Gelado',
    image: 'assets/img/produtos/latte-matcha-com-coco-e-menta.jpeg'
  },
  {
    id: 'mat-05',
    name: 'Matcha Tropical',
    desc: 'Matcha, água com gás, gengibre, pêssego e gelo.',
    price: 18.00,
    group: 'matcha',
    subgroup: 'gelado',
    badge: 'Tropical',
    image: 'assets/img/produtos/matcha-tropical.jpeg'
  },
  {
    id: 'out-01',
    name: 'Água',
    desc: 'Sem gás ou com gás.',
    price: 5.00,
    group: 'outras-bebidas',
    subgroup: 'todos',
    badge: 'Clássico',
    image: 'https://images.unsplash.com/photo-1564419439288-b2d15a86f8ff?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'out-02',
    name: 'Sucos de Polpa',
    desc: 'Consultar sabores do dia.',
    price: 9.00,
    group: 'outras-bebidas',
    subgroup: 'todos',
    badge: 'Consultar',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'out-03',
    name: 'Coca-Cola 200ml',
    desc: 'Gelado.',
    price: 5.00,
    group: 'outras-bebidas',
    subgroup: 'todos',
    badge: 'Gelado',
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'add-01',
    name: 'Leite sem Lactose',
    desc: 'Adicional para adaptar a bebida.',
    price: 1.50,
    group: 'adicionais',
    subgroup: 'todos',
    badge: 'Adicional',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'add-02',
    name: 'Ovomaltine',
    desc: 'Adicional crocante para enriquecer bebidas e sobremesas.',
    price: 3.00,
    group: 'adicionais',
    subgroup: 'todos',
    badge: 'Extra',
    image: 'assets/img/produtos/ovomaltine.jpeg'
  },
  {
    id: 'add-03',
    name: 'Chantilly',
    desc: 'Cobertura adicional.',
    price: 3.00,
    group: 'adicionais',
    subgroup: 'todos',
    badge: 'Extra',
    image: 'assets/img/produtos/chantilly.jpeg'
  },
  {
    id: 'add-04',
    name: 'Leite Vegetal',
    desc: 'Opção vegetal para bebidas.',
    price: 4.00,
    group: 'adicionais',
    subgroup: 'todos',
    badge: 'Adicional',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'add-05',
    name: 'Borda',
    desc: 'Doce de leite ou creme de avelã.',
    price: 5.00,
    group: 'adicionais',
    subgroup: 'todos',
    badge: 'Doce',
    image: 'assets/img/produtos/borda.jpeg'
  },
  {
    id: 'doc-01',
    name: 'Bendito Bolinho',
    desc: 'Mini bolo com cobertura de ganache de chocolate. Consultar sabores.',
    price: 13.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Vitrine',
    image: 'assets/img/produtos/bendito-bolinho.png'
  },
  {
    id: 'doc-02',
    name: 'Pão Casadinho',
    desc: '2 fatias de pão francês: uma fatia de queijo e requeijão e a outra fatia doce com creme de avelã, doce de leite ou goiabada.',
    price: 13.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Doce',
    image: 'assets/img/produtos/pao-casadinho.png'
  },
  {
    id: 'doc-03',
    name: 'Pão de Minas',
    desc: '2 fatias de pão francês, recheado com cream cheese, doce de leite e queijo de minas.',
    price: 18.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Especial',
    image: 'assets/img/produtos/pao-de-minas.png'
  },
  {
    id: 'doc-04',
    name: 'Croissant com Creme de Avelã',
    desc: 'Croissant de chocolate coberto com creme de avelã.',
    price: 18.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Queridinho',
    image: 'assets/img/produtos/croissant-de-avela.png'
  },
  {
    id: 'doc-05',
    name: 'Brownie',
    desc: 'Brownie tradicional.',
    price: 10.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Clássico',
    image: 'assets/img/produtos/brownie.png'
  },
  {
    id: 'doc-06',
    name: 'Brownie com Sorvete',
    desc: 'Brownie tradicional com bola de sorvete de creme.',
    price: 16.00,
    group: 'doces',
    subgroup: 'todos',
    badge: 'Destaque',
    image: 'assets/img/produtos/brownie-com-sorvete.png'
  },
  {
    id: 'sal-01',
    name: 'Waffle',
    desc: 'Waffle de massa de pão de queijo.',
    price: 7.00,
    group: 'salgados',
    subgroup: 'todos',
    badge: 'Massa pão de queijo',
    image: 'assets/img/produtos/waffle.png'
  },
  {
    id: 'sal-02',
    name: 'Waffle Recheado',
    desc: 'Waffle de massa de pão de queijo. Sabores: presunto e queijo, creme de avelã, doce de leite e mel.',
    price: 12.00,
    group: 'salgados',
    subgroup: 'todos',
    badge: 'Sabores',
    image: 'assets/img/produtos/waffle-recheado.png'
  },
  {
    id: 'sal-03',
    name: '4 Mini Empadas',
    desc: 'Consultar sabores do dia.',
    price: 10.00,
    group: 'salgados',
    subgroup: 'todos',
    badge: 'Consultar',
    image: 'assets/img/produtos/mini-empadas.png'
  },
  {
    id: 'sal-04',
    name: 'Assados',
    desc: 'Croissant e outros. Consultar sabores do dia.',
    price: 12.00,
    group: 'salgados',
    subgroup: 'todos',
    badge: 'Do dia',
    image: 'assets/img/produtos/croissant.png'
  },
  {
    id: 'sal-05',
    name: 'Empada',
    desc: 'Consultar sabores do dia.',
    price: 13.00,
    group: 'salgados',
    subgroup: 'todos',
    badge: 'Do dia',
    image: 'assets/img/produtos/empada-tradicional.png'
  },
  {
    id: 'lan-01',
    name: 'Pão com Manteiga',
    desc: 'Fatia de pão caseiro com manteiga.',
    price: 7.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Na chapa',
    image: 'assets/img/produtos/pao-com-manteiga.png'
  },
  {
    id: 'lan-02',
    name: 'Pão com Manteiga, Mel e Orégano',
    desc: 'Fatia de pão caseiro com manteiga, mel e orégano.',
    price: 11.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Na chapa',
    image: 'assets/img/produtos/pao-com-manteiga-mel-e-oregano.png'
  },
  {
    id: 'lan-03',
    name: 'Pão com Ovo',
    desc: 'Pão francês, ovo e requeijão.',
    price: 13.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Café da manhã',
    image: 'assets/img/produtos/pao-com-ovo.png'
  },
  {
    id: 'lan-04',
    name: 'Misto Quente',
    desc: 'Pão francês, requeijão, presunto e muçarela.',
    price: 13.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Clássico',
    image: 'assets/img/produtos/misto-quente.png'
  },
  {
    id: 'lan-05',
    name: 'Bauru',
    desc: 'Pão francês, requeijão, presunto, muçarela, tomate e orégano.',
    price: 14.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Querido',
    image: 'assets/img/produtos/bauru.png'
  },
  {
    id: 'lan-06',
    name: 'Bauru com Ovo',
    desc: 'Pão francês, requeijão, presunto, muçarela, ovo, tomate e orégano.',
    price: 17.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Completo',
    image: 'assets/img/produtos/bauru-com-ovo.png'
  },
  {
    id: 'lan-08',
    name: 'Omelete',
    desc: 'Ovos, tomate, presunto, muçarela e orégano.',
    price: 21.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Forte',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'lan-09',
    name: 'Bacon & Ovo',
    desc: 'Fatia de pão caseiro, requeijão, ovo mexido, bacon e muçarela.',
    price: 22.00,
    group: 'lanches',
    subgroup: 'na-chapa',
    badge: 'Destaque',
    image: 'assets/img/produtos/bacon-e-ovo.png'
  },
]

const GROUPS = [
  { key:"all", label:"Tudo" },
  { key:"bebidas-quentes", label:"Bebidas Quentes" },
  { key:"bebidas-geladas", label:"Bebidas Geladas" },
  { key:"matcha", label:"Matcha" },
  { key:"doces", label:"Doces" },
  { key:"salgados", label:"Salgados" },
  { key:"lanches", label:"Lanches" },
  { key:"outras-bebidas", label:"Outras Bebidas" },
  { key:"adicionais", label:"Adicionais" }
];

const SUBGROUP_LABELS = {
  'com-cafe': 'Com café',
  'sem-cafe': 'Sem café',
  'quente': 'Quente',
  'gelado': 'Gelado',
  'todos': 'Todos',
  'na-chapa': 'Na chapa',
  'cafes-especiais': 'Cafés especiais',
  'bebidas-especiais': 'Bebidas especiais',
  'cafes-gelados': 'Cafés gelados',
  'sobremesas': 'Sobremesas',
};

const VALID_COUPONS = {
  BENDITO10: 0.10,
};




const testimonials = [
  {
    text: 'Um sebo café gostoso para sentar, tomar um café e esquecer um pouco da pressa.',
    author: 'Cliente Bendito',
    meta: 'momento de leitura'
  },
  {
    text: 'O ambiente dá vontade de ficar: café, livros e uma energia muito aconchegante.',
    author: 'Visitante',
    meta: 'fim de tarde'
  },
  {
    text: 'É daqueles lugares que a gente lembra pelo cheiro do café e pela sensação boa.',
    author: 'Cliente',
    meta: 'pausa no centro'
  }
]

const state = {
  group: 'all',
  subgroup: 'all',
  sort: 'featured',
  search: '',
  cart: load('bendito-cart-ui', []),
  favorites: load('bendito-favorites-ui', []),
  coupon: load('bendito-coupon-ui', ''),
  testimonialIndex: 0
}

const qtyState = {}

const elements = {
  tabs: document.getElementById('tabs'),
  subtabs: document.getElementById('subtabs'),
  menuGrid: document.getElementById('menuGrid'),
  menuSearch: document.getElementById('menuSearch'),
  sortSelect: document.getElementById('sortSelect'),
  searchbar: document.getElementById('searchbar'),
  cartCount: document.getElementById('cartCount'),
  cartDrawer: document.getElementById('cartDrawer'),
  overlay: document.getElementById('overlay'),
  cartItems: document.getElementById('cartItems'),
  subtotalValue: document.getElementById('subtotalValue'),
  discountValue: document.getElementById('discountValue'),
  totalValue: document.getElementById('totalValue'),
  checkoutFeedback: document.getElementById('checkoutFeedback'),
  reservationFeedback: document.getElementById('reservationFeedback'),
  testimonialText: document.getElementById('testimonialText'),
  testimonialAuthor: document.getElementById('testimonialAuthor'),
  testimonialMeta: document.getElementById('testimonialMeta')
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function money(value) {
  return formatMoney(value)
}

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function safeAttr(value) {
  return escapeHTML(value).replace(/`/g, '&#096;')
}

function safeImageUrl(url) {
  const value = String(url || '').trim()
  const isLocal = value.startsWith('assets/img/')
  const isTrustedRemote = value.startsWith('https://images.unsplash.com/')
  if (!isLocal && !isTrustedRemote) return ''
  return value.replace(/["'()\\]/g, '')
}

function imageStyle(url) {
  const safeUrl = safeImageUrl(url)
  return safeUrl ? `style="background-image:url('${safeUrl}')"` : ''
}

function cleanText(value, max = 120) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max)
}

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 13)
}

function phoneLooksValid(value) {
  const digits = normalizePhone(value)
  return digits.length >= 10 && digits.length <= 13
}

function getTodayISODate() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 10)
}

function reservationDateIsValid(dateValue) {
  if (!dateValue) return false
  const date = new Date(`${dateValue}T12:00:00`)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date(`${getTodayISODate()}T00:00:00`)
  const day = date.getDay()
  return date >= today && day >= 1 && day <= 6
}

function reservationTimeIsValid(timeValue) {
  if (!/^\d{2}:\d{2}$/.test(timeValue || '')) return false
  return (timeValue >= '09:00' && timeValue <= '12:00') || (timeValue >= '15:00' && timeValue <= '19:00')
}

function setLoading(button, isLoading, loadingText = 'Enviando...') {
  if (!button) return
  if (isLoading) {
    button.dataset.originalText = button.textContent
    button.textContent = loadingText
    button.disabled = true
  } else {
    button.textContent = button.dataset.originalText || button.textContent
    button.disabled = false
  }
}

function getSafeCartItems() {
  return cartDetails().map(item => ({
    product_id: item.id,
    id: item.id,
    name: cleanText(item.name, 100),
    price: Number(item.price || 0),
    quantity: Math.max(1, Math.min(99, Number(item.quantity || 1))),
    total: Number(item.total || 0),
    group: item.group,
    badge: cleanText(item.badge, 50)
  }))
}

function cartTotalValue() {
  const subtotal = cartDetails().reduce((acc, item) => acc + item.total, 0)
  const discountRate = VALID_COUPONS[state.coupon] || 0
  const discount = subtotal * discountRate
  return Number((subtotal - discount).toFixed(2))
}

async function createOrderWithSupabase(supabaseClient, payload) {
  const rpcItems = payload.items.map(item => ({ id: item.id, quantity: item.quantity }))

  const { data, error } = await supabaseClient.rpc('create_public_order', {
    p_customer_name: payload.customer_name,
    p_customer_phone: payload.customer_phone,
    p_order_note: payload.order_note,
    p_coupon: payload.coupon,
    p_items: rpcItems
  })

  if (!error) return { data, error: null, usedRpc: true }

  const message = String(error.message || '').toLowerCase()
  const missingRpc = message.includes('function') || message.includes('schema cache') || message.includes('could not find')
  if (!missingRpc) return { data: null, error, usedRpc: true }

  const fallbackOrder = {
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    order_note: payload.order_note,
    payment_method: 'Pagamento no caixa',
    payment_status: 'Aguardando pagamento no caixa',
    coupon: payload.coupon || null,
    source: 'site',
    order_total: payload.order_total,
    items_json: payload.items
  }

  const fullLegacy = await supabaseClient.from('orders').insert([fallbackOrder])
  if (!fullLegacy.error) return { data: fullLegacy.data, error: null, usedRpc: false }

  const legacyMessage = String(fullLegacy.error.message || '').toLowerCase()
  const columnMissing = legacyMessage.includes('column') || legacyMessage.includes('schema cache')
  if (!columnMissing) return { data: null, error: fullLegacy.error, usedRpc: false }

  const compatibleLegacy = await supabaseClient.from('orders').insert([{
    customer_name: payload.customer_name,
    payment_method: 'Pagamento no caixa',
    payment_status: 'Aguardando pagamento no caixa',
    coupon: payload.coupon || null,
    source: 'site',
    items_json: payload.items
  }])

  return { data: compatibleLegacy.data, error: compatibleLegacy.error, usedRpc: false }
}

function setQty(id, amount) {
  qtyState[id] = Math.max(1, amount)
  const el = document.getElementById(`qty-${id}`)
  if (el) el.textContent = qtyState[id]
}

function getQty(id) {
  return qtyState[id] || 1
}

function groupLabel(key) {
  const found = GROUPS.find(item => item.key === key)
  return found ? found.label : key
}

function renderTabs() {
  if (!elements.tabs) return
  elements.tabs.innerHTML = GROUPS.map(group => `
    <button class="tab-btn ${state.group === group.key ? 'active' : ''}" data-group="${safeAttr(group.key)}">
      ${escapeHTML(group.label)}
    </button>
  `).join('')

  if (!elements.subtabs) return
  if (state.group === 'all') {
    elements.subtabs.innerHTML = ''
    return
  }

  const subgroups = [...new Set(catalog.filter(item => item && item.group === state.group).map(item => item.subgroup))]
  const subtabOptions = ['all', ...subgroups]

  elements.subtabs.innerHTML = subtabOptions.map(sub => `
    <button class="subtab-btn ${state.subgroup === sub ? 'active' : ''}" data-subgroup="${safeAttr(sub)}">
      ${escapeHTML(sub === 'all' ? 'Todos' : (SUBGROUP_LABELS[sub] || sub))}
    </button>
  `).join('')
}

function getVisibleItems() {
  let items = catalog.filter(Boolean)

  if (state.group !== 'all') items = items.filter(item => item.group === state.group)
  if (state.subgroup !== 'all') items = items.filter(item => item.subgroup === state.subgroup)

  if (state.search.trim()) {
    const query = state.search.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.group.toLowerCase().includes(query)
    )
  }

  if (state.sort === 'lowest') items.sort((a, b) => a.price - b.price)
  if (state.sort === 'highest') items.sort((a, b) => b.price - a.price)
  if (state.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  return items
}

function renderMenu() {
  if (!elements.menuGrid) return
  const items = getVisibleItems()

  if (!items.length) {
    elements.menuGrid.innerHTML = `<div class="empty-state">Nenhum item encontrado com esse filtro.</div>`
    return
  }

  elements.menuGrid.innerHTML = items.map(item => `
    <article class="menu-card">
      <div class="menu-card__image" ${imageStyle(item.image)}>
        <span class="menu-card__badge">${escapeHTML(item.badge)}</span>
        <button class="favorite-btn ${state.favorites.includes(item.id) ? 'active' : ''}" data-favorite="${safeAttr(item.id)}" aria-label="Favoritar ${safeAttr(item.name)}">♥</button>
      </div>
      <div class="menu-card__body">
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.desc)}</p>
        <div class="meta-row">
          <span class="price">${money(item.price)}</span>
          <span class="category-chip">${escapeHTML(groupLabel(item.group))}</span>
        </div>
        <div class="actions-row">
          <div class="qty-box">
            <button data-action="minus" data-id="${safeAttr(item.id)}" aria-label="Diminuir quantidade">−</button>
            <span id="qty-${safeAttr(item.id)}">${getQty(item.id)}</span>
            <button data-action="plus" data-id="${safeAttr(item.id)}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="add-btn" data-add="${safeAttr(item.id)}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('')
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) state.favorites = state.favorites.filter(item => item !== id)
  else state.favorites.push(id)
  save('bendito-favorites-ui', state.favorites)
  renderMenu()
}

function addToCart(id, quantity = 1) {
  const product = catalog.find(item => item && item.id === id)
  if (!product) {
    notify(elements.checkoutFeedback, 'Produto não encontrado no cardápio. Atualize a página e tente novamente.', 4500)
    return
  }

  const safeQuantity = Math.max(1, Math.min(99, Number(quantity || 1)))
  const exists = state.cart.find(item => item.id === id)
  if (exists) exists.quantity = Math.min(99, exists.quantity + safeQuantity)
  else state.cart.push({ id, quantity: safeQuantity })
  save('bendito-cart-ui', state.cart)
  updateCart()
  notify(elements.checkoutFeedback, 'Produto adicionado ao carrinho.')
}

function changeItemQty(id, amount) {
  const target = state.cart.find(item => item.id === id)
  if (!target) return

  target.quantity += amount
  if (target.quantity <= 0) state.cart = state.cart.filter(item => item.id !== id)
  save('bendito-cart-ui', state.cart)
  updateCart()
}

function cartDetails() {
  return state.cart.map(item => {
    const product = catalog.find(entry => entry && entry.id === item.id)
    return product ? { ...product, quantity: item.quantity, total: item.quantity * product.price } : null
  }).filter(Boolean)
}

function updateCart() {
  const items = cartDetails()
  if (elements.cartCount) elements.cartCount.textContent = items.reduce((acc, item) => acc + item.quantity, 0)

  if (elements.cartItems) {
    if (!items.length) {
      elements.cartItems.innerHTML = `<div class="empty-state">Seu carrinho está vazio. Escolha algo do cardápio para começar.</div>`
    } else {
      elements.cartItems.innerHTML = items.map(item => `
        <article class="cart-item">
          <div class="cart-thumb" ${imageStyle(item.image)}></div>
          <div>
            <h4>${escapeHTML(item.name)}</h4>
            <p>${money(item.price)} • ${escapeHTML(groupLabel(item.group))}</p>
            <div class="cart-controls">
              <button data-cart="minus" data-id="${safeAttr(item.id)}" aria-label="Diminuir ${safeAttr(item.name)}">−</button>
              <strong>${item.quantity}</strong>
              <button data-cart="plus" data-id="${safeAttr(item.id)}" aria-label="Aumentar ${safeAttr(item.name)}">+</button>
              <button class="remove-link" data-cart="remove" data-id="${safeAttr(item.id)}">remover</button>
            </div>
          </div>
          <strong>${money(item.total)}</strong>
        </article>
      `).join('')
    }
  }

  const subtotal = items.reduce((acc, item) => acc + item.total, 0)
  const discountRate = VALID_COUPONS[state.coupon] || 0
  const discount = subtotal * discountRate
  const total = subtotal - discount

  if (elements.subtotalValue) elements.subtotalValue.textContent = money(subtotal)
  if (elements.discountValue) elements.discountValue.textContent = `- ${money(discount)}`
  if (elements.totalValue) elements.totalValue.textContent = money(total)
}

function openCart() {
  elements.cartDrawer?.classList.add('open')
  elements.overlay?.classList.add('open')
  document.body.classList.add('no-scroll')
}

function closeCart() {
  elements.cartDrawer?.classList.remove('open')
  elements.overlay?.classList.remove('open')
  document.body.classList.remove('no-scroll')
}

function notify(target, message, timeout = 2800) {
  if (!target) return
  target.textContent = message
  if (!timeout) return
  setTimeout(() => {
    if (target.textContent === message) target.textContent = ''
  }, timeout)
}

function applyCoupon() {
  const code = document.getElementById('couponInput')?.value.trim().toUpperCase()
  state.coupon = VALID_COUPONS[code] ? code : ''
  save('bendito-coupon-ui', state.coupon)
  updateCart()
  notify(elements.checkoutFeedback, state.coupon ? `Cupom aplicado: ${state.coupon}.` : 'Cupom inválido. Tente BENDITO10.')
}

async function checkout() {
  if (!state.cart.length) {
    notify(elements.checkoutFeedback, 'Adicione itens ao carrinho antes de finalizar.')
    return
  }

  const checkoutButton = document.getElementById('checkoutButton')
  const customerNameInput = document.getElementById('customerNameInput')
  const customerPhoneInput = document.getElementById('customerPhoneInput')
  const orderNoteInput = document.getElementById('orderNoteInput')
  const customerName = cleanText(customerNameInput?.value, 80)
  const customerPhone = normalizePhone(customerPhoneInput?.value)
  const orderNote = cleanText(orderNoteInput?.value, 280)

  if (!customerName) {
    notify(elements.checkoutFeedback, 'Informe o nome da pessoa para registrar o pedido.')
    return
  }

  if (!phoneLooksValid(customerPhone)) {
    notify(elements.checkoutFeedback, 'Informe um telefone válido para o pedido. Ex: (44) 99999-9999.')
    return
  }

  const safeItems = getSafeCartItems()
  if (!safeItems.length) {
    notify(elements.checkoutFeedback, 'Não foi possível montar os itens do pedido. Atualize a página e tente novamente.')
    return
  }

  let supabaseClient
  try {
    supabaseClient = await getSupabaseClient()
  } catch (error) {
    console.error(error)
    notify(elements.checkoutFeedback, 'Não consegui conectar ao Supabase. Confira assets/supabase.js e sua internet.', 7000)
    return
  }

  setLoading(checkoutButton, true, 'Finalizando...')

  const payload = {
    customer_name: customerName,
    customer_phone: customerPhone,
    order_note: orderNote,
    coupon: state.coupon || null,
    order_total: cartTotalValue(),
    items: safeItems
  }

  const { error, usedRpc } = await createOrderWithSupabase(supabaseClient, payload)

  setLoading(checkoutButton, false)

  if (error) {
    console.error(error)
    notify(elements.checkoutFeedback, 'Erro ao salvar pedido no Supabase. Confira o SQL de atualização, policies e chave pública.', 7500)
    return
  }

  state.cart = []
  save('bendito-cart-ui', state.cart)
  if (customerNameInput) customerNameInput.value = ''
  if (customerPhoneInput) customerPhoneInput.value = ''
  if (orderNoteInput) orderNoteInput.value = ''
  updateCart()
  notify(elements.checkoutFeedback, usedRpc ? 'Pedido enviado com segurança e salvo no Supabase.' : 'Pedido enviado. Rode o SQL de segurança para validar preços pelo banco.', 6500)
}

async function handleReservation(event) {
  event.preventDefault()

  const submitButton = event.target.querySelector('button[type="submit"]')
  const data = {
    name: cleanText(document.getElementById('resName')?.value, 80),
    phone: normalizePhone(document.getElementById('resPhone')?.value),
    date: document.getElementById('resDate')?.value || '',
    time: document.getElementById('resTime')?.value || '',
    guests: document.getElementById('resGuests')?.value || '',
    occasion: cleanText(document.getElementById('resOccasion')?.value, 60),
    notes: cleanText(document.getElementById('resNotes')?.value, 280)
  }

  if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
    notify(elements.reservationFeedback, 'Preencha os campos obrigatórios da reserva.')
    return
  }

  if (!phoneLooksValid(data.phone)) {
    notify(elements.reservationFeedback, 'Informe um telefone válido para a reserva.')
    return
  }

  if (!reservationDateIsValid(data.date)) {
    notify(elements.reservationFeedback, 'Escolha uma data futura entre segunda e sábado.')
    return
  }

  if (!reservationTimeIsValid(data.time)) {
    notify(elements.reservationFeedback, 'Escolha um horário dentro do funcionamento: 09:00 às 12:00 ou 15:00 às 19:00.')
    return
  }

  let supabaseClient
  try {
    supabaseClient = await getSupabaseClient()
  } catch (error) {
    console.error(error)
    notify(elements.reservationFeedback, 'Não consegui conectar ao Supabase. Confira assets/supabase.js e sua internet.', 7000)
    return
  }

  setLoading(submitButton, true, 'Salvando...')
  const { error } = await supabaseClient.from('reservations').insert([data])
  setLoading(submitButton, false)

  if (error) {
    console.error(error)
    notify(elements.reservationFeedback, 'Erro ao salvar reserva no Supabase.', 6500)
    return
  }

  event.target.reset()
  setMinimumReservationDate()
  notify(elements.reservationFeedback, 'Reserva enviada com sucesso e salva no Supabase.')
}

function setMinimumReservationDate() {
  const dateInput = document.getElementById('resDate')
  if (dateInput) dateInput.min = getTodayISODate()
}



function handleNewsletter(event) {
  event.preventDefault()
  event.target.reset()
  alert('Obrigado! Em breve você receberá novidades da Bendito Café.')
}

function renderTestimonial() {
  if (!elements.testimonialText) return
  const item = testimonials[state.testimonialIndex]
  elements.testimonialText.textContent = `“${item.text}”`
  elements.testimonialAuthor.textContent = item.author
  elements.testimonialMeta.textContent = item.meta
}

function changeTestimonial(direction = 1) {
  state.testimonialIndex = (state.testimonialIndex + direction + testimonials.length) % testimonials.length
  renderTestimonial()
}

function scrollToSelector(selector) {
  const element = document.querySelector(selector)
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

document.addEventListener('click', (event) => {
  const groupBtn = event.target.closest('[data-group]')
  if (groupBtn) {
    state.group = groupBtn.dataset.group
    state.subgroup = 'all'
    renderTabs()
    renderMenu()
  }

  const subgroupBtn = event.target.closest('[data-subgroup]')
  if (subgroupBtn) {
    state.subgroup = subgroupBtn.dataset.subgroup
    renderTabs()
    renderMenu()
  }

  const qtyBtn = event.target.closest('[data-action]')
  if (qtyBtn) {
    const id = qtyBtn.dataset.id
    const delta = qtyBtn.dataset.action === 'plus' ? 1 : -1
    setQty(id, getQty(id) + delta)
  }

  const addBtn = event.target.closest('[data-add]')
  if (addBtn) addToCart(addBtn.dataset.add, getQty(addBtn.dataset.add))

  const featuredBtn = event.target.closest('[data-featured-add]')
  if (featuredBtn) {
    addToCart(featuredBtn.dataset.featuredAdd, 1)
    openCart()
  }

  const favoriteBtn = event.target.closest('[data-favorite]')
  if (favoriteBtn) toggleFavorite(favoriteBtn.dataset.favorite)

  const cartBtn = event.target.closest('[data-cart]')
  if (cartBtn) {
    const id = cartBtn.dataset.id
    if (cartBtn.dataset.cart === 'plus') changeItemQty(id, 1)
    if (cartBtn.dataset.cart === 'minus') changeItemQty(id, -1)
    if (cartBtn.dataset.cart === 'remove') {
      state.cart = state.cart.filter(item => item.id !== id)
      save('bendito-cart-ui', state.cart)
      updateCart()
    }
  }

  if (event.target.matches('#openCart, #seeCartTop')) openCart()
  if (event.target.matches('#closeCart, #overlay')) closeCart()
  if (event.target.matches('#applyCoupon')) applyCoupon()
  if (event.target.matches('#checkoutButton')) checkout()
  if (event.target.matches('#searchToggle')) elements.searchbar?.classList.toggle('is-open')
  if (event.target.matches('#mobileNav')) document.getElementById('nav')?.classList.toggle('open')

  const scrollBtn = event.target.closest('[data-scroll]')
  if (scrollBtn) {
    scrollToSelector(scrollBtn.dataset.scroll)
    document.getElementById('nav')?.classList.remove('open')
  }

  const galleryItem = event.target.closest('.gallery-item')
  if (galleryItem) {
    const lightbox = document.getElementById('lightbox')
    const lightboxImage = document.getElementById('lightboxImage')
    if (lightbox && lightboxImage) {
      lightboxImage.src = galleryItem.dataset.image
      lightbox.classList.add('open')
      document.body.classList.add('no-scroll')
    }
  }

  if (event.target.matches('#closeLightbox') || event.target.matches('#lightbox')) {
    document.getElementById('lightbox')?.classList.remove('open')
    document.body.classList.remove('no-scroll')
  }

  const faq = event.target.closest('.faq-question')
  if (faq) faq.parentElement.classList.toggle('open')
})

elements.menuSearch?.addEventListener('input', (event) => {
  state.search = event.target.value
  renderMenu()
})

elements.sortSelect?.addEventListener('change', (event) => {
  state.sort = event.target.value
  renderMenu()
})

document.getElementById('reservationForm')?.addEventListener('submit', handleReservation)
document.getElementById('newsletterForm')?.addEventListener('submit', handleNewsletter)
document.getElementById('prevTestimonial')?.addEventListener('click', () => changeTestimonial(-1))
document.getElementById('nextTestimonial')?.addEventListener('click', () => changeTestimonial(1))

if (state.coupon && document.getElementById('couponInput')) document.getElementById('couponInput').value = state.coupon

setMinimumReservationDate()
renderTabs()
renderMenu()
updateCart()
renderTestimonial()
setInterval(() => changeTestimonial(1), 6500)
