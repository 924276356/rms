var express = require('express');
var router = express.Router();
var {
  find,
  insert,
  del,
  update
} = require("../libs/mysql.js");

var token = require("../libs/token.js")

router.post('/autosignin',(req, res, next)=>{
  let{
    data
  }=req.body
  if(token.checkToken(data)){
   res.send("ok");
  }else{
    res.send("fail")
  }
})

/* GET users listing. */
router.post('/signin', async (req, res, next) => {
  let {
    inputEmail,
    inputPassword
  } = req.body
  let data = await find("user", {
    username: inputEmail
  })
  if (data[0].password === inputPassword) {
    let crypto = token.createToken({
      inputEmail,
      inputPassword
    }, 120)
    res.json({
      status: "success",
      crypto
    });
  } else {
    res.send('fail');
  }



});


// var storage = multer.diskStorage({
//   //设置上传后文件路径
//   destination: function (req, file, cb) {
//     console.log(1)
//     cb(null, './uploads')
//   },
//   //给上传文件重命名，获取添加后缀名
//   filename: function (req, file, cb) {
//     var fileFormat = (file.originalname).split(".");
//     //给图片加上时间戳格式防止重名名
//     //比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
//     cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// });
// var upload = multer({
//   storage: storage
// });

// router.post('/uploads', upload.single('logo'), function (req, res, next) {
//   console.log(req.file);

//   res.json({
//     status: "success",
//     file: req.file
//   });
// });

module.exports = router;
