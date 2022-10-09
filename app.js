import {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    PORT
} from '/config.js'

const express=require('express');
const mysql=require('mysql2');
var bodyParser=require('body-parser');
var app=express();

var con=mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database:DB_NAME

})

app.use(express.static('public'))

con.connect();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended:true
}))

app.post('/addUser',(req,res)=>{
    let nombre=req.body.nombre
    let apellido=req.body.apellido
    let cancion=req.body.cancion

    con.query('insert into registros(nombre,apellido,cancion) values("'+nombre+'","'+apellido+'","'+cancion+'")',(err,respuesta,fields)=>{

        if (err)return console.log("Error",err)

        return res.send(`
        <a href="index.html">Inicio</a>
        <h1>Nombre: ${nombre}</h1>
        <h1>Apelldio: ${apellido}</h1>
        <h1>Cancion: ${cancion}</h1>`)


    })

})

app.post('/delUser',(req,res)=>{
    let nombreUser=req.body.nombreBorrar;

    con.query('DELETE FROM registros where nombre=("'+nombreUser+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html">Inicio</a>
        <h1>Usuario ${nombreUser} eliminado</h1>`)
    })
})

app.get('/getUsers',(req,res)=>{
    
    con.query('SELECT * FROM registros',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        var userHTML=``
        var apHTML=``
        var cancionHTML=``


        var i=0
        console.log(respuesta)
        userHTML+=`
        <a href="index.html">Inicio</a>
        `
        respuesta.forEach(user=>{
            i++
            userHTML+=`
            <tr><td>${i}</td><td>${user.nombre}</td></tr>
            `
            apHTML+=`
            <tr><td>${i}</td><td>${user.apellido}</td></tr>
            `
            cancionHTML+=`
            <tr><td>${i}</td><td>${user.cancion}</td></tr>
            `
        })

        return res.send(`<table>
            <tr>
                <th>Datos: </th>
            </tr>
            ${userHTML}
            ${apHTML}
            ${cancionHTML}

            </table>`)
    })
})

app.post('/updUser',(req,res)=>{
    let nombreUser=req.body.nombreEdit;
    let newName=req.body.nombreEditado


    con.query('UPDATE registros SET nombre=("'+newName+'") WHERE nombre=("'+nombreUser+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html">Inicio</a>
        <h1>Usuario ${nombreUser} cambiado a: <h3>${newName}</h3></h1>
        `)
    })
})


app.listen(PORT,()=>{
    console.log("Servidor escuchando en el puerto 3000")
})