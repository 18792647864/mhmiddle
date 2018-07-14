var UserSQL=
    {
        insert :'insert into user(uid,username) values(?,?)',
        queryAll :'select * from user',
        getUserById: 'select * from mh_user where uid = ?'
    };
module.exports = UserSQL;