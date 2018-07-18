var UserSQL=
    {
        insert :'insert into user(uid,username) values(?,?)',
        queryAll :'select * from user',
        getUserById: 'select * from mh_user where uid = ?',
        getUserByName: 'select * from mh_user where username = ? or  nickname = ? or mailbox = ? or phone_number = ?'
    };
module.exports = UserSQL;