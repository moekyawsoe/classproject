const dbConn = require('../config/db');

//cb = callback
exports.checkUser = function(email,cb){
  dbConn.query("SELECT id,name,password,email FROM users WHERE email = ? limit 1",[email],
    function(err,result){
      if(err){
        cb(err,null);
        return;
      }

      if(result.length > 0){
        cb(null,result[0]);
      }else{
        cb(null,{password: ""});
      }
    }
  );
}

exports.Save = function(data,cb){
  dbConn.query("insert into users set ",data,function(err,result){
    if(err){
      cb(err,null);
    }else{
      cb(null,result.insertId);
    }
  });
}
