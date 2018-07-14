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

module.exports = router;
