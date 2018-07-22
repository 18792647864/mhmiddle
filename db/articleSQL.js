var ArticleSQL=
    {
        insert :'insert into mh_article(title,introduction,release_time) values(?,?,?)',
        insertComment :'insert into mh_comment(article_id,content,from_uid,is_top,is_hot,like_num,reply_num,is_reply,status,create_time) values(?,?,?,?,?,?,?,?,?,?)',
        insert_content :'insert into mh_article_content(article_id,content) values(?,?)',
        queryAll :'select a.article_id,a.categoryId,a.introduction,a.title,a.uId,a.release_time,ac.content_id,a.count_comments,a.count_likes,users.nickname,cate.name as categoryname\n' +
        'from mh_article a,mh_article_content ac,mh_user users,mh_category cate\n' +
        'where a.article_id = ac.article_id \n' +
        '\tand users.uid = a.uId\n' +
        '\tand cate.category_id = a.categoryId',
        getArticleById: 'select content from mh_article_content where content_id = ?'
    };
module.exports = ArticleSQL;