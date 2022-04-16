const argon2 = require('argon2');
const Joi = require('joi');

const schema = Joi.object({
    full_name: Joi.string()
        .uppercase()
        .required(),
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password')
})

// signup middleware
const signupValidate = async function(request, response, next){
    
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
}

module.exports= {signupValidate}