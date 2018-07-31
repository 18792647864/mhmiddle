var UserSQL=
    {
        insert :'insert into mh_user(username,nickname,gender,password,birthday,phone_number,mailbox,company,career,personal_profile,registration_time) values(?,?,?,?,?,?,?,?,?,?,?)',
        updateUserInfo :'UPDATE mh_user set username = ?,nickname = ?,gender = ?,birthday = ?,phone_number = ?,mailbox = ?,company = ?,career = ?,personal_profile = ? where uid = ?',
        queryAll :'select * from user',
        getUserById: 'select * from mh_user where uid = ?',
        getUserByName: 'select * from mh_user where username = ? or  nickname = ? or mailbox = ? or phone_number = ?',
        insertCommunity:'insert into mh_community(name,introduction,create_uid,create_time,status) values(?,?,?,?,?)',
        insertCommunityCate:'insert into mh_category(name,community_id) values ?',
        queryCommunity:'select community_id,name,introduction from mh_community where status = ?',
        queryCommunityCate:'select category_id,name,community_id from mh_category where community_id = ?',
        updateCommunity:'UPDATE mh_community set status = ?,approver_uid = ?,approval_comments = ? where community_id = ?',
        queryCreateCommunity:'select community_id,name,introduction,status,approval_comments from mh_community where create_uid = ? ORDER BY create_time DESC LIMIT 1'
    };
module.exports = UserSQL;