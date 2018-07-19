var express = require('express');
var router = express.Router();

let mysql  = require('mysql');
let dbConfig = require('../db/DBConfig.js');
let userSQL  = require('../db/usersql.js');
let pool = mysql.createPool(dbConfig.mysql);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


let resonseJSON = function (res,ret)
{
    if(typeof  ret == 'undefined')
    {
        res.json({code:200,msg:'操作失败'})
    }else {
        res.json(ret)
    }
};

//添加用户
router.get('/addUser',function (req,res,next)
{
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        let param = req.query || req.param;
        connection.query(userSQL.insert,[param.uid,param.name],function (err,result)
        {
            if(result)
            {
                result = {code:200,msg:'添加成功'};
            }else {
                result = {code:err.statusCode,msg:err.message}
            }
            resonseJSON(res,result);
            connection.release();
        });
    });
});

//查找用户
router.get('/queryUser',function (req, res, next)
{
    // console.log(req);
    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        console.log('param');
        console.log(param);
        connection.query(userSQL.getUserById,[param.uid],function (err, result)
        {
            console.log("result");
            console.log(result);
            res.send(result);
            connection.release();
        })
    });
});



//注册
router.get("/register",function(req,res){
    if(!req.session.user){ 					//
        req.session.error = "请先登录";
        res.redirect("/login");				//
    }
    res.render("home",{title:'Home'});         //
});

//登陆
router.get("/login",function(req,res){
    pool.getConnection(function (err,connection)
    {
        let param = req.query || req.param;
        connection.query(userSQL.getUserByName,[param.name,param.name,param.name,param.name],function (err,result)
        {
            console.log('login');
            console.log(req.session.id);
            if(result[0].password == param.password)
            {
                req.session.user = result[0];
                res.send(result);
            }
            else
            {
                res.send(404);
            }
            connection.release();
        });
    });
});


//判断是否登陆
router.get("/islogin",function(req,res){
    console.log('islogin');
    console.log(req.session.id);
    if(!req.session.user){
        res.send("用户么有登陆，请先登陆");
    }
    else {
        res.send("用户已登陆");
    }
});


//登出
router.get("/loginout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});

module.exports = router;
