var express = require('express');
var router = express.Router();

let mysql  = require('mysql');
let dbConfig = require('../db/DBConfig.js');
let articleSQL  = require('../db/articleSQL.js');
let pool = mysql.createPool(dbConfig.mysql);

let resonseJSON = function (res,ret)
{
    if(typeof  ret == 'undefined')
    {
        res.json({code:200,msg:'操作失败'})
    }else {
        res.json(ret)
    }
};

//ajax每次请求的时候会先发出options请求，得到确认后才会发出正式请求
// router.options('/addArticle',function (req,res,next){
//             res.send('success_options');
//     }
// );

//添加文章
router.post('/addArticle',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        console.log(req.body);
        let param = req.body;
        connection.query(articleSQL.insert,[param.title,param.introduction],function (err,result)
        {
            connection.query(articleSQL.insert_content,[result.insertId,req.body.content],function (err,result)
            {
                console.log(result);
                res.send(result);
                connection.release();
            });
        });
    });
});



//查找文章
router.get('/queryArticle',function (req, res, next)
{
    // console.log(req);
    pool.getConnection(function (err, connection)
    {
        // let param = req.query||req.param;
        // console.log('param');
        // console.log(param);
        connection.query(articleSQL.queryAll,function (err, result)
        {
            // console.log("result");
            console.log(result);
            res.send(result);
            connection.release();
        })
    });
});

module.exports = router;
