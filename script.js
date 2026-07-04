/* ======================================================
   DEMO USERS (in a real app this lives in a secure backend)
====================================================== */
const USERS = [
  { username: "admin",    password: "admin123",    role: "admin",    name: "Admin User" },
  { username: "customer", password: "customer123", role: "customer", name: "Abebe Kebede" },
];

let currentUser = null;

/* ======================================================
   PRODUCT + ORDER STATE (in memory — resets on refresh)
====================================================== */
let PRODUCTS = [
  {id:1, name:"Paracetamol 500mg", cat:"Pain Relief", icon:"💊", price:45, unit:"Box of 20", stock:"in", desc:"Fast relief from fever & mild pain"},
  {id:2, name:"Ibuprofen 400mg", cat:"Pain Relief", icon:"💊", price:60, unit:"Box of 10", stock:"in", desc:"Anti-inflammatory pain reliever"},
  {id:3, name:"Amoxicillin 250mg", cat:"Prescription", icon:"🧪", price:120, unit:"Box of 21", stock:"low", desc:"Antibiotic — requires prescription"},
  {id:4, name:"Vitamin C 1000mg", cat:"Vitamins", icon:"🍊", price:150, unit:"Bottle of 60", stock:"in", desc:"Immune support effervescent tablets"},
  {id:5, name:"Multivitamin Daily", cat:"Vitamins", icon:"🌿", price:220, unit:"Bottle of 30", stock:"in", desc:"Complete daily nutrient blend"},
  {id:6, name:"Adhesive Bandages", cat:"First Aid", icon:"🩹", price:35, unit:"Pack of 40", stock:"in", desc:"Flexible fabric wound plasters"},
  {id:7, name:"Antiseptic Solution", cat:"First Aid", icon:"🧴", price:80, unit:"250ml bottle", stock:"in", desc:"Cleans cuts & minor wounds"},
  {id:8, name:"Digital Thermometer", cat:"Devices", icon:"🌡️", price:320, unit:"1 unit", stock:"low", desc:"Fast accurate temperature reading"},
  {id:9, name:"Blood Pressure Monitor", cat:"Devices", icon:"🩺", price:1450, unit:"1 unit", stock:"in", desc:"Automatic upper-arm BP monitor"},
  {id:10, name:"Baby Diaper Rash Cream", cat:"Baby Care", icon:"🍼", price:95, unit:"75g tube", stock:"in", desc:"Soothes and protects delicate skin"},
  {id:11, name:"Gentle Baby Wipes", cat:"Baby Care", icon:"🧻", price:70, unit:"Pack of 80", stock:"in", desc:"Fragrance-free, alcohol-free wipes"},
  {id:12, name:"Hand Sanitizer Gel", cat:"Hygiene", icon:"🧼", price:55, unit:"250ml bottle", stock:"in", desc:"70% alcohol, kills 99.9% germs"},
  {id:13, name:"Face Masks (Medical)", cat:"Hygiene", icon:"😷", price:90, unit:"Box of 50", stock:"in", desc:"3-ply disposable protective masks"},
  {id:14, name:"Cough Syrup", cat:"Pain Relief", icon:"🍶", price:75, unit:"100ml bottle", stock:"in", desc:"Relieves dry & chesty cough"},
  {id:15, name:"Omeprazole 20mg", cat:"Prescription", icon:"🧪", price:135, unit:"Box of 14", stock:"in", desc:"Reduces stomach acid — Rx required"},
  {id:16, name:"Moisturizing Lotion", cat:"Skin Care", icon:"🧴", price:160, unit:"200ml bottle", stock:"in", desc:"For dry & sensitive skin"},
];
let nextProductId = 17;
let orders = []; // { id, customerName, items, total, date, status }
let nextOrderId = 1001;

let activeCat = "All";
let searchTerm = "";
let cart = {}; // productId -> qty

function fmt(n){ return n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + " ETB"; }

/* ======================================================
   LOGIN
====================================================== */
const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

document.querySelectorAll('.demo-fill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById('loginUsername').value = btn.dataset.user;
    document.getElementById('loginPassword').value = btn.dataset.pass;
  });
});

loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value;
  const match = USERS.find(user => user.username === u && user.password === p);
  if(!match){
    loginError.textContent = "Incorrect username or password. Try a demo account below.";
    return;
  }
  currentUser = match;
  loginError.textContent = "";
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  enterApp();
});

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  currentUser = null;
  cart = {};
  appShell.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginForm.reset();
});

function enterApp(){
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('roleBadge').textContent = currentUser.role;

  const customerView = document.getElementById('customerView');
  const adminView = document.getElementById('adminView');

  if(currentUser.role === 'admin'){
    document.getElementById('headerSubtitle').textContent = "Admin Dashboard";
    customerView.classList.add('hidden');
    adminView.classList.remove('hidden');
    renderAdminOverview();
    renderAdminProducts();
    renderAdminOrders();
  } else {
    document.getElementById('headerSubtitle').textContent = "Trusted medicines & wellness, delivered with care";
    adminView.classList.add('hidden');
    customerView.classList.remove('hidden');
    renderChips();
    renderProducts();
    renderCart();
  }
}

/* ======================================================
   CUSTOMER STOREFRONT
====================================================== */
const productsEl = document.getElementById('products');
const chipsEl = document.getElementById('chips');
const resultMeta = document.getElementById('resultMeta');
const searchInput = document.getElementById('searchInput');
const searchBar = document.getElementById('searchBar');
const clearBtn = document.getElementById('clearBtn');
const cartCountEl = document.getElementById('cartCount');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const drawerBody = document.getElementById('drawerBody');
const subtotalEl = document.getElementById('subtotal');
const deliveryFeeEl = document.getElementById('deliveryFee');
const totalAmtEl = document.getElementById('totalAmt');
const checkoutBtn = document.getElementById('checkoutBtn');

function getCategories(){
  return ["All", ...Array.from(new Set(PRODUCTS.map(p=>p.cat)))];
}
const CAT_ICON = {All:"🗂️", "Pain Relief":"💊", "Prescription":"🧪", "Vitamins":"🌿", "First Aid":"🩹", "Devices":"🩺", "Baby Care":"🍼", "Hygiene":"🧼", "Skin Care":"🧴"};

function renderChips(){
  chipsEl.innerHTML = getCategories().map(c => `
    <button class="chip ${c===activeCat?'active':''}" data-cat="${c}">
      <span>${CAT_ICON[c]||'📦'}</span>${c}
    </button>
  `).join('');
  chipsEl.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeCat = btn.dataset.cat;
      renderChips();
      renderProducts();
    });
  });
}

function getFiltered(){
  return PRODUCTS.filter(p=>{
    const matchesCat = activeCat === "All" || p.cat === activeCat;
    const matchesSearch = (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });
}

function renderProducts(){
  const list = getFiltered();
  resultMeta.textContent = `${list.length} product${list.length!==1?'s':''} found`;

  if(list.length === 0){
    productsEl.innerHTML = `
      <div class="empty-state">
        <div class="glyph">🔍</div>
        <h3>No products match your search</h3>
        <p>Try a different keyword or category.</p>
      </div>`;
    return;
  }

  productsEl.innerHTML = list.map(p=>{
    const qty = cart[p.id] || 0;
    return `
    <div class="card">
      <span class="tag">${p.cat}</span>
      <span class="stock ${p.stock}">${p.stock==='in' ? 'In stock' : 'Low stock'}</span>
      <div class="icon-wrap"><div class="icon-circle">${p.icon}</div></div>
      <h3>${p.name}</h3>
      <p class="desc">${p.desc} · ${p.unit}</p>
      <div class="bottom-row">
        <span class="price">${p.price}<sup>ETB</sup></span>
        ${qty === 0
          ? `<button class="add-btn" data-id="${p.id}" data-action="add">+ Add</button>`
          : `<div class="qty-row">
               <button data-id="${p.id}" data-action="dec">−</button>
               <span>${qty}</span>
               <button data-id="${p.id}" data-action="inc">+</button>
             </div>`
        }
      </div>
    </div>`;
  }).join('');

  productsEl.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if(action === 'add' || action === 'inc') cart[id] = (cart[id]||0) + 1;
      if(action === 'dec') {
        cart[id] = (cart[id]||0) - 1;
        if(cart[id] <= 0) delete cart[id];
      }
      renderProducts();
      renderCart();
    });
  });
}

function renderCart(){
  const ids = Object.keys(cart);
  cartCountEl.textContent = ids.reduce((sum,id)=>sum+cart[id],0);

  if(ids.length === 0){
    drawerBody.innerHTML = `
      <div class="drawer-empty">
        <div class="glyph">🧺</div>
        <h3>Your cart is empty</h3>
        <p>Add products to see them here.</p>
      </div>`;
    subtotalEl.textContent = fmt(0);
    deliveryFeeEl.textContent = fmt(0);
    totalAmtEl.textContent = fmt(0);
    checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  drawerBody.innerHTML = ids.map(id=>{
    const p = PRODUCTS.find(pp=>pp.id === Number(id));
    const qty = cart[id];
    subtotal += p.price * qty;
    return `
      <div class="drawer-item">
        <div class="di-icon">${p.icon}</div>
        <div class="di-info">
          <h4>${p.name}</h4>
          <span>${qty} × ${p.price} ETB</span>
        </div>
        <button class="di-remove" data-id="${p.id}">Remove</button>
      </div>`;
  }).join('');

  const delivery = subtotal > 500 ? 0 : 40;
  subtotalEl.textContent = fmt(subtotal);
  deliveryFeeEl.textContent = delivery === 0 ? "Free" : fmt(delivery);
  totalAmtEl.textContent = fmt(subtotal + delivery);
  checkoutBtn.disabled = false;

  drawerBody.querySelectorAll('.di-remove').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      delete cart[btn.dataset.id];
      renderProducts();
      renderCart();
    });
  });
}

function openDrawer(){ drawer.classList.add('open'); overlay.classList.add('open'); }
function closeDrawer(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }

document.getElementById('cartCapsule').addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

searchInput.addEventListener('input', (e)=>{
  searchTerm = e.target.value;
  searchBar.classList.toggle('has-text', searchTerm.length > 0);
  renderProducts();
});
clearBtn.addEventListener('click', ()=>{
  searchInput.value = "";
  searchTerm = "";
  searchBar.classList.remove('has-text');
  renderProducts();
  searchInput.focus();
});

checkoutBtn.addEventListener('click', ()=>{
  const ids = Object.keys(cart);
  if(ids.length === 0) return;
  let subtotal = 0;
  const items = ids.map(id=>{
    const p = PRODUCTS.find(pp=>pp.id === Number(id));
    const qty = cart[id];
    subtotal += p.price * qty;
    return { id:p.id, name:p.name, qty, price:p.price };
  });
  const delivery = subtotal > 500 ? 0 : 40;
  orders.push({
    id: nextOrderId++,
    customerName: currentUser.name,
    items,
    total: subtotal + delivery,
    date: new Date().toLocaleDateString(),
    status: "Pending"
  });
  alert("Thank you for your order! A Pawlos Drug Store team member will confirm delivery shortly.");
  cart = {};
  renderProducts();
  renderCart();
  closeDrawer();
});

/* ======================================================
   ADMIN DASHBOARD
====================================================== */
document.querySelectorAll('.admin-nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.admin-nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.admin-page').forEach(p=>p.classList.add('hidden'));
    document.getElementById('page-' + btn.dataset.page).classList.remove('hidden');
  });
});

function renderAdminOverview(){
  document.getElementById('statProducts').textContent = PRODUCTS.length;
  document.getElementById('statOrders').textContent = orders.length;
  const revenue = orders.reduce((sum,o)=>sum+o.total,0);
  document.getElementById('statRevenue').textContent = fmt(revenue);
  document.getElementById('statLowStock').textContent = PRODUCTS.filter(p=>p.stock==='low').length;

  const tbody = document.querySelector('#recentOrdersTable tbody');
  const recent = orders.slice(-5).reverse();
  tbody.innerHTML = recent.length ? recent.map(o=>`
    <tr>
      <td>#${o.id}</td>
      <td>${o.customerName}</td>
      <td>${o.items.reduce((s,i)=>s+i.qty,0)} items</td>
      <td>${fmt(o.total)}</td>
      <td><span class="status-${o.status.toLowerCase()}">${o.status}</span></td>
    </tr>`).join('') : `<tr><td colspan="5" style="text-align:center;color:var(--ink-500);padding:24px;">No orders yet</td></tr>`;
}

function renderAdminProducts(){
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = PRODUCTS.map(p=>`
    <tr>
      <td class="table-icon">${p.icon}</td>
      <td>${p.name}</td>
      <td>${p.cat}</td>
      <td>${fmt(p.price)}</td>
      <td>${p.stock==='in' ? '✅ In stock' : '⚠️ Low stock'}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-action="edit" data-id="${p.id}" title="Edit">✏️</button>
          <button class="icon-btn danger" data-action="delete" data-id="${p.id}" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('[data-action="edit"]').forEach(btn=>{
    btn.addEventListener('click', ()=> openProductModal(Number(btn.dataset.id)));
  });
  tbody.querySelectorAll('[data-action="delete"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      if(confirm("Delete this product? This cannot be undone.")){
        PRODUCTS = PRODUCTS.filter(p=>p.id !== id);
        renderAdminProducts();
        renderAdminOverview();
      }
    });
  });
}

function renderAdminOrders(){
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = orders.length ? orders.slice().reverse().map(o=>`
    <tr>
      <td>#${o.id}</td>
      <td>${o.customerName}</td>
      <td>${o.date}</td>
      <td>${o.items.map(i=>`${i.name} ×${i.qty}`).join(', ')}</td>
      <td>${fmt(o.total)}</td>
      <td>
        <select class="status-select" data-id="${o.id}">
          <option ${o.status==='Pending'?'selected':''}>Pending</option>
          <option ${o.status==='Shipped'?'selected':''}>Shipped</option>
          <option ${o.status==='Delivered'?'selected':''}>Delivered</option>
        </select>
      </td>
    </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--ink-500);padding:24px;">No orders yet</td></tr>`;

  tbody.querySelectorAll('.status-select').forEach(sel=>{
    sel.addEventListener('change', ()=>{
      const order = orders.find(o=>o.id === Number(sel.dataset.id));
      order.status = sel.value;
      renderAdminOverview();
    });
  });
}

/* ---------- Product Add/Edit Modal ---------- */
const productModal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');

document.getElementById('addProductBtn').addEventListener('click', ()=> openProductModal(null));
document.getElementById('modalClose').addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);

function openProductModal(id){
  productForm.reset();
  if(id){
    const p = PRODUCTS.find(pp=>pp.id === id);
    modalTitle.textContent = "Edit Product";
    document.getElementById('pfId').value = p.id;
    document.getElementById('pfName').value = p.name;
    document.getElementById('pfCat').value = p.cat;
    document.getElementById('pfIcon').value = p.icon;
    document.getElementById('pfPrice').value = p.price;
    document.getElementById('pfUnit').value = p.unit;
    document.getElementById('pfStock').value = p.stock;
    document.getElementById('pfDesc').value = p.desc;
  } else {
    modalTitle.textContent = "Add Product";
    document.getElementById('pfId').value = "";
  }
  productModal.classList.add('open');
  modalOverlay.classList.add('open');
}

function closeProductModal(){
  productModal.classList.remove('open');
  modalOverlay.classList.remove('open');
}

productForm.addEventListener('submit', e=>{
  e.preventDefault();
  const id = document.getElementById('pfId').value;
  const data = {
    name: document.getElementById('pfName').value.trim(),
    cat: document.getElementById('pfCat').value.trim(),
    icon: document.getElementById('pfIcon').value.trim() || "💊",
    price: parseFloat(document.getElementById('pfPrice').value),
    unit: document.getElementById('pfUnit').value.trim(),
    stock: document.getElementById('pfStock').value,
    desc: document.getElementById('pfDesc').value.trim(),
  };

  if(id){
    const p = PRODUCTS.find(pp=>pp.id === Number(id));
    Object.assign(p, data);
  } else {
    PRODUCTS.push({ id: nextProductId++, ...data });
  }

  closeProductModal();
  renderAdminProducts();
  renderAdminOverview();
});