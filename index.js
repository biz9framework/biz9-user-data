/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Blank
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Data_Logic,Field,Type,Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
const {Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class User {
    //9_user_post
    static post = async (database,data,option) => {
        /* Post Data
         *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
         *
            /* Options
            */
        return new Promise((callback) => {
            let error = null;
            let data = {data:{user:post_data}};
            data[Type.FIELD_RESULT_OK_EMAIL] = false;
            data[Type.FIELD_RESULT_OK_TITLE] = false;
            async.series([
                //check email
                async function(call){
                    let search = Data_Logic.get_search(Table.USER,{email:data.email},{},1,0);
                    const [biz_error,biz_data] = await Data.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(Str.check_is_null(data.id) && biz_data[Field.ITEMS].length<=0){
                            data[Type.FIELD_RESULT_OK_EMAIL] = true;
                        }else if(biz_data[Field.ITEMS].length>0){
                            if(data.id == biz_data[Field.ITEMS][0].id){
                                data[Type.FIELD_RESULT_OK_EMAIL] = true;
                            }
                        }else{
                            data[Type.FIELD_RESULT_OK_EMAIL] = true;
                        }
                    }
                },
                //check title
                async function(call){
                    let search = Data_Logic.get_search(Table.USER,{title:data.title},{},1,0);
                    const [biz_error,biz_data] = await Data.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(biz_error){
                        biz_error=Log.append(error,biz_error);
                    }else{
                        if(Str.check_is_null(data.id) && biz_data[Field.ITEMS].length<=0){
                            data[Type.FIELD_RESULT_OK_TITLE] = true;
                        }else if(biz_data[Field.ITEMS].length>0){
                            if(data.id == biz_data[Field.ITEMS][0].id){
                                data[Type.FIELD_RESULT_OK_TITLE] = true;
                            }
                        }else{
                            data[Type.FIELD_RESULT_OK_TITLE] = true;
                        }
                    }
                },
                //post user
                async function(call){
                    if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_TITLE]){
                        data.last_login = DateTime.get();
                        const [biz_error,biz_data] = await Data.post(database,Type.DATA_USER,post_data);
                        if(biz_error){
                            biz_error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
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

}
module.exports = {
    User
};
