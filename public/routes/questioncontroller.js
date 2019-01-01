'use strict';

var Model = require('../models/model');
var express = require('express');

//functions to handle routes
module.exports = {

  getAllQuestions: function getAllQuestions(req, res) {
    //get all questions along with user
    var Questions = new Model('questions');
    var sql = 'SELECT questions.*,users.name FROM ' + Questions.table + '\n                INNER JOIN users ON questions.user_id = users.id ORDER BY date_created DESC';
    Questions.executeQuery(sql).then(function (result) {
      res.status(200).json(result);
    }).catch(function (error) {
      res.status(500).json({ message: "error occured while trying to retrieve question" });
      console.log(error.message);
    });
  },

  postQuestion: function postQuestion(req, res) {
    var newQuestion = {
      user_id: req.body.user_id,
      title: req.body.title,
      description: req.body.description
    };
    var Questions = new Model('questions');
    Questions.insert(newQuestion).then(function (result) {
      res.status(200).json(result);
    }).catch(function (error) {
      res.status(500).json({ message: "something went wrong from the server" });
    });
  },

  deleteQuestion: function deleteQuestion(req, res) {
    var question_id = req.params.id;
    var Questions = new Model('questions');
    Questions.delete({ id: question_id }.then(function () {
      res.status(200).json({ message: "question successfully deleted" });
    }).catch(function (error) {
      console.log(error.stack);
      res.status(500).json({ message: "couldn't delete question" });
    }));
  },

  getSingleQuestion: function getSingleQuestion(req, res) {
    //get single question along with poster details
    var question_id = req.params.id;
    var Questions = new Model('questions');
    var sql = 'SELECT questions.*, users.name,users.username FROM ' + Questions.table + ' \n          \t\tINNER JOIN users ON questions.user_id = users.id WHERE questions.id=' + question_id;
    Questions.executeQuery(sql).then(function (result) {
      res.status(200).json(result[0]);
    }).catch(function (error) {
      res.status(500).json({ message: "error occured while trying to retrieve question" });
      console.log(error.message);
    });
  },

  searchQuestions: function searchQuestions(req, res) {
    //search for questions using a keyword.
    var searchQuery = req.query.s;
    var Questions = new Model('questions');
    var sql = 'SELECT * FROM ' + Questions.table + ' WHERE title LIKE \n                \'%' + searchQuery + '%\' ORDER BY date_created DESC';
    Questions.executeQuery(sql).then(function (result) {
      res.status(200).json(result);
    }).catch(function (error) {
      res.status(500).json({ message: "error occured while trying to retrieve question" });
      console.log(error.message);
    });
  }

};