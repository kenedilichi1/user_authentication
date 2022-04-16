const express = require('express');
const server = require('./server');


// port
(function(expressInstance){
    const port = 8001;

    expressInstance.listen(port, function(){
        console.log(`server running on ${port}`)
    })
})(server)
