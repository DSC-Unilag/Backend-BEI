'use strict';

var Model = require('../models/model');
var express = require('express');

//functions to handle routes
module.exports = {

  getAnswersForAQuestion: function getAnswersForAQuestion(req, res) {
    //answers come with the users' information 
    var question_id = req.params.id;
    var Answers = new Model('answers');
    var sql = 'SELECT answers.*, users.name,\n                users.username FROM ' + Answers.table + ' \n                INNER JOIN users ON answers.user_id = users.id\n                INNER JOIN questions ON answers.question_id = questions.id\n                WHERE questions.id=' + question_id + ' ORDER BY answers.upvotes DESC';
    Answers.executeQuery(sql).then(function (result) {
      if (result.length) {
        res.status(200).json({ count: result.length, result: result });
      }
      res.status(404).json({ count: result.length, message: "no answer for this question" });
    }).catch(function (error) {
      res.status(500).json({ message: "error occured while trying to retrieve Answers" });
      console.log(error.message);
    });
  },

  getUsersComments: function getUsersComments(req, res) {
    //this function returns the comments by users for a particular Answer
    var question_id = req.params.qid;
    var answer_id = req.params.id;
    var Comments = new Model('comments');
    var sql = 'SELECT comments.*, users.name,\n      users.username FROM ' + Comments.table + ' \n      INNER JOIN users ON comments.user_id = users.id\n      INNER JOIN questions ON comments.question_id = questions.id\n      INNER JOIN answers ON comments.answer_id = answers.id\n      WHERE answers.id=' + answer_id + ' AND questions.id=' + question_id + ' ORDER BY comments.date_posted DESC';
    Comments.executeQuery(sql).then(function (result) {
      if (result.length) {
        res.status(200).json({ count: result.length, result: result });
      }
      res.status(404).json({ count: result.length, message: "no comment for this answer" });
    }).catch(function (error) {
      res.status(500).json({ message: "error occured while trying to retrieve comments" });
      console.log(error.message);
    });
  },

  postAnswerToAQuestion: function postAnswerToAQuestion(req, res) {
    var newAnswer = {
      user_id: req.body.user_id,
      description: req.body.description,
      question_id: req.params.id
    };
    var Answers = new Model('answers');
    Answers.insert(newAnswer).then(function (result) {
      res.status(200).json({ result: result, message: "answer successfully posted!" });
    }).catch(function (error) {
      console.log(error.message);
      res.status(500).json({ message: "something went wrong from the server" });
    });
  },

  upvoteAnswer: function upvoteAnswer(req, res) {
    var answer_id = req.params.id;
    var Answers = new Model('answers');
    var sql = 'SELECT upvotes FROM ' + Answers.table + ' WHERE id = ' + answer_id;
    Answers.executeSQL(sql).then(function (result) {
      var currentUpvotes = result[0].upvotes;
      var newUpvotes = currentUpvotes + 1;
      Answers.update({ upvotes: newUpvotes }, { id: answer_id }).then(function () {
        Answers.find({ id: answer_id }).then(function (updatedrow) {
          res.status(200).json({ status: "updated", result: updatedrow[0] });
        });
      }).catch(function (error) {
        res.status(500).json(error.message);
      });
    });
  },

  acceptAsPreferred: function acceptAsPreferred(req, res) {
    var answer_id = req.params.id;
    var user_id = req.params.userid;
    var Answers = new Model('answers');
    Answers.update({ preferred: 1 }, { id: answer_id }).then(function () {
      Answers.find({ id: answer_id }).then(function (updatedrow) {
        res.status(200).json({ status: "updated", result: updatedrow[0] });
      });
    }).catch(function (error) {
      res.status(500).json(error.message);
    });
  },

  createComment: function createComment(req, res) {
    var newComment = {
      user_id: req.body.user_id,
      text: req.body.text,
      question_id: req.params.qid,
      answer_id: req.params.id
    };
    var Comments = new Model('comments');
    Comments.insert(newComment).then(function (result) {
      res.status(200).json({ result: result, message: "comment successfully posted!" });
    }).catch(function (error) {
      console.log(error.message);
      res.status(500).json({ message: "something went wrong from the server" });
    });
  }

};