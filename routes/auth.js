var express = require('express');
var router = express.Router();
var userModel = require('../models/user');


//display login page
router.get('/login',function(req,res,next){
   //render to views/user/add.ejs
   res.render('login', {
    email: '',
    password:''
  })
})

//authenticate user
router.post('/authentication', function(req, res, next) {

  var email = req.body.email;
  var password = req.body.password;

      userModel.checkUser(email,(err,userData)=>{
          if(err){
            req.flash('error',err.message)
            res.redirect('/login')
            return;
          }

          if(password !== userData.password){
            req.flash('error','<strong>Please correct enter email and Password!</strong>')
            res.redirect('/login')
            return;
          }
          // render to views/user/edit.ejs template file
          req.session.loggedin = true;
          req.session.name = userData.name;
          req.session.id = userData.id;
          res.redirect('/');
      });
})
//logout user
router.get('/logout',function(req,res){
  req.session.loggedin = false;
  req.session.name = "";
  req.flash('success','Login Again Here');
  res.redirect('/auth');
});

module.exports = router;
