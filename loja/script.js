const PRODUCTS = [
  { id: 1, name: 'Vaso Cerâmico Bege', cat: 'ceramica', price: 89.90, img: '../images/vaso.jpg', desc: 'Vaso em cerâmica fosca, acabamento artesanal. Ideal para flores secas.' },
  { id: 2, name: 'Dupla Vasos Terracota', cat: 'ceramica', price: 149.90, img: '../images/vasos-trio.jpg', desc: 'Conjunto de 2 vasos em tons terra. Peças únicas, feitas à mão.' },
  { id: 3, name: 'Vela Aromática Eucalipto', cat: 'aroma', price: 59.90, img: '../images/velas.jpg', desc: 'Vela de cera de soja com fragrância de eucalipto. 40h de duração.' },
  { id: 4, name: 'Difusor de Varetas 250ml', cat: 'aroma', price: 79.90, img: '../images/difusor.jpg', desc: 'Aromatizador de ambiente com varetas de rattan. Fragrância suave.' },
  { id: 5, name: 'Almofada Bouclé Off-White', cat: 'textil', price: 119.90, img: '../images/almofada.jpg', desc: 'Capa de almofada em tecido bouclé. 45x45cm. Toque macio.' },
  { id: 6, name: 'Espelho Redondo Dourado', cat: 'textil', price: 229.90, img: '../images/espelho.jpg', desc: 'Espelho decorativo com moldura fina dourada. 60cm de diâmetro.' },
  { id: 7, name: 'Top Canelado Vermelho', cat: 'moda', price: 79.90, img: '../images/top-vermelho.jpg', desc: 'Top de alcinha em malha canelada. Caimento ajustado, super confortável.' },
  { id: 8, name: 'Body Canelado Verde', cat: 'moda', price: 129.90, img: '../images/body-verde.jpg', desc: 'Body de alcinha em tecido canelado verde. Modelagem feminina.' },
  { id: 9, name: 'Short Linho Verde', cat: 'moda', price: 99.90, img: '../images/shorts-verde.jpg', desc: 'Short cintura alta em mistura de linho. Leve e fresquinho.' },
  { id: 10, name: 'Colar Borboleta Prata', cat: 'joias', price: 69.90, img: '../images/colar-borboleta.jpg', desc: 'Colar delicado com pingente de borboleta. Banhado a prata.' },
  { id: 11, name: 'Trio de Pulseiras Prata', cat: 'joias', price: 89.90, img: '../images/pulseiras.jpg', desc: 'Conjunto de 3 pulseiras finas. Empilháveis e minimalistas.' },
];

const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const cart = new Map();

const grid = document.getElementById('grid');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const drawerBody = document.getElementById('drawerBody');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function render(filter = 'all') {
  grid.innerHTML = '';
  PRODUCTS.filter(p => filter === 'all' || p.cat === filter).forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-id="${p.id}">Adicionar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(+btn.dataset.id));
  });
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  openDrawer();
}

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function renderCart() {
  const items = [...cart.entries()];
  cartCount.textContent = items.reduce((s, [, q]) => s + q, 0);
  if (items.length === 0) {
    drawerBody.innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    cartTotal.textContent = fmt(0);
    return;
  }
  let total = 0;
  drawerBody.innerHTML = items.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    total += p.price * qty;
    return `
      <div class="item">
        <img src="${p.img}" alt="${p.name}" />
        <div class="item-info">
          <h4>${p.name}</h4>
          <span class="small">${fmt(p.price)}</span>
          <div class="qty">
            <button onclick="changeQty(${id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${id}, 1)">+</button>
          </div>
        </div>
      </div>`;
  }).join('');
  cartTotal.textContent = fmt(total);
}

function openDrawer() { drawer.classList.add('open'); overlay.classList.add('show'); }
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); }

document.getElementById('cartBtn').addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.size === 0) return alert('Adicione produtos primeiro!');
  alert('Pedido enviado! Em breve você receberá o link de pagamento.');
  cart.clear(); renderCart(); closeDrawer();
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    render(chip.dataset.filter);
  });
});

window.changeQty = changeQty;
render();
renderCart();
