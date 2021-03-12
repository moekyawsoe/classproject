const dbConn = require('../config/db');

//cb = callback
exports.checkUser = function(email,cb){
  dbConn.query("SELECT id, name, email, password FROM register WHERE email = ? limit 1",[email],
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

exports.getUser = function(cb){
  dbConn.query("SELECT * FROM register",function(err,result){
    if(err){
      cb(err,null);
      return;
    }else{
      cb(null,result);
    }
  })
}

exports.Save = function(data,cb){
  dbConn.query('INSERT INTO register SET ?', data, function(err,result){
    if(err){
      console.log(err);
      cb(err,null);
    }else{
      console.log("Success");
      cb(null, result.insertId);
    }
  });
}

exports.UpdateUser = function(id,updatedData,cb){
  dbConn.query('UPDATE register SET ? where id = ?', [updatedData, id], function(err,result){
    if(err){
      console.log(err);
      return cb(err,null);
    }else{
      console.log("Success");
      cb(null, result.affectedRows);
    }
  });
}

exports.getUserByEmail = function(email, cb) {
  dbConn.query("SELECT * FROM register WHERE email = ? ", email, function (err, result) {
      if (err) {
          console.log(err);
          cb(err, null);
      } else {
          cb(null, result.length > 0 ? result[0] : null);
      }
  });
}

exports.getUserById = function(id, cb) {
  dbConn.query("SELECT * FROM register WHERE id = ? ", id, function (err, result) {
      if (err) {
          console.log(err);
          cb(err, null);
      } else {
          cb(null, result.length > 0 ? result[0] : null);
      }
  });
}

exports.resetPassword = function (id, pwd, cb) {
  dbConn.query("UPDATE register SET password = ? WHERE id = ? ", [pwd, id], function (err, result) {
      if(err) {
          cb(err, 0);
      }else {
          cb(null, result.affectedRows);
      }
  });
}
