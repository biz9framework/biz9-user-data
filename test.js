/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: User-Data-Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {User_Logic,User_Field,User_Type,User_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {User_Data}=require("./index");
const {Data_Logic,Data_Field} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Num,Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb19';
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG START --- */
const DATA_CONFIG ={
    APP_ID:APP_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let error=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                let print_test = true;
                // -- USER-REGISTER-START -- //
                let option = {};
                let post_user = User_Logic.get_test({data:{email:'ceo'+Num.get_id()+'@email.com',password:'1234567'}});
                delete post_user.title;
                delete post_user.title_url;
                const [error,biz_data] = await User_Data.register(database,post_user,option);
                // -- USER-REGISTER-START -- //
                //
                // -- USER-LOGIC-START -- //
                /*
                let option = {};
                //let user = User_Logic.get_test();
                //let user = User_Logic.get_test({data:{email:'email80560@email.com',password:'1234567'}});
                let user = Data_Logic.get(User_Table.USER,0,{data:{email:'email80560@email.com',password:'1234567'}});
                const [error,biz_data] = await User_Data.login(database,user,option);

                //const [error,biz_data] = await User_Data.register(database,user,option);
                */
                // -- USER-REGISTER-START -- //

                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                }
            },
        ],
            function(error, result){
                console.log('CONNECT-DONE');
                done();
            });
    });
});

