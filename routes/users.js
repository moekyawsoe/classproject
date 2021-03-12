const express = require('express');
const router = express.Router();
const md5 = require('md5');
const userModel = require('../models/user');

const suffix = "RayHub";

function isAuthenticated(req, res, next) {
  if (req.session.loggedin)
      return next();
  res.redirect('/login');
}

/* GET users listing. */
router.get('/', function(req,res){

  userModel.getUser((err,userData)=>{
    if(err){
      req.flash('error',err);
    }else{
    res.render('userlist',{
      users:userData
    });
  }
  })
});

router.get('/add',function(req,res){
  res.render('user/newuser',{
    error:""
  });
});
// add a new user
router.post("/add", function (req, res, next) {
  const params = req.body;

  if (params.email === "" || params.userName === "" || params.password === "") {
    return res.render("user/newuser", {
      error: "Please fill all field to register!",
      data: params,
    });
  }

  if (params.password !== params.confirmpassword) {
    return res.render("user/newuser", {
      error: "Passwords do not match",
      data: params,
    });
  }

  const insData = {
    name: params.userName,
    email: params.email,
    password: md5(md5(params.password) + suffix),
  };

  userModel.Save(insData, (err, newId) => {
    if (err) {
      return res.render("user/newuser", {
        error: err.message,
        data: params,
      });
    }

    req.flash("success", "Your account is registered. Please sign in here.");
    res.redirect("/userlist");
  });
});

// display edit user page
router.get('/edit/(:id)',isAuthenticated, function(req, res, next) {
  const id = req.params.id;
  userModel.getUserById(id, (err, userData) => {
    if (err) {
      return res.render("userlist", { error: err.message });
    }

    if (userData) {
      return res.render("edituser", {
        error: "",
        data: userData,
      });
    }
    // res.render('edituser');
  });

})

// update user data
router.post('/update/:id',isAuthenticated, function(req, res, next) {
  const id = req.params.id;
  const params = req.body;

  console.log(id);
  console.log(params.name+params.email+params.password);
  console.log(req.body.name);

  if (!id || params.name === "" || params.email === ""){
    return res.render("edituser", {
      data:{
        id:id,
        name:params.name,
        email:params.email
      },
      error: "Please fill all fields!"
    });
  }
  let updatedData = {
    name: params.name,
    email: params.email
  }
  if (params.password !== ""){
    if (params.password === params.confirmpassword) {
      return res.render("edituser", {
        data:{
          id:id,
          name:params.name,
          email:params.email
        },
        error: "Passwords do not match!"
      });
    }

    updatedData.password = md5(md5(params.password) + suffix);
  }
  console.log(updatedData);
  userModel.UpdateUser(id, updatedData, (err, affectedRows) => {
    if (err) throw err;

    res.redirect('/userlist');
  })
})

module.exports = router;
