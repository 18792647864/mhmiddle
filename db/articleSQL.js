var ArticleSQL=
    {
        insert :'insert into mh_article(title,introduction) values(?,?)',
        queryAll :'select * from mh_article',
        getUserById: 'select * from mh_article where uid = ?'
    };
module.exports = ArticleSQL;