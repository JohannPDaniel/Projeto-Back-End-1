import { users } from "../scripts";

function authMiddleware(request, response, next) {
    const userId = request.headers.authorization;

    if (!userId) {
        return response.status(401).json({
            success: false,
            message: 'Não autorizado!'
        });
    }

    const userFound = users.find(user => user.id === userId);

    if (!userFound) {
        return response.status(401).json({
            success: false,
            message: 'Id não encontrado, você não está autorizado!'
        });
    }

    return next();
}

export default authMiddleware