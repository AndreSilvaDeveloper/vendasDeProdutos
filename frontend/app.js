const apiUrl = 'http://localhost:3000/api/products';
let authToken = '';

// Função para carregar produtos
function loadProducts() {
    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    })
    .then(response => response.json())
    .then(products => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; 

        products.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - R$ ${product.price}`;
            productList.appendChild(li);
        });
    })
    .catch(err => console.error('Erro ao carregar produtos:', err));
}

// Função para login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            authToken = data.token;
            loadProducts(); // Carregar produtos
        }
    })
    .catch(err => console.error('Erro no login:', err));
});

// Função para registrar
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(() => alert('Usuário registrado com sucesso!'))
    .catch(err => console.error('Erro no registro:', err));
});
