var ArticleSQL=
    {
        insert :'insert into mh_article(title,introduction) values(?,?)',
        insert_content :'insert into mh_article_content(article_id,content) values(?,?)',
        queryAll :'select a.article_id,a.categoryId,a.introduction,a.title,a.uId from mh_article a',
        getUserById: 'select * from mh_article where uid = ?'
    };
module.exports = ArticleSQL;