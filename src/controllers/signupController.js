const{MongoClient} = require('mongodb');
const router = require('../routes/routes_index');
const argon2 = require('argon2')
const Joi = require('joi');

// connecting to database
const connectToDb = async ()=>{
    try {
        const client= await MongoClient.connect('mongodb://localhost:27017/')

        return client.db("users")
    } catch (error) {
        console.log(error, "database Error")
    }
   
}

// signup controller
const signup = async function(request, response){
    
    const dbConnection = await connectToDb();
    const hash = await argon2.hash(request.body.password, {
        type: argon2.argon2id
    });
    let {fullName,username,email} =  request.body;

    const checkEmail = await dbConnection.collection('user_details')
        .findOne({email: email});

    const checkUserName = await dbConnection.collection('user_details')
        .findOne({username: username});
        
        if(checkEmail && checkEmail._id){
            response.status(401).json({
                error: true,
                description: "email already exists",
                message: "try a different email",
                payload: "Null"
            });
            return
        };
                   
        if(checkUserName && checkUserName._id){
            response.status(401).json({
                error: true,
                description: "username taken",
                message: "pick a different username",
                payload: "Null"
            });
            return
        };
    // inserting one user 
    const userData = await dbConnection.collection('user_details')
        .insertOne({
            fullName: fullName,
            username: username,
            email: email,
            password: hash,
            repeat_password: hash
        });
        
    response.status(201).json({
        error: false,
        description: "Signup successful",
        message: "Welcome",
        payload: {
            fullName: fullName,
            email: email
        }
    });      
}

// login controller
const login = async function(request,response){
    const dbConnection = await connectToDb();
        
    let {email} =  request.body;
    
    if (email !== ""){
        const checkUser = await dbConnection.collection('user_details')
        .findOne({email: email});

        const  checkPassword = await argon2.verify( checkUser.password, request.body.password );

        if(!checkUser){
            response.status(401).json({
                error: true,
                description: "No user",
                message: "Could not find user",
                payload: "Null"
            })
            return
        }
        
        if(checkPassword === true){
            response.json({
                error: false,
                description: "password correct",
                message: "Logged in successfully",
                payload: `welcome, ${checkUser.username}`
            })
            return
        }else{
            response.status(401).json({
                error: true,
                description: "password incorrect",
                message: "Login denied",
                payload: "Null"
            })
        }
    }else{
        response.status(401).json({
            error: true,
            description: "username/email required",
            message: "Username/Email",
            payload: "Null"
        })
    }

};

module.exports={
    connectToDb,
    signup,
    login
}

