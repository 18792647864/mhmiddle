var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('zh-cn');

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

//#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  文章相关接口   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//添加文章
router.post('/addArticle',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {

        var date = new Date();
        console.log(req.body);
        let param = req.body;
        var cateId = param.catevalue;
        connection.query(articleSQL.insert,[param.title,param.introduction,date,param.uId,cateId,param.isdraft],function (err,result)
        {
            console.log(err);
            connection.query(articleSQL.insert_content,[result.insertId,param.content],function (err,result)
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
        let param = req.query||req.param;
        // console.log('param');
        // console.log(param);
        var articleResult = [];
        connection.query(articleSQL.queryAll,[param.isdraft],function (err, result)
        {
            // console.log("result");
            // console.log(result);
            for(var i = 0;i<result.length;i++)
            {
                if(param.cateId != 0 && param.cateId != result[i].categoryId) {
                    continue;
                }
                else{
                    result[i].release_time = moment(result[i].release_time).format('YYYY-MM-DD HH:mm:ss');
                    // console.log(articleResult);
                    articleResult.push(result[i])
                }
            }
            res.send(articleResult);
            connection.release();
        });
        // console.log(articleResult);
    });
});

//查找单用户文章
router.get('/queryUserArticle',function (req, res, next)
{
    // console.log(req);
    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        // console.log('param');
        // console.log(param);
        connection.query(articleSQL.queryUserAll,[param.isdraft,param.uId],function (err, result)
        {
            // console.log("result");
            // console.log(result);
            for(var i = 0;i<result.length;i++)
            {
                result[i].release_time = moment(result[i].release_time).format('YYYY-MM-DD HH:mm:ss');
            }
            res.send(result);
            connection.release();
        })
    });
});


//查询单个文章内容
router.get('/getSingleArticle',function (req, res, next)
{
    // console.log(req);
    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        console.log('param');
        console.log(param);
        connection.query(articleSQL.getArticleById,[param.contentId],function (err, result)
        {
            console.log(err);
            console.log(result[0].content);
            var formatDate = moment(result[0].content.release_time).format('YYYY-MM-DD HH:mm:ss');
            console.log(formatDate);
            res.send(result[0].content);
            connection.release();
        })
    });
});

//#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  社区相关接口   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//查找社区分类
router.get('/getCateOptions',function (req, res, next)
{
    // console.log(req);
    pool.getConnection(function (err, connection)
    {
        // let param = req.query||req.param;
        // console.log('param');
        // console.log(param);
        connection.query(articleSQL.getCateOptions,function (err, result)
        {
            res.send(result);
            connection.release();
        })
    });
});


//#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  评论相关接口   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//添加评论
router.post('/addComments',function (req,res,next)
{
    // console.log(req);
    //从连接池中获取链接
    pool.getConnection(function (err,connection)
    {
        var date = new Date();
        console.log(req.body);
        let param = req.body;
        connection.query(articleSQL.insertComment,[param.article_id,
            param.comments,
            param.uId,
            '0',
            '0',
            '0',
            '0',
            '0',
            '1',
            date],function (err,result) {
            //更新文章表中的评论数统计
            connection.query(articleSQL.updateArticleComments,[param.article_id],function (err,result) {
                console.log(result);
            });
            console.log(result);
            res.send(result);
            connection.release();
        });
    });
});


//查询最新的评论信息
router.get('/getNewcomments',function (req, res, next)
{
    console.log('查询最新的评论信息');
    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        console.log('param');
        console.log(param);
        connection.query(articleSQL.getNewcomments,[param.articleId],function (err, result)
        {
            console.log(err);
            // console.log(result[0].content);
            // var formatDate = moment(result[0].content.release_time).format('YYYY-MM-DD HH:mm:ss');
            // console.log(formatDate);
            res.send(result);
            connection.release();
        })
    });
});


//查询热评
router.get('/getHotcomments',function (req, res, next)
{
    console.log('查询最新的评论信息');
    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        console.log('param');
        console.log(param);
        connection.query(articleSQL.getHotcomments,[param.articleId],function (err, result)
        {
            console.log(err);
            // console.log(result[0].content);
            // var formatDate = moment(result[0].content.release_time).format('YYYY-MM-DD HH:mm:ss');
            // console.log(formatDate);
            res.send(result);
            connection.release();
        })
    });
});


//#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  点赞相关接口   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//添加文章点赞
router.get('/addArticlelikes',function (req, res, next)
{

    pool.getConnection(function (err, connection)
    {
        let param = req.query||req.param;
        console.log('param');
        console.log(param);
        var date = new Date();
        connection.query(articleSQL.addArticlelikes,[param.uId,param.articleId,date,'1','1'],function (err, result)
        {
            connection.query(articleSQL.updateArticleLikes,[param.articleId],function (err, result)
            {
                console.log(result);
                res.send(result);
                connection.release();
            })
        })
    });
});


module.exports = router;
