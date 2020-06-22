const express = require('express');
const consing= require('consign');
const bodyParser = require('body-parser');


module.exports =() =>{

    const app = express();
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    consing()
        .include('controller')
        .into(app)

    return app;
}