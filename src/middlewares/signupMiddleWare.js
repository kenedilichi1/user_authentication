const argon2 = require('argon2');
const { response } = require('express');
const { request } = require('express');
const Joi = require('joi');

const schema = Joi.object({
    full_name: Joi.string()
        .uppercase(),
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(30),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password')
})

// signup middleware
const signupValidate = async function(request, response, next){
    let {fullName, username, email, password, repeat_password} = request.body;

    if (fullName && username && email && password && repeat_password !== ""){
    
        try {
        
            const value = await schema.validateAsync({ 
                full_name:request.body.fullName,
                username: request.body.username, 
                email: request.body.email, 
                password: request.body.password, 
                repeat_password: request.body.repeat_password
            });
        }
        catch (err) {
            console.log(err, "caught an error")
        }
        
        
        next()
    
    }else{
        response.status(401).json({message: "All the fields are required"})
    }
    
    
}


// login middleware
const loginValidate = async function (request, response, next){
    let {username, email, password} = request.body;
    if(username || email && password){
        try {
            const value = await schema.validateAsync({
                username: request.body.username,
                email: request.body.email,
                password: request.body.password
            })
        } catch (error) {
            console.log(error, "caught an error")
        }
        next()
    }else{
        response.status(401).json({message: "provide username/email  and password "})
    }
    
}

module.exports= {
    signupValidate,
    loginValidate
}