
function sayHello(request,response){
    response.status(200).send("hello!")
}

module.exports = {sayHello}