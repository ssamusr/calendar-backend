const express = require('express');
require('dotenv').config();
const cors = require('cors')
const { dbConection } = require("./database/config")

// 1. Crear el servidor de express

const app = express();

// Conexión a la base de datos
dbConection();

// CORS

app.use(cors())



// Directorio público
//use es un middleware. Es una función que se ejecuta en el momento en el que alguien hace una petición a mi servidor.
//use es una función que se ejecuta siempre que pase por un lugar
app.use( express.static('./public') )

//Lectura y parseo del body
app.use( express.json())

//2. Rutas
// TODO: auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


// 3. Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})
