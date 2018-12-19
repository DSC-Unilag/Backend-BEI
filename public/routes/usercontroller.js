'use strict';

var Model = require('../models/model');
var express = require('express');

//functions to handle routes
module.exports = {

   getUserprofile: function getUserprofile(req, res) {
      var user_id = req.params.id;
      var Users = new Model('users');
      var sql = 'SELECT * FROM ' + Users.table + ' WHERE id=' + user_id;
      Users.executeQuery(sql).then(function (result) {
         if (result.length) {
            res.status(200).json(result[0]);
         }
      }).catch(function (error) {
         res.status(500).json({ message: "error occured while trying to retrieve user info" });
         Sconsole.log(error.message);
      });
   },

   getUserQuestions: function getUserQuestions(req, res) {
      //answers come with the users' information 
      var user_id = req.params.id;
      var Questions = new Model('questions');
      var sql = 'SELECT questions.*, users.name,users.username FROM ' + Questions.table + ' \n                  INNER JOIN users ON questions.user_id = users.id\n                  WHERE questions.user_id=' + user_id + ' ';
      Questions.executeQuery(sql).then(function (result) {
         res.status(200).json({ count: result.length, result: result });
      }).catch(function (error) {
         res.status(500).json({ message: "error occured while trying to retrieve user's question" });
         console.log(error.message);
      });
   }

};