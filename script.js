
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});


document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    mobileMenu.classList.remove('show');
  }
});

// ===== LOGIN SETUP =====
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
let currentUser = null;

  function showLogin() {
    loginSection.style.display = 'flex';
    mainContent.style.display = 'none';
  }
  
  function showLoginForm() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('formTitle').textContent = 'Login';
}
  
    function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'flex';
  document.getElementById('formTitle').textContent = 'Sign Up';
}
  

function login() {
  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;

  const userData = localStorage.getItem(phone);
  if (!userData) {
    alert('No account found. Please sign up.');
    return;
  }

  const user = JSON.parse(userData);
  if (user.password !== password) {
    alert('Incorrect password!');
    return;
  }

  currentUser = phone;
  alert(`Welcome ${user.name}! You can now book poultry birds.`);
  loginSection.style.display = 'none';
  mainContent.style.display = 'block';
  displayBookings();
}

function logout() {
  currentUser = null;
  showLogin();
}

// ===== SIGN UP FUNCTION =====
function signUp() {
  
  
  const name = document.getElementById('signupName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (!name || !phone || !password || !confirm) {
    alert('Please fill all fields.');
    return;
  }

  if (password !== confirm) {
    alert('Passwords do not match!');
    return;
  }

  if (localStorage.getItem(phone)) {
    alert('User already exists. Please login.');
    return;
  }

  const user = { name, phone, password };
  localStorage.setItem(phone, JSON.stringify(user));
  alert('Account created successfully! You can now login.');
  document.getElementById('loginPhone').value = phone;
  document.getElementById('loginPassword').value = '';
  showLoginForm();
}

// ===== SELECT PRODUCT FROM CARD =====
const productSelect = document.getElementById('product');
const selectButtons = document.querySelectorAll('.select-product');

selectButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const product = card.dataset.product;
    productSelect.value = product;
    document.getElementById('booking').scrollIntoView({behavior: 'smooth'});
  });
});

// ===== BOOKING SETUP =====
const bookingForm = document.getElementById('bookingForm');
const bookingsList = document.getElementById('bookingsList');
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

function displayBookings() {
  const userBookings = bookings.filter(b => b.phone === currentUser);
  bookingsList.innerHTML = userBookings.length 
    ? userBookings.map((b, i) => `<li>${i+1}. ${b.quantity} x ${b.product} - ${b.name} (${b.phone})</li>`).join('')
    : '<li>No bookings yet...</li>';
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert('Please login first!');
    showLogin();
    return;
  }

  const newBooking = {
    product: productSelect.value,
    quantity: document.getElementById('quantity').value,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value
  };

  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  bookingForm.reset();
  alert('Booking successful!');
  displayBookings();
});

// ===== INITIAL STATE =====
document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    showLogin();
  } else {
    mainContent.style.display = 'block';
  }
});

       // function showLogin() {
//  document.getElementById('loginModal').style.display = 'flex';
//}

function closeLogin() {
  alert('Account Created! You can now book poultry birds.');
  document.getElementById('loginModal').style.display = 'none';
}



    
