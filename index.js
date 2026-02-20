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
    //9_user_post
    static post = async (database,post_data,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
         *
            /* Options
            */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(User_Table.USER,0,{data:post_data});;
            data[User_Type.RESULT_OK_EMAIL] = false;
            data[User_Type.RESULT_OK_USER_NAME] = false;
            async.series([
                //check email
                async function(call){
                    let search = Data_Logic.get_search(User_Table.USER,{email:data.email},{},1,0);
                    const [biz_error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(Str.check_is_null(data.id) && biz_data[Data_Field.ITEMS].length<=0){
                            data[User_Type.RESULT_OK_EMAIL] = true;
                        }else if(biz_data[Data_Field.ITEMS].length>0){
                            if(data.id == biz_data[Data_Field.ITEMS][0].id){
                                data[User_Type.RESULT_OK_EMAIL] = true;
                            }
                        }else{
                            data[User_Type.RESULT_OK_EMAIL] = true;
                        }
                    }
                },
                //check title
                async function(call){
                    let search = Data_Logic.get_search(User_Table.USER,{title:data.title},{},1,0);
                    const [biz_error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(Str.check_is_null(data.id) && biz_data[Data_Field.ITEMS].length<=0){
                            data[User_Type.RESULT_OK_USER_NAME] = true;
                        }else if(biz_data[Data_Field.ITEMS].length>0){
                            if(data.id == biz_data[Data_Field.ITEMS][0].id){
                                data[User_Type.RESULT_OK_USER_NAME] = true;
                            }
                        }else{
                                data[User_Type.RESULT_OK_USER_NAME] = true;
                        }
                    }
                },
                //post user
                 async function(call){
                    if(data[User_Type.RESULT_OK_EMAIL] && data[User_Type.RESULT_OK_USER_NAME]){
                        data = User_Logic.clean_user(data);
                        data.last_login = DateTime.get();
                        const [biz_error,biz_data] = await Data.post(database,User_Table.USER,data);
                        if(biz_error){
                            biz_error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                        }
                    }
                }
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                console.log(err);
                Log.error("User-Data-Post",err);
                callback([error,{}]);
            });
        });
    };
    //9_user_register
    static register = async (database,post_data,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
         *  - ip_address / type. string / ex. 123.0.0.1 / default. 0.0.0.0
         *  - geo_key / type. string / ex. Geo Location Key / default. blank
         *  - device / type. opj / ex. Geo Location Key / default. blank  / https://www.npmjs.com/package/platform
         *
            /* Options
             * IP Address Information
             * - post_stat / type. bool / ex.true,false / default. false
             * - post_ip_address / type. bool / ex.true,false / default. false
             * - post_device / type. bool / ex.true,false / default. false
             */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(User_Table.USER,0,{data:post_data});;
            data[User_Type.RESULT_OK_USER] = false;
            data[User_Type.RESULT_OK_USER_NAME] = false;
            data[User_Type.RESULT_OK_EMAIL] = false;
            //let post_ip_address = post_data.ip_address?post_data.ip_address:null;
            //let post_geo_key = post_data.geo_key?post_data.geo_key:null;
            //let post_device = post_data.device?post_data.device:null;
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
                        }
                    }
                },
                //check title
                async function(call){
                    let search = Data_Logic.get_search(User_Table.USER,{title:data.title},{},1,0);
                    const [biz_error,biz_data] = await Data.count(database,search.table,search.filter);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(biz_data==0){
                            data[User_Type.RESULT_OK_USER_NAME] = true;
                        }
                    }
                },
                //post user
                async function(call){
                    if(data[User_Type.RESULT_OK_EMAIL] && data[User_Type.RESULT_OK_USER_NAME]){
                        data.last_login = DateTime.get();
                        data = User_Logic.clean_user(data);
                        const [biz_error,biz_data] = await Data.post(database,User_Table.USER,data);
                        if(biz_error){
                            biz_error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                            data[User_Type.RESULT_OK_USER] = true;
                            data[User_Type.RESULT_OK_USER_NAME] = true;
                            data[User_Type.RESULT_OK_EMAIL] = true;
                        }
                    }
                },
           ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("User-Data-Register",err);
                callback([error,{}]);
            });
        });
    };
    //9_user_login //9_login
    static login = async (database,post_data,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,password:my_password} / default. error
         *  - ip_address / type. string / ex. 123.0.0.1 / default. 0.0.0.0
         *  - geo_key / type. string / ex. Geo Location Key / default. blank
         *  - device / type. opj / ex. Geo Location Key / default. blank  / https://www.npmjs.com/package/platform
         *
            /* Options
             * IP Address Information
             * - post_stat / type. bool / ex.true,false / default. false
             * - post_ip_address / type. bool / ex.true,false / default. false
             * - post_device / type. bool / ex.true,false / default. false
             */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(User_Table.USER,0,{data:post_data});;
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
                //post user
                async function(call){
                    if(data[User_Type.RESULT_OK_USER]){
                        data.last_login = DateTime.get();
                        data = User_Logic.clean_user(data);
                        const [biz_error,biz_data] = await Data.post(database,User_Table.USER,data);
                        if(biz_error){
                            error=Log.append(error,biz_error);
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
