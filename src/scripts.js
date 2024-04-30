import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import validarUsuario from "./Middleware/validarUsuario.js";

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;
// ------------------------------------------------------------------

/*
    Faça as configurações iniciais do express ;
    Crie um recurso com a seguinte rota ' / '
    Em caso de sucesso, retorna um status 200
    Com a seguinte mensagem ('Bem vindo à aplicação')
*/

// ------------- Iniciando aplicação -------------------

let listaMensagem = []
let idAutomatico = 1

let users = []
let idNewUser = 1

// http://localhost:3000
app.get('/', (request, response) => {
    const { param } = request.query;

    if (param === '/') {
        return response.status(200).json({ Mensagem: "Bem-vindo à aplicação" });
    } else if (param === undefined) {
        return response.status(400).json({ Mensagem: "Parâmetro ausente" });
    } else {
        return response.status(400).json({ Mensagem: "Parâmetro inválido" });
    }
});

/*
    - Sign Up - Criar pessoa usuária
    - Cada pessoa usuário deve ser um newUser

    /*  Name, email, password devem ser 
        inseridos pela pessoa usuária  e todos 
        esses itens precisam ser validados .
    /*
    - Caso não passe um desses itens, informe um status (400) .

*/
// ------------------ Criar pessoa usuária -----------------
// http://localhost:3000/signup

// app.post('/signup', validarUsuario, async (request, response) => {
//     const data = request.body; 
//     const { name } = data; 

//     if (!name || name.trim() === '') {
//         return response.status(400).json({
//             Mensagem: 'Por favor, insira um nome válido'
//         });
//     }

//     console.log('Buscando e-mail:', data.email); 

//     console.log('Lista de usuários:', users); 
//     const admin = users.find(user => user.email === data.email);

//     if (admin) {
//         console.log('Admin não encontrado para e-mail:', data.email); 
//         return response.status(400).json({ 
//             Mensagem: 'E-mail não encontrado no sistema, verifique ou crie uma conta' 
//         });
//     }

//     const senhaCriptografada = await bcrypt.hash(data.password, 10);

//     const newUser = {
//         id: idNewUser,
//         name,
//         email: data.email,
//         password: senhaCriptografada
//     };

//     users.push(newUser);

//     idNewUser++; 

//     return response.status(201).json({ 
//         Mensagem: `Usuário com e-mail ${newUser.email} cadastrado com sucesso!`
//     });
// });

app.post('/signup', validarUsuario, async (request, response) => {
    const data = request.body; 
    const { name } = data; 
    if (!name || name.trim() === '') {
        return response.status(400).json({
            Mensagem: 'Por favor, insira um nome válido'
        });
    }

    const existingUser = users.find(user => user.email === data.email);

    if (!existingUser) {
        return response.status(400).json({ 
            Mensagem: 'Um usuário com este e-mail já existe no sistema' 
        });
    }

    const senhaCriptografada = await bcrypt.hash(data.password, 10);

    const newUser = {
        id: idNewUser,
        name,
        email: data.email,
        password: senhaCriptografada,
    };

    users.push(newUser);

    idNewUser++; 

    return response.status(201).json({ 
        Mensagem: `Usuário com e-mail ${newUser.email} cadastrado com sucesso!`
    });
});


// ------------------ login --------------------
// http://localhost:3000/login

app.post('/login', validarUsuario, async (request, response) => {
    const data = request.body
    
    const admin = users.find(user => user.email === data.email);

    if (admin) {
        return response.status(400).json({ 
            mensagem: ' Email não encontrado no sistema, verifique ou crie uma conta' 
        });
    }
    
    const senhaMatches = await bcrypt.compare(data.password, admin.password);

    if (!senhaMatches) {
        return response.status(400).json({ mensagem: 'Senha incorreta ou credencial inválida' });
    }

    return response.status(200).json({
        mensagem: `Seja bem-vinda(o) ${admin.name}! Pessoa usuária logada com sucesso!`,
    });
});

// --------------- Criar Mensagem -----------------
// http://localhost:3000/message
app.post('/message', (request,response) => {

    const { email } = request.query;

    if (!email || email.trim() === "") {
        return response.status(400).json({
            Mensagem: "Favor enviar um e-mail válido"
        })
    }

    const data = request.body
    const { title, description } = data

    if (!title || title.trim() === "") {
        return response.status(400).json({
            Mensagem: "Favor enviar um titulo válido"
        })
    }

    if (!description || description.trim() === "") {
        return response.status(400).json({
            Mensagem: "Favor enviar uma descrição válida"
        })
    }

    const validarEmail = users.find(msg => msg.email === email)

    if (!validarEmail) {
        return response.status(404).json({
            Mensagem: "Email não encontrado, verifique ou crie uma conta"
        })
    }

    let newMessage = {
        id:idAutomatico,
        title,
        description,
        email
    }
    
    listaMensagem.push(newMessage)
    idAutomatico++

    return response.status(201).json({
        Mensagem: `Mensagem criada com sucesso`,
        newMessage
    })
})

// ---------- ler mensagem ----------------
// http://localhost:3000/message/:email
app.get('/message/:email', (request,response) => {
    const { email } = request.params

    if (!email) {
        return response.status(400).json({
            Mensagem: "Favor passar um email válido"
        })
    }

    const procurarEmail = users.find(msg => msg.email === email)

    if (!procurarEmail) {
        return response.status(404).json({
            Mensagem: "Email não encontrado, verifique ou crie uma conta "
        })
    }

    return response.status(200).json({
        Mensagem: "Seja bem-vindo!",
        listaMensagem
    })
})

// ----------- atualizar mensagem -----------
// http://localhost:3000/message/:id
app.put('/message/:id', (request,response) => {
    const id = Number(request.params.id)

    const data = request.body
    const { title, description } = data

    if (!id || isNaN(id)) {
        return response.status(400).json({
            Mensagem: " Por favor, informe um id válido da mensagem"
        })
    }

    const validarId = listaMensagem.findIndex(mensagem => mensagem.id === id)

    if (!title || title.trim() === '') {
        return response.status(400).json({
            Mensagem: "Favor enviar um titulo atualizado válido"
        })
    }

    if (!description || description.trim() === '') {
        return response.status(400).json({
            Mensagem: "Favor enviar uma descrição atualizada válida"
        })
    }

    if (validarId === -1) {
        return response.status(404).json({
            Mensagem: "Mensagem não encontrada"
        });
    }

    const mensagemAtualizada = listaMensagem[validarId];
    mensagemAtualizada.title = title;
    mensagemAtualizada.description = description;

    return response.status(200).json({
        Mensagem: "Mensagem atualizada com sucesso!",
        mensagemAtualizada
    });
});

//----------- deletar mensagem --------------
// http://localhost:3000/message/:id
app.delete('/message/:id', (request,response) => {
    const id = Number(request.params.id)

    if (!id || isNaN(id)) {
        return response.status(400).json({
            Mensagem: "Favor enviar um id válido"
        })
    }

    const procurarId = listaMensagem.findIndex(msg => msg.id === id)

    if (procurarId === -1) {
        return response.status(404).json({
            Mensagem: "Mensagem não encontrada, verifique o identificador em nosso banco" });
    } else {
        listaMensagem.splice(procurarId, 1);
        return response.status(200).json({ Mensagem: "Mensagem apagada com sucesso." });
    }
})



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))