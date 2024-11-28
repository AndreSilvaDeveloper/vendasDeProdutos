const apiUrl = 'http://localhost:3000/api/products';

// Função para carregar produtos da API e exibir na lista
function loadProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';  // Limpa a lista

            products.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.name} - R$ ${product.price}`;
                productList.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err);
        });
}

// Função para adicionar um novo produto
document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);

    const newProduct = {
        id: Date.now(),  // Gerando um ID único baseado no timestamp
        name: name,
        price: price
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(product => {
        loadProducts();  // Recarrega a lista de produtos
        document.getElementById('product-name').value = '';  // Limpa o campo
        document.getElementById('product-price').value = '';  // Limpa o campo
    })
    .catch(err => {
        console.error('Erro ao adicionar produto:', err);
    });
});

// Carrega os produtos ao iniciar
loadProducts();
