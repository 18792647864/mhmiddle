var UserSQL=
    {
        insert :'insert into mh_user(username,nickname,gender,password,birthday,phone_number,mailbox,company,career,personal_profile,registration_time) values(?,?,?,?,?,?,?,?,?,?,?)',
        updateUserInfo :'UPDATE mh_user set username = ?,nickname = ?,gender = ?,birthday = ?,phone_number = ?,mailbox = ?,company = ?,career = ?,personal_profile = ? where uid = ?',
        queryAll :'select * from user',
        getUserById: 'select * from mh_user where uid = ?',
        getUserByName: 'select * from mh_user where username = ? or  nickname = ? or mailbox = ? or phone_number = ?'
    };
module.exports = UserSQL;