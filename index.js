const express = require('express');
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bm:1q2w3e4r@boilerplate.nm2gv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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