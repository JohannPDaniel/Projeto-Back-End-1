# Projeto-Back-End-1

Este projeto é uma aplicação de servidor web construída com o Node.js e o Express.js. Ele fornece uma plataforma de mensagens onde os usuários podem se cadastrar, fazer login, criar, ler, atualizar e deletar mensagens. Aqui estão os principais recursos:

Início da Aplicação: A aplicação é iniciada na porta 3000 e utiliza o middleware CORS para permitir solicitações de diferentes origens.

Cadastro de Usuário: Os usuários podem se cadastrar fornecendo um nome, e-mail e senha. A senha é criptografada antes de ser armazenada para garantir a segurança dos dados do usuário.

<img src="./images/image.png" alt="cadastro">

Login do Usuário: Os usuários podem fazer login usando seu e-mail e senha. A senha fornecida é comparada com a senha criptografada armazenada para autenticar o usuário.

<img src="./images/image-1.png" alt="login">

Criação de Mensagens: Os usuários autenticados podem criar mensagens. Cada mensagem tem um título e uma descrição.

<img src="./images/image-2.png" alt="criar mensagem">

Leitura de Mensagens: As mensagens podem ser lidas fornecendo o e-mail do usuário. Isso retorna todas as mensagens criadas por esse usuário.

<img src="./images/image-4.png" alt="ler mensagem">

Atualização de Mensagens: As mensagens podem ser atualizadas fornecendo o ID da mensagem e os novos dados da mensagem.

<img src="./images/image-5.png" alt="Atualizar mensagem">

Deleção de Mensagens: As mensagens podem ser deletadas fornecendo o ID da mensagem.

<img src="./images/image-6.png" alt="deletar mensagem">

Este projeto utiliza validações de middleware personalizadas para garantir que os dados fornecidos pelos usuários atendam aos requisitos necessários. Além disso, ele fornece respostas de erro claras quando os dados fornecidos são inválidos ou quando ocorrem erros.

Por favor, note que este é um projeto de exemplo e não possui persistência de dados, o que significa que todos os dados serão perdidos quando o servidor for reiniciado. Para um ambiente de produção, seria necessário implementar um banco de dados para armazenar os dados do usuário e das mensagens de forma segura e eficiente.

[Para acessar a documentação do projeto, clique aqui](https://documenter.getpostman.com/view/34269147/2sA3BuW8vm)

## Tecnologias usadas na API:

<div style="display: flex; gap: 10px;">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" style="width: 130px; height: 32px;" alt="JavaScript" title="JavaScript">

  <img src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" style="width: 110px; height: 32px;" alt="Node.js" title="NodeJs"/>

  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" style="width: 110px; height: 32px;" alt="Express.js" title="ExpressJs"/>

  <img src="https://img.shields.io/badge/Postman-FF6C37.svg?style=for-the-badge&logo=Postman&logoColor=white" style="width: 110px; height: 32px;" alt="Postman" title="Postman"/>

  <img src="https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" style="width: 100px; height: 32px;" alt="VS Code" title="VS Code"/>

  <img src="https://img.shields.io/badge/Git-F05032.svg?style=for-the-badge&logo=Git&logoColor=white" style="width: 70px; height: 32px;" alt="Git" title="Git"/>

  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" style="width: 95px; height: 32px;" alt="GitHub" title="GitHub"/>
</div>
