const { Schema, model } = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        requirde: true
    },
    notes: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,  //--> Indicamos que el user es una referencia. La referencia la indicamos en el ref:
        ref: 'Usuario',
        required: true
    }
});

// Eliminamos el campo __v y cambiamos el campo _id por el id
EventoSchema.method('toJSON', function() {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);