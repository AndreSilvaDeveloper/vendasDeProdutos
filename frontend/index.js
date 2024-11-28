<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Produtos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Loja de Produtos</h1>
    </header>

    <section>
        <h2>Produtos Disponíveis</h2>
        <ul id="product-list"></ul>
    </section>

    <section>
        <h2>Adicionar Produto</h2>
        <form id="product-form">
            <input type="text" id="product-name" placeholder="Nome do produto" required>
            <input type="number" id="product-price" placeholder="Preço" required>
            <button type="submit">Adicionar</button>
        </form>
    </section>

    <script src="app.js"></script>
</body>
</html>
