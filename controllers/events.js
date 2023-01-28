const { response } = require('express');
const Evento = require('../models/Evento')



const getEvents = async(req, resp = response) => {

    const events = await Evento.find()
                                .populate('user', 'name');

    return resp.status(200).json({
        ok: true,
        events
    })
}


const createEvent = async(req, res = response) => {

    const event = new Evento( req.body );

    try {

        event.user = req.uid;
        const savedEvent = await event.save();

        res.json({
            ok: true,
            event: savedEvent,
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Evento.findById( eventId )

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene los privilegio para editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const newUpdateEvent = await Evento.findByIdAndUpdate( eventId, newEvent, {new: true});

        return res.json({
            ok: true,
            event: newUpdateEvent
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Evento.findById( eventId );

        if(! event) {
            return res.status(404).json({
                ok: false,
                msg: "El evento no existe por ese ID"
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "No tienes los privilegios para eliminar este evento"
            })
        }
        
        await Evento.findByIdAndDelete( eventId );

        return res.json({
            ok: true,
            msg: `El evento ${eventId} fue eliminado`
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "No se pudo eliminar el evento"
        })
    }

}

module.exports = {
    getEvents, createEvent, updateEvent, deleteEvent
}

// uid: 63d2ec1300a844e6218e5fba