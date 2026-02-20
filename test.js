/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - User
*/
const async = require('async');
const assert = require('node:assert');
const {Data_Logic,Field,Type,Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
const {Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb17';
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let error=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                //-->
                let print_test = true;
                //-->
                //-- USER-POST-START --//
                let user = Data_Logic.get(Table.USER,'929');
                //const [error,biz_data] = await Portal.get(database,parent.data_type,parent.id,option);
                //-- USER-POST-END --//
                //---
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

