var express = require('express');
var multer = require("multer");
var router = express.Router();
var {
    find,
    insert,
    del,
    update
} = require("../libs/mongo.js");
var token = require("../libs/token.js");

//令牌校验拦截
router.post('/checktoken', async (req, res, next) => {
    let {
        Token
    } = req.body
    console.log(Token)
    res.send(token.checkToken(Token));
});

//渲染数据库所有信息
router.post('/msg', async (req, res, next) => {
    let data = await find("student", {})
    if (data) {
        res.send(data);
    }
});

//插入数据
router.post('/insert', async (req, res, next) => {
    let {
        _skill,
        _age,
        _gender,
        _name
    } = req.body
    let data = await insert("student", [{
        skill: _skill,
        age: _age,
        gender: _gender,
        name: _name
    }])
    console.log(data);
    if (data.ops.length > 0) {
        res.send("ok");
    }
});

//删除数据
router.post('/del', async (req, res, next) => {
    let {
        _name
    } = req.body
    let data = await del("student", {
        name: _name
    })
    res.send(data);
});


//查询数据
router.post('/find', async (req, res, next) => {
    let {
        _name
    } = req.body
    let data = await find("student", {
        name: _name,
    })
    if (data) {
        res.send(data);
    }
});

//更新数据
router.post('/update', async (req, res, next) => {
    let {
        _age,
        _gender,
        _name,
        _afskill,
        _afage,
        _afgender,
        _afname
    } = req.body
    let data1 = await find("student", { name: _name });
    let data = await update("student", {
        name: _name,
    }, {
            skill: _afskill ? _afskill : data1[0].skill,
            name: _afname ? _afname : data1[0].name,
            age: _afage ? _afage : data1[0].age,
            gender: _afgender ? _afgender : data1[0].gender
        })
    if (data) {
        res.send(data);
    }
});


//上传头像文件
var storage = multer.diskStorage({
    //设置上传后文件路径
    destination: function (req, file, cb) {
        console.log(1)
        cb(null, './uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        //给图片加上时间戳格式防止重名名
        //比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});

router.post('/uploads', upload.single('logo'), (req, res, next) => {
    res.json({
        status: "success",
        file: req.file
    });
});

router.post('/setpic', async (req, res, next) => {
    let {
        picname,
        Token
    } = req.body
    let data1 = await token.decodeToken(Token);
    let username = data1.payload.data.inputEmail;
    let data = await update("details", { username }, { picname })
    if (data.nModified > 0) {
        console.log("ok");
    }
});

//渲染头像
router.post('/findpic', async (req, res, next) => {
    let {
        Token
    } = req.body
    let data1 = await token.decodeToken(Token);
    let username = data1.payload.data.inputEmail;
    let data = await find("details", { username })
    if (data.length > 0) {
        res.send(data[data.length - 1].picname);
    }
});
module.exports = router;
