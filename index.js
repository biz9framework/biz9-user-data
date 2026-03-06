/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: User-Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Field} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class User_Data {
    //9_user_register
    static register = async (database,post_user,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,username:username} / default. error
         */
        return new Promise((callback) => {
            let error = null;
            let data = User_Logic.get_check_user(post_user);
            async.series([
                //check email
                async function(call){
                    let search = Data_Logic.get_search(User_Table.USER,{email:data.email},{},1,0);
                    const [biz_error,biz_data] = await Data.count(database,search.table,search.filter);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(biz_data==0){
                            data[User_Type.RESULT_OK_EMAIL] = true;
                            data[User_Type.RESULT_OK_USER] = true;
                        }
                    }
                },
                //check username
                async function(call){
                    if(data.username){
                        data[User_Type.RESULT_OK_USERNAME] = data.username.length >= 3 ? true : false;
                    }else if(data.username && data[User_Type.RESULT_OK_USERNAME]){
                        let search = Data_Logic.get_search(User_Table.USER,{username:data.username},{},1,0);
                        const [biz_error,biz_data] = await Data.count(database,search.table,search.filter);
                        if(biz_error){
                            biz_error=Log.append(error,biz_error);
                        }else{
                            if(biz_data==0){
                                data[User_Type.RESULT_OK_USERNAME] = true;
                                data[User_Type.RESULT_OK_USER] = true;
                            }
                        }
                    }
                },
                //check password
                async function(call){
                    if(data.password){
                        data[User_Type.RESULT_OK_PASSWORD] = data.password.length > 3 ? true : false;
                    }
                    if(!data[User_Type.RESULT_OK_PASSWORD]){
                        data[User_Type.RESULT_OK_USER] = false;
                    }
                }
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("User-Data-Register",err);
                callback([error,{}]);
            });
        });
    };
    //9_user_login //9_login
    static login = async (database,post_user,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,password:my_password} / default. error
         */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(User_Table.USER,0,{data:post_user});;
            data[User_Type.RESULT_OK_USER] = false;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                //check email,password
                async function(call){
                    let search = Data_Logic.get_search(User_Table.USER,{email:data.email,password:data.password},{},1,0);
                    const [biz_error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        if(biz_data[Data_Field.ITEMS].length>0){
                            data = biz_data[Data_Field.ITEMS][0];
                            data[User_Type.RESULT_OK_USER] = true;
                        }
                    }
                },
           ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("User-Data-Login",err);
                callback([err,{}]);
            });
        });
    };
}
module.exports = {
    User_Data
};
