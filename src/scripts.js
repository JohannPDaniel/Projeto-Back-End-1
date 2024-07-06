import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import validarUsuario from "./Middleware/validarUsuario.js";
import validarMensagem from "./Middleware/validarMensagem.js";
import authMiddleware from "./Middleware/authMiddleware.js"

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

// ------------- Iniciando aplicação -------------------

let message = []

export let users = []

// http://localhost:3000
app.get('/', (request, response) => {
    return response.status(200).json({ 
        success: true,
        message: "Bem vindo à aplicação"
    })
});

// ------------------ Criar pessoa usuária -----------------
// http://localhost:3000/signup

app.post('/signup', validarUsuario, async (request, response) => {
    const data = request.body;
    const { name, email, password } = data;

    if (!name || name.trim() === '') {
        return response.status(400).json({
            success: false,
            message: 'Por favor, verifique se passou o nome corretamente !!!'
        });
    }

    const admin = users.find(user => user.email === email);

    if (admin) {
        return response.status(400).json({
            success: false,
            message: 'Email já cadastrado em nosso banco de dados'
        });
    }

    const passwordEncrypted = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password: passwordEncrypted
    };

    const newUser2 = {
        id: newUser.id,
        name,
        email
    };

    users.push(newUser);
    console.log(users);
    return response.status(201).json({
        success: true,
        message: `Usuário com e-mail ${newUser.email} cadastrado com sucesso!`,
        data: newUser2
    });
});

// ------------------ login --------------------
// http://localhost:3000/login

app.post('/login', validarUsuario, async (request, response) => {
    const data = request.body;
    const { email, password } = data;

    const admin = users.find(user => user.email === email);

    if (!admin) {
        return response.status(400).json({
            success: false,
            message: 'Email não encontrado no sistema, verifique ou crie uma conta'
        });
    }

    const comparePasswords = await bcrypt.compare(password, admin.password);

    if (!comparePasswords) {
        return response.status(400).json({
            success: false,
            message: 'Senha incorreta ou credencial inválida'
        });
    }

    const user = {
        id: admin.id,
        name: admin.name,
        email: admin.email
    };

    return response.status(200).json({
        success: true,
        message: `Seja bem-vinda(o) ${admin.name}, Pessoa usuária logada com sucesso!`,
        data: user
    });
});

// --------------- Criar recado -----------------
// http://localhost:3000/message/:email
app.post('/message/:email', authMiddleware, validarMensagem, (request, response) => {
    const userId = request.headers.authorization; 
    const data = request.body;
    const { email } = request.params;

    if (!email || email.trim() === '') {
        return response.status(400).json({
            success: false,
            message: 'Favor enviar um email válido!'
        });
    }

    const emailFound = users.find(address => address.email === email);

    if (!emailFound) {
        return response.status(400).json({
            success: false,
            message: 'Email não encontrado no sistema!'
        });
    }

    const newMessage = {
        id: uuidv4(),
        userId: userId,  // Ensure correct naming here
        title: data.title,
        description: data.description
    };

    message.push(newMessage); 

    return response.status(201).json({
        success: true,
        message: 'Mensagem criada com sucesso',
        data: newMessage
    });
});

// ---------- ler recado ----------------
// http://localhost:3000/message/:email
app.get('/message/:email', authMiddleware, (request,response) => {

    const { email } = request.params

    if (!email || email.trim() === '') {
        return response.status(400).json({
            success: false,
            message: "Favor passar um email válido"
        })
    }

    const searchEmail = users.find(msg => msg.email === email)

    if (!searchEmail) {
        return response.status(404).json({
            success: false,
            message: "Email não encontrado, verifique ou crie uma conta"
        })
    }

    return response.status(200).json({
        success: true,
        message: "Seja bem-vindo!",
        data: message
    })
})

// ---------- ler recados com paginação ----------------
//
// http://localhost:3000/message?page=1&limit=5
app.get('/message', authMiddleware, (request, response) => {
    const userId = request.headers.authorization;
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 5;

    // Filtrando as mensagens por userId
    const recadosFound = message.filter(msg => msg.userId === userId);

    // Calculando índices de paginação
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Paginação
    const recadosPaginacao = recadosFound.slice(startIndex, endIndex);

    const totalPages = Math.ceil(recadosFound.length / limit);

    return response.status(200).json({
        success: true,
        message: 'Recados buscado com sucesso',
        data: {
            recados: recadosPaginacao,
            total: recadosFound.length,
            totalPages: totalPages,
        }
    });
});


// ----------- atualizar mensagem -----------
// http://localhost:3000/message/:id
app.put('/message/:id', validarMensagem, (request,response) => {
    const id = request.params.id

    const data = request.body

    if (!id) {
        return response.status(400).json({
            success: false,
            message: "Por favor, informe um id válido da mensagem"
        })
    }

    const validateId = message.findIndex(mensagem => mensagem.id === id)

    if (validateId === -1) {
        return response.status(404).json({
            success: false,
            message: "Mensagem não encontrada"
        });
    }

    const messageUpdated = message[validateId];
    messageUpdated.title = data.title;
    messageUpdated.description = data.description;

    return response.status(200).json({
        success: true,
        message: "Mensagem atualizada com sucesso!",
        data: messageUpdated
    });
});

//----------- deletar mensagem --------------
// http://localhost:3000/message/:id
app.delete('/message/:id', (request,response) => {
    const id = request.params.id

    if (!id) {
        return response.status(400).json({
            success: false,
            message: "Favor enviar um id válido"
        })
    }

    const searchId = message.findIndex(msg => msg.id === id)

    if (searchId === -1) {
        return response.status(404).json({
            success: false,
            message: "Mensagem não encontrada, verifique o identificador em nosso banco" 
        });
    } else {
        message.splice(searchId, 1);
        return response.status(200).json({ 
            success: true,
            message: "Mensagem apagada com sucesso." 
        });
    }
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
