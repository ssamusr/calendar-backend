const { response } = require('express')
const jwt = require('jsonwebtoken');

const validateJWT = async(req, resp = response, next) => {

    // Cómo voy a recibir el JWT --> Postman: headers --> x-token
    const token = req.header('x-token');
    //console.log(token)

    // Si el token no llegar, es decir, que llegue undefined o null

    if (!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

    next();

}

module.exports = {
    validateJWT
}