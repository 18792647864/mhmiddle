var express = require('express');
var router = express.Router();

let mysql  = require('mysql');
let dbConfig = require('../db/DBConfig.js');
let userSQL  = require('../db/usersql.js');
let pool = mysql.createPool(dbConfig.mysql);

var moment = require('moment');
moment.locale('zh-cn');


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




//修改用户信息
router.post('/updateUserInfo',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        console.log(req.body);
        let param = req.body;

        var birthday = new Date();
        if(param.birthday)
        {
            birthday = moment(param.birthday).format('YYYY-MM-DD');
        }

        console.log(birthday);
        var gender = param.gender || 0;

        connection.query(userSQL.updateUserInfo,[param.nickname,
                                                param.nickname,
                                                gender,
                                                birthday,
                                                param.phone_number,
                                                param.mailbox,
                                                param.company,
                                                param.career,
                                                param.personal_profile,
                                                param.uid],function (err,result)
        {
            console.log(err);
            console.log(result);
            res.send(result);
            connection.release();
        });
    });
});

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


//注册用户
router.post('/register',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        console.log(req.body);
        let param = req.body;
        var date = new Date();
        var bithday = date;
        if(param.birthday)
        {
            bithday = moment(param.birthday).format('YYYY-MM-DD');
        }

        connection.query(userSQL.insert,[param.nickname,
                                    param.nickname,
                                    param.gender,
                                    param.password,
                                    bithday,
                                    param.phonenumber,
                                    param.mailbox,
                                    param.company,
                                    param.career,
                                    param.personalprofile,date],function (err,result)
        {
            console.log(result);
            res.send(result);
            connection.release();
        });
    });
});


//登陆
router.get("/login",function(req,res){
    pool.getConnection(function (err,connection)
    {
        let param = req.query || req.param;
        var userResult = {};
        connection.query(userSQL.getUserByName,[param.name,param.name,param.name,param.name],function (err,result)
        {
            console.log(err);
            console.log(result);
            if(result.length == 0)
            {
                userResult.code = '2001';
                userResult.errInfo = '密码或者用户名错误';
            }
            else
            {
                if(result[0].password == param.password)
                {
                    userResult.code = '2000';
                    userResult.errInfo = '用户名和密码正确，允许登陆';
                    userResult.userInfo = result[0];
                }
                else
                {
                    userResult.code = '2002';
                    userResult.errInfo = '密码或者用户名错误';
                }
            }
            res.send(userResult);
            connection.release();
        });
    });
});


//判断是否登陆
router.get("/islogin",function(req,res){
    // console.log('islogin');
    // console.log(req.session.id);
    // if(!req.session.user){
    //     res.send("用户么有登陆，请先登陆");
    // }
    // else {
    //     res.send("用户已登陆");
    // }
});


//登出
router.get("/loginout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    // req.session.user = null;
    // req.session.error = null;
    // res.redirect("/");
});




// $$$$$$$$$$$$$$$$$  社区相关接口 ###################


//申请创建社区
router.post('/onCreateCommunity',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        console.log(req.body);
        let param = req.body;
        var date = new Date();
        connection.query(userSQL.insertCommunity,[param.name,
            param.desc,
            param.uId,
            date,
            '1'],function (err,result) {
                console.log(err);
                console.log(result);
                console.log('insertCommunity');
                var commCate = new Array();
                for(var i = 0;i < param.columns.value.length;i++ ){
                    commCate.push([
                        param.columns.value[i],
                        result.insertId
                    ]);
                }
                console.log(commCate);
                console.log('commCate');
                connection.query(userSQL.insertCommunityCate,[commCate],function (err,result)
                {
                    console.log(err);
                    console.log(result);
                    res.send(result);
                    connection.release();
                });
        });
    });
});



//查询社区
router.get("/queryCommunity",function(req,res){
    var communityResult = null;
    pool.getConnection(function (err,connection)
    {
        let param = req.query || req.param;
        connection.query(userSQL.queryCommunity,[param.status],function (err,result)
        {
            communityResult = JSON.parse(JSON.stringify(result));
            for (let i = 0;i < communityResult.length;i++)
            {
                connection.query(userSQL.queryCommunityCate, [communityResult[i].community_id], function (err, result) {
                    communityResult[i].columns = result;
                    console.log(communityResult[i]);
                    if(i == (communityResult.length - 1))
                    {
                        res.send(communityResult);
                        connection.release();
                    }
                });
            }

        });
    });
});



//查询社区
router.get("/queryCreateCommunity",function(req,res){
    pool.getConnection(function (err,connection)
    {
        // console.log(req);
        let param = req.query || req.param;
        console.log(param);
        connection.query(userSQL.queryCreateCommunity,[param.uId],function (err,result)
        {
            console.log(result);
            res.send(result);
            connection.release();
        });
    });
});



//审批社区，更新申请状态
router.post('/updateCommunity',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        console.log(req.body);
        let param = req.body;
        connection.query(userSQL.updateCommunity,[param.status,
            param.approver_uid,
            param.approval_comments,param.community_id],function (err,result) {
            console.log(err);
            console.log(result);
            res.send(result);
            connection.release();
        });
    });
});



module.exports = router;
