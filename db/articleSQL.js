var ArticleSQL=
    {
        insert :'insert into mh_article(title,introduction,release_time,uId,categoryId) values(?,?,?,?,?)',
        insertComment :'insert into mh_comment(article_id,content,from_uid,is_top,is_hot,like_num,reply_num,is_reply,status,create_time) values(?,?,?,?,?,?,?,?,?,?)',
        insert_content :'insert into mh_article_content(article_id,content) values(?,?)',
        queryAll :'select a.article_id,a.categoryId,a.introduction,a.title,a.uId,a.release_time,ac.content_id,a.count_comments,a.count_likes,users.nickname,cate.name as categoryname\n' +
        'from mh_article a,mh_article_content ac,mh_user users,mh_category cate\n' +
        'where a.article_id = ac.article_id \n' +
        '\tand users.uid = a.uId\n' +
        '\tand cate.category_id = a.categoryId',
        getArticleById: 'select content from mh_article_content where content_id = ?',
        updateArticle:'UPDATE mh_article set count_comments = count_comments +1 where article_id = ?',
        getNewcomments:'SELECT comment_id,article_id,content,from_uid,is_top,is_hot,like_num,reply_num,is_reply,status,create_time,users.nickname\n' +
        'from mh_comment comm,mh_user users\n' +
        'where comm.from_uid = users.uid and comm.article_id = ?',
        getHotcomments:'SELECT comment_id,article_id,content,from_uid,is_top,is_hot,like_num,reply_num,is_reply,status,create_time,users.nickname\n' +
        'from mh_comment comm,mh_user users\n' +
        'where comm.from_uid = users.uid\n' +
        'and comm.is_hot = \'1\'\n' +
        'and comm.article_id = ?'
    };
module.exports = ArticleSQL;