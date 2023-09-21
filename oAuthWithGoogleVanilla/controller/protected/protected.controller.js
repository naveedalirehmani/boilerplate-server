function sayHello(request, response) {
  response.status(200).send("hello from protected");
}

module.exports = { sayHello };
