const express = require('express');
const app = express();
const config = require("./config/key");

const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => console.log("MongoDB Connected..."))
.catch((err) => console.log(err));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});