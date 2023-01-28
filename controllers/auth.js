
//No es necesario el response. Se le añade para que el autocompletado siga funcionando
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generateJwt } = require('../helpers/jwt')

const createUser = async(req, resp = response) => {

    const { email, password } = req.body

    try {

        let usuario = await Usuario.findOne({ email })

        if ( usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body); 

        // Encripta contraseña con bcrypt

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar Json Web Tokens

        const token = await generateJwt( usuario.id, usuario.name)
    
        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        })
    }

}


const loginUser = async(req, resp = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if ( !usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email' //Se debería dejar un mensaje más genérico por seguridad, pero lo dejamos así para saber si fue el email o la contraseña
            });
        }

        // Confirmar los password

        const validPassword = bcrypt.compareSync( password, usuario.password)

        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar nuestro Json Web Tokens

        const token = await generateJwt( usuario.id, usuario.name)

        return resp.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        })
        
    }
        
}

const revalidateToken =  async(req, resp = response) => {

    /* const uid = req.uid;
    const name = req.name; */

    const {uid, name} = req;

    //Generar un nuevo JWT y retornarlo en esta petición

    const token = await generateJwt(uid, name);

    return resp.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken,
}