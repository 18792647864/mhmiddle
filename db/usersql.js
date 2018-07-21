var UserSQL=
    {
        insert :'insert into mh_user(username,nickname,gender,password,birthday,phone_number,mailbox,company,career,personal_profile,registration_time) values(?,?,?,?,?,?,?,?,?,?,?)',
        queryAll :'select * from user',
        getUserById: 'select * from mh_user where uid = ?',
        getUserByName: 'select * from mh_user where username = ? or  nickname = ? or mailbox = ? or phone_number = ?'
    };
module.exports = UserSQL;