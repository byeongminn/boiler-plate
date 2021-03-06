const express = require('express');
const app = express();
const config = require("./server/config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./server/middleware/auth");
const { User } = require('./server/models/User');

app.use(express.json());
app.use(cookieParser());

// mongoDB 연결
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

app.get("/api/hello", (req, res) => res.send("Hello world!"));

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    })
  })
})

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "입력한 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      // 비밀번호까지 일치한다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 쿠키 or 로컬스토리지 or ...
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
      })
    })
  })
})

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  })
})

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  })
})

app.listen(5000, function () {
  console.log('Connected "http://localhost:5000"');
});