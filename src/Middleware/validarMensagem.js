function validarMensagem(request, response, next) {
    
    const data = request.body
    const { title, description } = data

    if (!title || title.trim() === "") {
        return response.status(400).json({
            success: false,
            message: "Favor enviar um titulo válido"
        })
    }

    if (!description || description.trim() === "") {
        return response.status(400).json({
            success: false,
            message: "Favor enviar uma descrição válida"
        })
    }


    return next();
}

export default validarMensagem