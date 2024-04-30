function validarUsuario(request,response,next) {
    
    const data = request.body;
    const { email, password } = data;
    
    if (!email || email.trim() === '') {
        return response.status(400).json({ Mensagem: 'Por favor, verifique se passou o email' });
    }

    if (!password || isNaN(password)) {
        return response.status(400).json({ Mensagem: 'Por favor, verifique se passou a senha' });
    }

    return next()
}

export default validarUsuario