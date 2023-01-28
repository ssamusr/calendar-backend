/* 
RUTAS DE USUARIO / AUTH 
host + /api/events
*/


const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields')
const { validateJWT } = require('../middlewares/validate-jwt')

const { getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/events');
const { isDate } = require('../helpers/isDate')

const router = Router();

// Obtener eventos. Todas tienen que estar validaddas con el JWT
router.use( validateJWT );


router.get('/', getEvents)

// Crear un nuevo evento

router.post(
    '/', 
    [   //express-validator no tiene para validar fechas. Hay que hacer una validación personalizada
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        validateFields
    ],
    createEvent
    )

// Actualizar evento

router.put('/:id', updateEvent)

// Borrar evento

router.delete('/:id', deleteEvent)

module.exports = router;