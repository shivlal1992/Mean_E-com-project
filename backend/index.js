const express = require('express')
const app = express()
const port = 3000;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const cors = require('cors');
const jwt = require('jsonwebtoken');

const privateKey = 'ggdfhiudiHGCGYUYigwdfgsdf'

app.use(cors())

mongoose.connect('mongodb+srv://admin:RK4Oi6ZzR3zxm0El@cluster0.oujrpwn.mongodb.net/ecom')
    .then(() => console.log('Connected to MongoDB'))

    .catch((e) => {
        console.log("Database not connected")
    });


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    contact: String,
    email: String,
    password: String,
    confirmPassword: String,


});

const productSchema = new Schema({
    productId: String,
    productName: String,
    productRate: Number,
    productQuantity: Number,





})

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// app.use(bodyParser.json()); 

app.get('/', function (req, res) {
    res.send('Hello World')
})
app.post('/register', jsonParser, (req, res) => {

    console.log("body data:", req.body);


    const { firstName, lastName, contact, email, password, confirmPassword } = req.body;

    const createNewuser = new User({
        firstName: firstName,
        lastName: lastName,
        contact: contact,
        email: email,
        password: password,
        confirmPassword: confirmPassword

    })

    createNewuser.save().then((result) => {
        res.status(201).json({ msg: 'New User Created Successfully', result })
    })

    // res.send('Login API')
})

function generateToken(payload) {
    const token = jwt.sign(payload, privateKey);

    return token
}


app.post('/login', jsonParser, (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    User.findOne({ email: email }).then((result) => {

        console.log(result)

        if (result) {

            if (result.password == password) {

                res.status(200).send({ msg: 'Login Successful', result, token: generateToken({ email: email, password: password }) })

            } else {

                res.status(500).send({ msg: 'Please Enter Valid E-mail & Password', result })

            }

        } else {
            res.status(500).send({ msg: 'Please Enter Valid E-mail', result })

        }

    });
})

const verifyToken = (req, res, next) => {
    console.log(req.headers)
    console.log(req.headers.authorization)


    const token = req.headers.authorization;

    
        jwt.verify(token, privateKey, function (err, decoded) {
            

            if(err){

                res.status(401).send({msg:'Invalid Tocken'})
            }else{

                

                next();

            }
    
            
        });

   

    
}

// add new product

app.post('/product', verifyToken, jsonParser, (req, res) => {



    const { productId, productName, productQuantity, productRate } = req.body;
    const createNewProduct = new Product({
        productId: productId,
        productName: productName,
        productQuantity: productQuantity,
        productRate: productRate,


    })

    createNewProduct.save().then((result) => {
        res.status(201).json({ msg: 'New Product added successfully!', result })
    })
    .catch((e)=>{
        console.log(e)
        res.status(500).json({msg:"Internet Server Error",e })
    })

})



app.put("/product",jsonParser,(req,res)=>{

    console.log(req.body);
    const {productId,productName,productQuantity,productRate,_id}=req.body;

    Product.findByIdAndUpdate({_id:_id},{
        $set:{
            productId: productId,
            productName: productName,
            productRate: productRate,
            productQuantity: productQuantity,



        }
    },{new:true}).then((result)=>{
        res.status(201).json({msg:"Updated Successfully!"})
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({msg:"Internet Server Error",e})
    })

    



})  

app.delete("/product/:id",(req,res)=>{

    console.log(req.params.id);

    Product.findOneAndDelete({_id:req.params.id}).then((result)=>{
        res.status(200).json({msg:"Item Deleted Successfully.",result})
    })

    
})



app.get("/product",verifyToken,(req,res)=>{

    Product.find({}).then((result)=>{

        res.status(200).json(result)

    })
})

// Start server
app.listen(port, () => {
    console.log('Server running on port:', port);
});