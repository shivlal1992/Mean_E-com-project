const express = require('express')
const app = express()
const port = 3000;
app.get('/', function (req, res) {
    res.send('Hello World')
})
app.post('/login', (req, res)=>{
    res.send('Login API')
})

app.post('/register', (req, res)=>{
    res.send('About  page')
})



app.listen(port, () => {

    console.log("Server running on port:", port)
})