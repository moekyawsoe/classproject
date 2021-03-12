const express = require("express");

const router = express.Router();
const userModel = require("../models/user");
const md5 = require("md5");

const suffix = "rayhub";

//display login page
router.get("/login", function (req, res, next) {
  //render to views/user/add.ejs
  res.render("login", {
    email: "",
    password: "",
  });
});

//authenticate user
router.post("/authentication", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (email === "" || password === "") {
    req.flash("error", "Please fill correct email and password!");
    res.redirect("/login");
    return;
  }

  // console.log(req.body);
  userModel.checkUser(email, (err, userData) => {
    // console.log(err, userData);
    if (err) {
      req.flash("error", err.message);
      res.redirect("/login");
      return;
    }

    if (md5(md5(password) + suffix) !== userData.password) {
      req.flash(
        "error",
        "<strong>Please correct enter email and Password!</strong>"
      );
      res.redirect("/login");
      return;
    }

    // render to views/user/edit.ejs template file
    req.session.loggedin = true;
    req.session.name = userData.name;
    req.session.id = userData.id;
    res.redirect("/");
  });
});

// add a new user
router.post("/register", function (req, res, next) {
  const params = req.body;

  if (params.email === "" || params.userName === "" || params.password === "") {
    return res.render("register", {
      error: "Please fill all field to register!",
      data: params,
    });
  }

  if (params.password !== params.confirmPassword) {
    return res.render("register", {
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
      return res.render("register", {
        error: err.message,
        data: params,
      });
    }

    req.flash("success", "Your account is registered. Please sign in here.");
    res.redirect("/login");
  });
});

//forget-password
router.get("/forget-password", (req, res) => {
  res.render("forget-password", { error: "" });
});

router.post("/forget-password", (req, res) => {
  const email = req.body.email;
  userModel.getUserByEmail(email, (err, userData) => {
    if (err) {
      return res.render("forget-password", { error: err.message });
    }

    if (userData) {
      return res.render("reset-password", {
        error: "",
        data: userData,
      });
    }

    res.render("forget-password", { error: "Invalid Email address" });
  });
});

router.post("/reset-password", (req, res) => {
  const params = req.body;
  if (params.password !== params.confirmPassword) {
    return res.render("reset-password", {
      error: "Passwords do not match",
      data: { id: params.id },
    });
  }

  userModel.resetPassword(
    params.id,
    md5(md5(params.password) + suffix),
    (err, effectRow) => {
      if (err) {
        return res.render("reset-password", {
          error: err.message,
          data: { id: params.id },
        });
      }

      req.flash("success", "Your account is registered. Please sign in here.");
      res.redirect("/login");
    }
  );
});

// Logout user
router.get("/logout", function (req, res) {
  // req.session.destroy();
  req.session.loggedin = false;
  req.session.name = "";
  req.session.id = "";
  req.flash("success", "Login Again Here");
  res.redirect("/login");
});

module.exports = router;
