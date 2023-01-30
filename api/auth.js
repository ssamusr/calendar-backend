/* 
RUTAS DE USUARIO / AUTH 
host + /api/auth
*/

/* const express = require('express');
const router = express.Router
 */

// Lo anterior también se puede hacer así:

const {Router} = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt')

const router = Router();

router.post(
    '/register',
    [ //Middlewares --> Express Validator
        check('name', 'El nombre es obligatorio').not().isEmpty(), //.not().isEmpty() --> No esté vacío
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
        validateFields
    ], 
    createUser
);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
        validateFields
    ],    
    loginUser)

router.get('/renew', validateJWT, revalidateToken)


module.exports = router;