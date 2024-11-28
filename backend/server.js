const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();  // Carregar variáveis de ambiente do arquivo .env

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));

// Rota de registro de usuário
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
    });

    try {
        await user.save();
        res.status(201).send('Usuário registrado');
    } catch (err) {
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
});

// Rota de login de usuário (retorna um token)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware de autenticação
function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// CRUD de produtos

// Criar um produto
app.post('/api/products', authenticate, async (req, res) => {
    const { name, price } = req.body;

    const product = new Product({
        name,
        price,
        userId: req.userId,
    });

    try {
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao adicionar o produto' });
    }
});

// Listar todos os produtos
app.get('/api/products', authenticate, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar os produtos' });
    }
});

// Editar produto
app.put('/api/products/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Não autorizado a editar este produto' });
        }

        product.name = name || product.name;
        product.price = price || product.price;

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao editar o produto' });
    }
});

// Excluir produto
app.delete('/api/products/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Não autorizado a excluir este produto' });
        }

        await product.remove();
        res.json({ message: 'Produto excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir o produto' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
