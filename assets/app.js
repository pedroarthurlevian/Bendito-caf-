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
    id: 'cappuccino-italiano',
    name: 'Cappuccino italiano',
    desc: 'Espuma cremosa, café equilibrado e final clássico para uma pausa com cara de cafeteria italiana.',
    price: 16,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'clássico',
    image: 'assets/img/produtos/cappuccino-italiano.jpeg'
  },
  {
    id: 'cappuccino-cremoso',
    name: 'Cappuccino cremoso',
    desc: 'Cappuccino encorpado, textura aveludada e doçura suave para acompanhar um bom livro.',
    price: 17,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'cremoso',
    image: 'assets/img/produtos/cappuccino-cremoso.jpeg'
  },
  {
    id: 'expresso-com-chantilly',
    name: 'Expresso com chantilly',
    desc: 'Café intenso com uma camada generosa de chantilly para deixar o espresso mais marcante.',
    price: 14,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'especial',
    image: 'assets/img/produtos/expresso-com-chantilly.jpeg'
  },
  {
    id: 'affogato',
    name: 'Affogato',
    desc: 'A combinação elegante de café e creme gelado: sobremesa e café no mesmo momento.',
    price: 19,
    group: 'doces',
    subgroup: 'todos',
    badge: 'sobremesa',
    image: 'assets/img/produtos/affogato.jpeg'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    desc: 'Café com chocolate, leite cremoso e visual marcante para quem gosta de sabor intenso.',
    price: 18,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'chocolate',
    image: 'assets/img/produtos/mocha.jpeg'
  },
  {
    id: 'super-mocha',
    name: 'Super Mocha',
    desc: 'Versão mais indulgente do mocha, com camadas cremosas e presença forte de chocolate.',
    price: 22,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'premium',
    image: 'assets/img/produtos/super-mocha.jpeg'
  },
  {
    id: 'cappuccino-gourmet',
    name: 'Cappuccino gourmet',
    desc: 'Cappuccino especial com chantilly, final aromático e aquele toque de cafeteria aconchegante.',
    price: 21,
    group: 'bebidas-quentes',
    subgroup: 'com-cafe',
    badge: 'gourmet',
    image: 'assets/img/produtos/cappuccino-gourmet.jpeg'
  },
  {
    id: 'chai-latte',
    name: 'Chai Latte',
    desc: 'Leite cremoso com especiarias, canela e aroma acolhedor para uma pausa diferente.',
    price: 19,
    group: 'bebidas-quentes',
    subgroup: 'sem-cafe',
    badge: 'aromático',
    image: 'assets/img/produtos/chai-latte.jpeg'
  },
  {
    id: 'cappuccino-gelado',
    name: 'Cappuccino gelado',
    desc: 'Café gelado cremoso com caramelo, perfeito para dias quentes e momentos leves.',
    price: 20,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'gelado',
    image: 'assets/img/produtos/cappuccino-gelado.jpeg'
  },
  {
    id: 'americano-gelado',
    name: 'Americano gelado',
    desc: 'Café gelado com leite em movimento, refrescante, bonito e direto ao ponto.',
    price: 15,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'refrescante',
    image: 'assets/img/produtos/americano-gelado.jpeg'
  },
  {
    id: 'pink-lemonade',
    name: 'Pink Lemonade',
    desc: 'Limonada gelada com toque frutado e visual vibrante para uma opção leve e refrescante.',
    price: 15,
    group: 'outras-bebidas',
    subgroup: 'gelado',
    badge: 'cítrica',
    image: 'assets/img/produtos/pink-lemonade.jpeg'
  },
  {
    id: 'chai-latte-gelado',
    name: 'Chai Latte gelado',
    desc: 'Versão gelada do chai latte, com especiarias, leite cremoso e perfil aromático.',
    price: 20,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'aromático',
    image: 'assets/img/produtos/chai-latte-gelado.jpeg'
  },
// Bebidas quentes - com café
// Bebidas geladas - com café
// Matcha
  { id:"mat-01", group:"matcha", subgroup:"quente", name:"Matcha Puro", price:11.00, badge:"Quente", image:"assets/img/produtos/matcha-puro.jpeg", desc:"Matcha servido de forma pura, com sabor marcante e perfil vegetal elegante." },
  { id:"mat-02", group:"matcha", subgroup:"quente", name:"Latte Matcha", price:15.00, badge:"Quente", image:"assets/img/produtos/latte-matcha.jpeg", desc:"Matcha com leite cremoso e acabamento delicado para uma pausa reconfortante." },
  { id:"mat-03", group:"matcha", subgroup:"gelado", name:"Latte Matcha com Morango", price:18.00, badge:"Gelado", image:"assets/img/produtos/latte-matcha-com-morango.jpeg", desc:"Combinação refrescante de matcha, leite, morango e gelo com visual marcante." },
  { id:"mat-04", group:"matcha", subgroup:"gelado", name:"Latte Matcha com Coco e Menta", price:18.00, badge:"Gelado", image:"assets/img/produtos/latte-matcha-com-coco-e-menta.jpeg", desc:"Matcha gelado com coco e menta para uma bebida leve, cremosa e refrescante." },
  { id:"mat-05", group:"matcha", subgroup:"gelado", name:"Matcha Tropical", price:18.00, badge:"Tropical", image:"assets/img/produtos/matcha-tropical.jpeg", desc:"Matcha gelado com perfil tropical e refrescante, ideal para dias quentes." },
  { id:"mat-06", group:"matcha", subgroup:"gelado", name:"Latte Matcha com Maracujá", price:18.00, badge:"Gelado", image:"assets/img/produtos/latte-matcha-com-maracuja.jpeg", desc:"Matcha gelado combinado com leite e maracujá para um resultado cremoso e frutado." },
  { id:"mat-07", group:"matcha", subgroup:"gelado", name:"Matcha Maracujá Spritz", price:19.00, badge:"Spritz", image:"assets/img/produtos/matcha-maracuja-spritz.jpeg", desc:"Bebida refrescante com matcha, maracujá e borbulhas leves para um toque especial." },

  // Outras bebidas
  { id:"out-01", group:"outras-bebidas", subgroup:"todos", name:"Água", price:5.00, badge:"Clássico", image:"https://images.unsplash.com/photo-1564419439288-b2d15a86f8ff?q=80&w=1200&auto=format&fit=crop", desc:"Sem gás ou com gás." },
  { id:"out-02", group:"outras-bebidas", subgroup:"todos", name:"Sucos de Polpa", price:9.00, badge:"Consultar", image:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=1200&auto=format&fit=crop", desc:"Consultar sabores do dia." },
  { id:"out-03", group:"outras-bebidas", subgroup:"todos", name:"Coca-Cola 200ml", price:5.00, badge:"Gelado", image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1200&auto=format&fit=crop", desc:"Refrigerante em porção de 200ml." },

  // Adicionais
  { id:"add-01", group:"adicionais", subgroup:"todos", name:"Leite sem Lactose", price:1.50, badge:"Adicional", image:"https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop", desc:"Adicional para adaptar a bebida." },
  { id:"add-02", group:"adicionais", subgroup:"todos", name:"Ovomaltine", price:3.00, badge:"Extra", image:"assets/img/produtos/ovomaltine.jpeg", desc:"Adicional crocante para enriquecer bebidas e sobremesas." },
  { id:"add-03", group:"adicionais", subgroup:"todos", name:"Chantilly", price:3.00, badge:"Extra", image:"assets/img/produtos/chantilly.jpeg", desc:"Cobertura adicional." },
  { id:"add-04", group:"adicionais", subgroup:"todos", name:"Leite Vegetal", price:4.00, badge:"Adicional", image:"https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop", desc:"Opção vegetal para bebidas." },
  { id:"add-05", group:"adicionais", subgroup:"todos", name:"Borda", price:5.00, badge:"Doce", image:"assets/img/produtos/borda.jpeg", desc:"Doce de leite ou creme de avelã." },

  // Doces
  { id:"doc-01", group:"doces", subgroup:"todos", name:"Bendito Bolinho", price:13.00, badge:"Vitrine", image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop", desc:"Mini bolo com cobertura de ganache de chocolate. Consultar sabores." },
  { id:"doc-02", group:"doces", subgroup:"todos", name:"Pão Casadinho", price:13.00, badge:"Doce", image:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1200&auto=format&fit=crop", desc:"2 fatias de pão francês: uma com queijo e requeijão e a outra doce com creme de avelã, doce de leite ou goiabada." },
  { id:"doc-03", group:"doces", subgroup:"todos", name:"Pão de Minas", price:18.00, badge:"Especial", image:"https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=1200&auto=format&fit=crop", desc:"2 fatias de pão francês, recheado com cream cheese, doce de leite e queijo de minas." },
  { id:"doc-04", group:"doces", subgroup:"todos", name:"Croissant com Creme de Avelã", price:18.00, badge:"Queridinho", image:"https://images.unsplash.com/photo-1555507036-ab794f4afe5a?q=80&w=1200&auto=format&fit=crop", desc:"Croissant de chocolate coberto com creme de avelã." },
  { id:"doc-05", group:"doces", subgroup:"todos", name:"Brownie", price:10.00, badge:"Clássico", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop", desc:"Brownie tradicional." },
  { id:"doc-06", group:"doces", subgroup:"todos", name:"Brownie com Sorvete", price:16.00, badge:"Destaque", image:"https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=1200&auto=format&fit=crop", desc:"Brownie tradicional com bola de sorvete de creme." },

  // Salgados
  { id:"sal-01", group:"salgados", subgroup:"todos", name:"Waffle", price:7.00, badge:"Massa pão de queijo", image:"https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop", desc:"Waffle de massa de pão de queijo." },
  { id:"sal-02", group:"salgados", subgroup:"todos", name:"Waffle Recheado", price:12.00, badge:"Sabores", image:"https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop", desc:"Waffle de massa de pão de queijo. Sabores: presunto e queijo, creme de avelã, doce de leite e mel." },
  { id:"sal-03", group:"salgados", subgroup:"todos", name:"4 Mini Empadas", price:10.00, badge:"Consultar", image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop", desc:"Consultar sabores do dia." },
  { id:"sal-04", group:"salgados", subgroup:"todos", name:"Assados", price:12.00, badge:"Do dia", image:"https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=1200&auto=format&fit=crop", desc:"Croissant e outros, consultar sabores do dia." },
  { id:"sal-05", group:"salgados", subgroup:"todos", name:"Empada", price:13.00, badge:"Do dia", image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop", desc:"Consultar sabores do dia." },

  // Lanches
  { id:"lan-01", group:"lanches", subgroup:"na-chapa", name:"Pão com Manteiga", price:7.00, badge:"Na chapa", image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop", desc:"Fatia de pão caseiro com manteiga." },
  { id:"lan-02", group:"lanches", subgroup:"na-chapa", name:"Pão com Manteiga, Mel e Orégano", price:11.00, badge:"Na chapa", image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop", desc:"Fatia de pão caseiro com manteiga, mel e orégano." },
  { id:"lan-03", group:"lanches", subgroup:"na-chapa", name:"Pão com Ovo", price:13.00, badge:"Café da manhã", image:"https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop", desc:"Pão francês, ovo e requeijão." },
  { id:"lan-04", group:"lanches", subgroup:"na-chapa", name:"Misto Quente", price:13.00, badge:"Clássico", image:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop", desc:"Pão francês, requeijão, presunto e muçarela." },
  { id:"lan-05", group:"lanches", subgroup:"na-chapa", name:"Bauru", price:14.00, badge:"Querido", image:"https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=1200&auto=format&fit=crop", desc:"Pão francês, requeijão, presunto, muçarela, tomate e orégano." },
  { id:"lan-06", group:"lanches", subgroup:"na-chapa", name:"Bauru com Ovo", price:17.00, badge:"Completo", image:"https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=1200&auto=format&fit=crop", desc:"Pão francês, requeijão, presunto, muçarela, ovo, tomate e orégano." },
  { id:"lan-07", group:"lanches", subgroup:"na-chapa", name:"Sanduiche Natural", price:20.00, badge:"Leve", image:"https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=1200&auto=format&fit=crop", desc:"Pão integral, patê de frango, alface e tomate." },
  { id:"lan-08", group:"lanches", subgroup:"na-chapa", name:"Omelete", price:21.00, badge:"Forte", image:"https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=1200&auto=format&fit=crop", desc:"Ovos, tomate, presunto, muçarela e orégano." },
  { id:"lan-09", group:"lanches", subgroup:"na-chapa", name:"Bacon & Ovo", price:22.00, badge:"Destaque", image:"https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?q=80&w=1200&auto=format&fit=crop", desc:"Fatia de pão caseiro, requeijão, ovo mexido, bacon e muçarela." },
  {
    id: 'frapuccino-menta-e-chocolate',
    name: 'Frapuccino Menta e Chocolate',
    desc: 'Bebida gelada com chocolate, toque de menta e apresentação marcante para refrescar com sabor.',
    price: 24,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'menta',
    image: 'assets/img/produtos/frapuccino-menta-e-chocolate.jpeg'
  },
  {
    id: 'chococcino',
    name: 'Chococcino',
    desc: 'Mistura cremosa de café com chocolate, gelada e encorpada para quem gosta de sabores intensos.',
    price: 20,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'chocolate',
    image: 'assets/img/produtos/chococcino.jpeg'
  },
  {
    id: 'expresso-com-tonica',
    name: 'Expresso com tônica',
    desc: 'Espresso servido com tônica e gelo, combinação refrescante e surpreendente para dias quentes.',
    price: 16,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'refrescante',
    image: 'assets/img/produtos/expresso-com-tonica.jpeg'
  },
  {
    id: 'frapuccino-super-mocha',
    name: 'Frapuccino Super Mocha',
    desc: 'Versão gelada e cremosa do mocha, com bastante chocolate e final indulgente.',
    price: 24,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'premium',
    image: 'assets/img/produtos/frapuccino-super-mocha.jpeg'
  },
  {
    id: 'cappuccino-frozen',
    name: 'Cappuccino Frozen',
    desc: 'Cappuccino batido e bem cremoso, servido gelado para unir café e refrescância.',
    price: 21,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'frozen',
    image: 'assets/img/produtos/cappuccino-frozen.jpeg'
  },
  {
    id: 'cha-matte-gelado',
    name: 'Chá Matte Gelado',
    desc: 'Chá matte servido bem gelado, leve e ideal para acompanhar um lanche da tarde.',
    price: 14,
    group: 'outras-bebidas',
    subgroup: 'gelado',
    badge: 'chá',
    image: 'assets/img/produtos/cha-matte-gelado.jpeg'
  },
  {
    id: 'soda-italiana',
    name: 'Soda Italiana',
    desc: 'Bebida gaseificada, leve e colorida, perfeita para quem quer algo sem café e bem refrescante.',
    price: 16,
    group: 'outras-bebidas',
    subgroup: 'gelado',
    badge: 'refrescante',
    image: 'assets/img/produtos/soda-italiana.jpeg'
  },
  {
    id: 'guarana-da-amazonia',
    name: 'Guaraná da Amazônia',
    desc: 'Bebida cremosa e gelada com sabor marcante de guaraná, ótima para uma pausa diferente.',
    price: 18,
    group: 'outras-bebidas',
    subgroup: 'gelado',
    badge: 'especial',
    image: 'assets/img/produtos/guarana-da-amazonia.jpeg'
  },
  {
    id: 'chocolate-gelado',
    name: 'Chocolate gelado',
    desc: 'Chocolate gelado cremoso, com calda marcante e visual que chama atenção logo de cara.',
    price: 19,
    group: 'bebidas-geladas',
    subgroup: 'gelado',
    badge: 'cremoso',
    image: 'assets/img/produtos/chocolate-gelado.jpeg'
  },
  {
    id: 'golden-lemonade',
    name: 'Golden Lemonade',
    desc: 'Limonada especial servida com gelo e toque dourado para uma opção cítrica e refrescante.',
    price: 15,
    group: 'outras-bebidas',
    subgroup: 'gelado',
    badge: 'cítrica',
    image: 'assets/img/produtos/golden-lemonade.jpeg'
  }
];

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
  'sobremesas': 'Sobremesas'
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
    <button class="tab-btn ${state.group === group.key ? 'active' : ''}" data-group="${group.key}">
      ${group.label}
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
    <button class="subtab-btn ${state.subgroup === sub ? 'active' : ''}" data-subgroup="${sub}">
      ${sub === 'all' ? 'Todos' : (SUBGROUP_LABELS[sub] || sub)}
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
      <div class="menu-card__image" style="background-image:url('${item.image}')">
        <span class="menu-card__badge">${item.badge}</span>
        <button class="favorite-btn ${state.favorites.includes(item.id) ? 'active' : ''}" data-favorite="${item.id}">♥</button>
      </div>
      <div class="menu-card__body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="meta-row">
          <span class="price">${money(item.price)}</span>
          <span class="category-chip">${groupLabel(item.group)}</span>
        </div>
        <div class="actions-row">
          <div class="qty-box">
            <button data-action="minus" data-id="${item.id}">−</button>
            <span id="qty-${item.id}">${getQty(item.id)}</span>
            <button data-action="plus" data-id="${item.id}">+</button>
          </div>
          <button class="add-btn" data-add="${item.id}">Adicionar</button>
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
  const exists = state.cart.find(item => item.id === id)
  if (exists) exists.quantity += quantity
  else state.cart.push({ id, quantity })
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
          <div class="cart-thumb" style="background-image:url('${item.image}')"></div>
          <div>
            <h4>${item.name}</h4>
            <p>${money(item.price)} • ${groupLabel(item.group)}</p>
            <div class="cart-controls">
              <button data-cart="minus" data-id="${item.id}">−</button>
              <strong>${item.quantity}</strong>
              <button data-cart="plus" data-id="${item.id}">+</button>
              <button class="remove-link" data-cart="remove" data-id="${item.id}">remover</button>
            </div>
          </div>
          <strong>${money(item.total)}</strong>
        </article>
      `).join('')
    }
  }

  const subtotal = items.reduce((acc, item) => acc + item.total, 0)
  const discount = state.coupon === 'BENDITO10' ? subtotal * 0.1 : 0
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
  state.coupon = code === 'BENDITO10' ? code : ''
  save('bendito-coupon-ui', state.coupon)
  updateCart()
  notify(elements.checkoutFeedback, state.coupon ? 'Cupom aplicado: 10% de desconto.' : 'Cupom inválido. Tente BENDITO10.')
}

async function checkout() {
  if (!state.cart.length) {
    notify(elements.checkoutFeedback, 'Adicione itens ao carrinho antes de finalizar.')
    return
  }

  const customerName = (document.getElementById('customerNameInput')?.value || '').trim()

  if (!customerName) {
    notify(elements.checkoutFeedback, 'Informe o nome da pessoa para registrar o pedido.')
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

  const { error } = await supabaseClient
    .from('orders')
    .insert([{ 
      customer_name: customerName,
      payment_method: 'Pagamento no caixa',
      payment_status: 'Aguardando pagamento no caixa',
      coupon: state.coupon || null,
      source: 'site',
      items_json: cartDetails()
    }])

  if (error) {
    console.error(error)
    notify(elements.checkoutFeedback, 'Erro ao salvar pedido no Supabase. Veja as policies e a chave pública.', 6500)
    return
  }

  state.cart = []
  save('bendito-cart-ui', state.cart)
  const customerNameInput = document.getElementById('customerNameInput')
  if (customerNameInput) customerNameInput.value = ''
  updateCart()
  notify(elements.checkoutFeedback, 'Pedido enviado com sucesso e salvo no Supabase.')
}

async function handleReservation(event) {
  event.preventDefault()

  const data = {
    name: document.getElementById('resName')?.value.trim() || '',
    phone: document.getElementById('resPhone')?.value.trim() || '',
    date: document.getElementById('resDate')?.value || '',
    time: document.getElementById('resTime')?.value || '',
    guests: document.getElementById('resGuests')?.value || '',
    occasion: document.getElementById('resOccasion')?.value || '',
    notes: document.getElementById('resNotes')?.value.trim() || ''
  }

  if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
    notify(elements.reservationFeedback, 'Preencha os campos obrigatórios da reserva.')
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

  const { error } = await supabaseClient.from('reservations').insert([data])

  if (error) {
    console.error(error)
    notify(elements.reservationFeedback, 'Erro ao salvar reserva no Supabase.', 6500)
    return
  }

  event.target.reset()
  notify(elements.reservationFeedback, 'Reserva enviada com sucesso e salva no Supabase.')
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
  if (scrollBtn) scrollToSelector(scrollBtn.dataset.scroll)

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

renderTabs()
renderMenu()
updateCart()
renderTestimonial()
setInterval(() => changeTestimonial(1), 6500)
