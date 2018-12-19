"use strict";

// Mysql setup
var dbOptions = function dbOptions() {
  return {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "stackoverflow"
  };
};

//jsonwebtoken secret config
var secretconfig = function secretconfig() {
  return {
    'secret': 'supersecret'
  };
};