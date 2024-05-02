function validarMensagem(request, response, next) {
    
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


    return next();
}

export default validarMensagem