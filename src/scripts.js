import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import validarUsuario from "./Middleware/validarUsuario.js";
import validarMensagem from "./Middleware/validarMensagem.js";

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;

// ------------- Iniciando aplicação -------------------

let message = []
let idAutomatico = 1

let users = []
let idNewUser = 1

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

    const { name } = data

    if (!name || name.trim() === '') {
        return response.status(400).json({
            success: false,
            message: 'Por favor, verifique se passou o nome'
        });
    }

    const admin = users.find(user => user.email === data.email);
   
    if (admin) {
        return response.status(400).json({
            success: false, 
            message: 'Email já cadastrado, insira outro' 
        });
    }

    const passwordEncrypted = await bcrypt.hash(data.password, 10);

    const newUser = {
        id: idNewUser,
        name,
        email: data.email,
        password: passwordEncrypted
    };

    users.push(newUser);

    idNewUser++; 

    return response.status(201).json({ 
        success: true,
        message: `Usuário com e-mail ${newUser.email} cadastrado com sucesso!`,
        data: newUser
    });
});

// ------------------ login --------------------
// http://localhost:3000/login

app.post('/login', validarUsuario, async (request, response) => {
    const data = request.body;
    
    const admin = users.find(user => user.email === data.email);

    if (!admin) {
        return response.status(400).json({ 
            success: false,
            message: 'Email não encontrado no sistema, verifique ou crie uma conta' 
        });
    }
    
    const comparePasswords = await bcrypt.compare(data.password, admin.password);

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
        message: `Seja bem-vinda(o) ${admin.name}! Pessoa usuária logada com sucesso!`,
        data: user
    });
});

// --------------- Criar recado -----------------
// http://localhost:3000/message/:email
app.post('/message/:email', validarMensagem, (request,response) => {

    const data = request.body
    
    const { email } = request.params;

    if (!email || email.trim() === "") {
        return response.status(400).json({
            success: false,
            message: "Favor enviar um e-mail válido"
        })
    }

    const validateEmail = users.find(msg => msg.email === email)

    if (!validateEmail) {
        return response.status(404).json({
            success: false, 
            message: "Email não encontrado, verifique ou crie uma conta"
        })
    }

    let newmessage = {
        id:idAutomatico,
        title: data.title,
        description: data.description,
    }
    
    message.push(newmessage)
    idAutomatico++

    return response.status(201).json({
        success: true,
        message: `Mensagem criada com sucesso`,
        data: newmessage
    })
})

// ---------- ler recado ----------------
// http://localhost:3000/message/:email
app.get('/message/:email', (request,response) => {
    const { email } = request.params

    if (!email) {
        return response.status(400).json({
            success: false,
            message: "Favor passar um email válido"
        })
    }

    const searchEmail = users.find(msg => msg.email === email)

    if (!searchEmail) {
        return response.status(404).json({
            success: false,
            message: "Email não encontrado, verifique ou crie uma conta "
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
// http://localhost:3000/messages/:email
app.get('/messages/:email', (request,response) => {
    const { email } = request.params;
    const { page = 1, limit = 10 } = request.query; 

    if (!email) {
        return response.status(400).json({
            success: false,
            message: "Favor passar um email válido"
        })
    }

    const searchEmail = users.find(user => user.email === email);

    if (!searchEmail) {
        return response.status(404).json({
            success: false,
            message: "Email não encontrado, verifique ou crie uma conta"
        })
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedMessages = message.slice(startIndex, endIndex);

    return response.status(200).json({
        success: true,
        message: "Recados recuperados com sucesso!",
        data: paginatedMessages,
        currentPage: page,
        totalPages: Math.ceil(message.length / limit)
    });
});

// ----------- atualizar mensagem -----------
// http://localhost:3000/message/:id
app.put('/message/:id', validarMensagem, (request,response) => {
    
    const id = Number(request.params.id)

    const data = request.body

    if (!id || isNaN(id)) {
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
    const id = Number(request.params.id)

    if (!id || isNaN(id)) {
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
