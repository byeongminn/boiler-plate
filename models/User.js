const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;  // salt가 몇 글자인지 나타냄
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     // 스페이스바를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {         // token의 유효 기간
        type: Number
    }
})

userSchema.pre("save", function (next) {     // pre : mongoose 메소드로, ~하기 전에 실행한다는 의미
    let user = this;
    
    if (user.isModified("password")) {
        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    let user = this;

    // jsonwebtoken을 이용해서 토큰을 생성하기
    const token = jwt.sign(user._id.toHexString(), "secretToken");
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findeByToken = function (token, cb) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, "secretToken", function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };