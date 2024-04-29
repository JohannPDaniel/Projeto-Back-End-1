import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"

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
let idAdmin = 1

// http://localhost:8080
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
// http://localhost:8080/signup

app.post('/signup', async (request,response) => {
    const { name, email, password } = request.body

    if (!name || name.trim() === "") {
        return response.status(400).json({ Mensagem: "Por favor, verifique se passou o nome " })
    }

    if (!email || email.trim() === "") {
        return response.status(400).json({ Mensagem: "Por favor, verifique se passou o email" })
    }

    const verificarEmail = users.find((admin)=> admin.email === email)

    if(verificarEmail){
        return response.status(400).json({ Mensagem: "Email já cadastrado, insira outro" })
    }

    if (!password || isNaN(password)) {
        return response.status(400).json({ Mensagem: "Por favor, verifique se passou a senha " })
    }

    const senhaCriptografada = await bcrypt.hash(password,10)

    let newUser = {
        id : idAdmin,
        name: name,
        email : email, 
        password : senhaCriptografada
    }
    
    users.push(newUser)
  
    idAdmin++
  
        return response.status(201).json({ 
            Mensagem: `Pessoa administradora do email ${email}, cadastrada com sucesso!`,
        })
})

// ------------------ login --------------------
// http://localhost:8080/login

app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email || email.trim() === '') {
        return response.status(400).json({ mensagem: 'Insira um e-mail válido' });
    }

    if (!password || isNaN(password)) {
        return response.status(400).json({ mensagem: 'Insira uma senha válida' });
    }
    const admin = users.find(admin => admin.email === email);

    if (!admin) {
        return response.status(404).json({ 
            mensagem: ' Email não encontrado no sistema, verifique ou crie uma conta' 
        });
    }
    
    const senhaMatches = await bcrypt.compare(password, admin.password);

    if (!senhaMatches) {
        return response.status(401).json({ mensagem: 'Senha incorreta ou credencial inválida' });
    }

    return response.status(200).json({
        mensagem: `Seja bem-vinda(o) ${admin.name}! Pessoa usuária logada com sucesso!`,
    });
});

/*
    
*/
// http://localhost:8080/message
app.post('/message', (request,response) => {
    const data = request.body
    const { title, descrition } = data

    if (!title || title.trim() === "") {
        return response.status(400).json({
            Mensagem: "Favor enviar um titulo válido"
        })
    }

    if (!descrition || descrition.trim() === "") {
        return response.status(400).json({
            Mensagem: "Favor enviar uma descrição válida"
        })
    }

    let newMessage = {
        id:idAutomatico,
        title,
        descrition
    }

    users.push(newMessage)

    idAutomatico++

    return response.status(201).json({
        Mensagem: `Mensagem criada com sucesso`,
        newMessage
    })
})



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))