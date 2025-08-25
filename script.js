/* AgriChick - frontend-only demo
   - Replace images in /img/
   - Replace WA_NUMBER with your real phone for WhatsApp orders
*/

// ====== Config / Demo Data ======
const WA_NUMBER = "2348012345678"; // <-- replace with your real number (234 format) for actual WhatsApp links

// Product data organized by category -> brand list
const productsData = {
  broilers: [
    { id: "b-a1", name: "Agrited Broiler", brand: "Agrited", price: 300, qty: 120, img: "img/agrited-broiler.png" },
    { id: "b-c1", name: "Chikun Broiler", brand: "Chikun", price: 320, qty: 80, img: "img/chikun-broiler.png" },
    { id: "b-v1", name: "Vertex Broiler", brand: "Vertex", price: 340, qty: 50, img: "img/vertex-broiler.png" },
  ],
  noilers: [
    { id: "n-a1", name: "Agrited Noiler", brand: "Agrited", price: 220, qty: 200, img: "img/agrited-noiler.png" },
    { id: "n-c1", name: "Chikun Noiler", brand: "Chikun", price: 240, qty: 140, img: "img/chikun-noiler.png" },
    { id: "n-v1", name: "Vertex Noiler", brand: "Vertex", price: 260, qty: 90, img: "img/vertex-noiler.png" },
  ],
  turkey: [
    { id: "t-a1", name: "Agrited Turkey", brand: "Agrited", price: 1200, qty: 40, img: "img/agrited-turkey.png" },
    { id: "t-c1", name: "Chikun Turkey", brand: "Chikun", price: 1300, qty: 25, img: "img/chikun-turkey.png" },
    { id: "t-v1", name: "Vertex Turkey", brand: "Vertex", price: 1450, qty: 10, img: "img/vertex-turkey.png" },
  ]
};

// ====== Helpers ======
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ====== Render Products ======
function renderProducts(category) {
  const container = $('#products');
  container.innerHTML = '';
  const list = productsData[category] || [];
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" onerror="this.src='img/product-placeholder.png'">
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>${p.brand}</p>
      </div>
      <div class="product-meta">
        <div class="meta-price">₦${formatNumber(p.price)}</div>
        <div class="meta-qty">${p.qty} pcs</div>
        <div style="margin-top:8px"><button class="btn small select-btn" data-id="${p.id}" data-cat="${category}">Select</button></div>
      </div>
    `;
    container.appendChild(card);
  });

  // attach listeners for select buttons
  $$('.select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cat = btn.dataset.cat;
      const product = findProductById(cat, id);
      if (product) selectProduct(product, cat);
    });
  });
}

// find product
function findProductById(cat, id){
  return (productsData[cat] || []).find(p => p.id === id);
}

function formatNumber(n){ return Number(n).toLocaleString(); }

// ====== Category buttons ======
$$('.cat-btn').forEach(b => {
  b.addEventListener('click', () => {
    $$('.cat-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const cat = b.dataset.cat;
    renderProducts(cat);
    populateCategorySelector(cat);
  });
});

// populate dropdown selectors (category + product)
function populateCategorySelects() {
  const catSelect = $('#categorySelect');
  catSelect.innerHTML = '';
  Object.keys(productsData).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = capitalize(cat);
    catSelect.appendChild(opt);
  });
  // populate product select for first category
  populateProductSelect(Object.keys(productsData)[0]);
}

function populateProductSelect(cat) {
  const sel = $('#productSelect');
  sel.innerHTML = '';
  (productsData[cat] || []).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} — ₦${formatNumber(p.price)} (${p.qty})`;
    sel.appendChild(opt);
  });
}

function populateCategorySelector(activeCat) {
  const catSelect = $('#categorySelect');
  if (activeCat) catSelect.value = activeCat;
  populateProductSelect(catSelect.value);
}

// capitalize
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ====== Product Selection (auto-fill) ======
function selectProduct(product, category) {
  // fill dropdowns
  $('#categorySelect').value = category;
  populateProductSelect(category);
  $('#productSelect').value = product.id;

  // autofill order form fields
  $('#orderPrice').value = product.price;
  $('#orderQuantity').value = 1;
  // if user is logged in, prefill name & phone
  const cur = getCurrentUser();
  if (cur) {
    $('#custName').value = cur.name;
    $('#custPhone').value = cur.phone;
  }

  // scroll to booking
  document.querySelector('#booking').scrollIntoView({behavior:'smooth'});
  $('#orderMessage').textContent = `Selected: ${product.name} — ₦${formatNumber(product.price)} (${product.qty} available)`;
}

// when dropdown selection changes, update price and qty
$('#categorySelect')?.addEventListener('change', function(){
  populateProductSelect(this.value);
  const firstProduct = productsData[this.value][0];
  $('#productSelect').value = firstProduct.id;
  $('#orderPrice').value = firstProduct.price;
});

$('#productSelect')?.addEventListener('change', function(){
  const cat = $('#categorySelect').value;
  const p = findProductById(cat, this.value);
  if (p) {
    $('#orderPrice').value = p.price;
    $('#orderQuantity').value = 1;
    $('#orderMessage').textContent = `Selected: ${p.name} — ₦${formatNumber(p.price)} (${p.qty} available)`;
  }
});

// ====== Signup / Login (localStorage) ======
function saveUser(user){
  const users = JSON.parse(localStorage.getItem('agrichick_users') || "[]");
  users.push(user);
  localStorage.setItem('agrichick_users', JSON.stringify(users));
  localStorage.setItem('agrichick_current', JSON.stringify(user));
}

function findUserByPhone(phone) {
  const users = JSON.parse(localStorage.getItem('agrichick_users') || "[]");
  return users.find(u => u.phone === phone);
}

function setCurrentUser(user){
  localStorage.setItem('agrichick_current', JSON.stringify(user));
  updateHeaderForUser();
}

function getCurrentUser(){
  return JSON.parse(localStorage.getItem('agrichick_current') || "null");
}

function updateHeaderForUser(){
  const cur = getCurrentUser();
  if (cur) {
    $('.brand').innerHTML = `🐣 <strong>AgriChick</strong> — Hi, ${cur.name.split(' ')[0]}`;
    $('#openLoginBtn').style.display = 'none';
    $('#openSignupBtn').textContent = 'Logout';
    $('#openSignupBtn').onclick = () => doLogout();
  } else {
    $('.brand').innerHTML = `🐣 <strong>AgriChick</strong>`;
    $('#openLoginBtn').style.display = '';
    $('#openSignupBtn').textContent = 'Sign up';
    $('#openSignupBtn').onclick = () => showModal('#signupModal');
    $('#openLoginBtn').onclick = () => showModal('#loginModal');
  }
}

function doLogout(){
  localStorage.removeItem('agrichick_current');
  updateHeaderForUser();
}

// Signup submit
$('#signupForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const name = $('#signupName').value.trim();
  const phone = $('#signupPhone').value.trim();
  const pw = $('#signupPassword').value.trim();
  if(!name || !phone || !pw) return alert('Please fill all fields');

  if (findUserByPhone(phone)) return alert('Phone already registered. Please login.');

  const user = { name, phone, password: pw };
  saveUser(user);
  setCurrentUser(user);
  closeModal('#signupModal');
  alert('Account created and logged in!');
});

// Login submit
$('#loginForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const phone = $('#loginPhone').value.trim();
  const pw = $('#loginPassword').value.trim();
  const user = findUserByPhone(phone);
  if (!user || user.password !== pw) return alert('Invalid phone or password');
  setCurrentUser(user);
  closeModal('#loginModal');
  alert('Logged in successfully!');
});

// ====== Order Form Submission & WhatsApp ======
$('#orderForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const cat = $('#categorySelect').value;
  const pId = $('#productSelect').value;
  const product = findProductById(cat, pId);
  if (!product) return alert('Select a product');

  const qty = Number($('#orderQuantity').value) || 1;
  if (qty > product.qty) {
    return alert(`Sorry, only ${product.qty} available for ${product.name}`);
  }

  const name = $('#custName').value.trim();
  const phone = $('#custPhone').value.trim();
  const note = $('#orderNote').value.trim();
  if (!name || !phone) return alert('Please provide name and phone');

  // Build order message
  const total = product.price * qty;
  const message = `Hello AgriChick, I want to order:
- Product: ${product.name}
- Brand: ${product.brand}
- Quantity: ${qty}
- Unit price: ₦${formatNumber(product.price)}
- Total: ₦${formatNumber(total)}
Customer: ${name}
Phone: ${phone}
Note: ${note || '—'}`;

  // Save (for demo) and open WhatsApp
  // For demo, we show preview modal first
  $('#previewContent').innerText = message;
  showModal('#confirmModal');

  // clicking send will open WA (attached below)
});

// When user clicks "Send via WhatsApp" in preview
$('#sendWhatsApp')?.addEventListener('click', function(){
  const cat = $('#categorySelect').value;
  const pId = $('#productSelect').value;
  const product = findProductById(cat, pId);
  const qty = Number($('#orderQuantity').value) || 1;
  const name = $('#custName').value.trim();
  const phone = $('#custPhone').value.trim();
  const note = $('#orderNote').value.trim();
  const total = product.price * qty;

  const message = encodeURIComponent(`Hello AgriChick, I want to order:
- Product: ${product.name}
- Brand: ${product.brand}
- Quantity: ${qty}
- Unit price: ₦${product.price}
- Total: ₦${total}
Customer: ${name}
Phone: ${phone}
Note: ${note || '—'}`);

  // WhatsApp link with number in international format (no +)
  const url = `https://wa.me/${WA_NUMBER}?text=${message}`;
  window.open(url, '_blank');

  // Optionally: reduce stock in demo
  product.qty = Math.max(0, product.qty - qty);
  // re-render to show updated qty
  const currentCat = $$('.cat-btn').find(b=>b.classList.contains('active')).dataset.cat;
  renderProducts(currentCat);
  closeModal('#confirmModal');
  $('#orderMessage').textContent = 'Order sent to WhatsApp. You can track in WhatsApp.';
});

// Preview button (just show preview modal)
$('#previewBtn')?.addEventListener('click', function(){
  // reuse submit logic but just prepare preview
  const cat = $('#categorySelect').value;
  const pId = $('#productSelect').value;
  const product = findProductById(cat, pId);
  if (!product) return alert('Select a product');
  const qty = Number($('#orderQuantity').value) || 1;
  const name = $('#custName').value.trim();
  const phone = $('#custPhone').value.trim();
  if (!name || !phone) return alert('Please enter name and phone');
  const total = product.price * qty;
  const message = `Product: ${product.name}\nQty: ${qty}\nUnit: ₦${product.price}\nTotal: ₦${formatNumber(total)}\nCustomer: ${name}\nPhone: ${phone}\nNote: ${$('#orderNote').value || '—'}`;
  $('#previewContent').innerText = message;
  showModal('#confirmModal');
});

// ====== Modal helpers ======
function showModal(selector){
  const el = (typeof selector === 'string') ? document.querySelector(selector) : selector;
  if (el) el.style.display = 'flex';
}
function closeModal(selector){
  const el = (typeof selector === 'string') ? document.querySelector(selector) : selector;
  if (el) el.style.display = 'none';
}
$$('.modal-close').forEach(b => b.addEventListener('click', (e) => {
  const modal = e.target.closest('.modal');
  if (modal) modal.style.display = 'none';
}));
$$('.modal').forEach(m => {
  m.addEventListener('click', (e) => {
    if (e.target === m) m.style.display = 'none';
  });
});

// ====== Init ======
(function init(){
  // render initial category (broilers)
  renderProducts('broilers');

  // populate selectors
  populateCategorySelects();
  populateCategorySelector('broilers');

  // wire up header buttons
  $('#openSignupBtn').addEventListener('click', () => showModal('#signupModal'));
  $('#openLoginBtn').addEventListener('click', () => showModal('#loginModal'));
  $('#jumpSignup').addEventListener('click', () => { closeModal('#loginModal'); showModal('#signupModal'); });

  updateHeaderForUser();

  // Pre-fill name/phone if logged in
  const cur = getCurrentUser();
  if (cur) {
    $('#custName').value = cur.name;
    $('#custPhone').value = cur.phone;
  }
})();