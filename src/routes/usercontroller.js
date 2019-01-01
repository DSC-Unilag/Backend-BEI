const Model = require('../models/tables');
const express = require('express');

//functions to handle user routes

   exports.getUserprofile  = (req, res) => {
   	const user_id = req.params.id;
      const Users = new Model('users')
      var sql = `SELECT * FROM ${Users.table} WHERE id=${user_id}`;
      Users.executeQuery(sql).then(result => {
         if(result.length){
            res.status(200).json(result[0]);
         }
      }).catch(error => {
         res.status(500).json({message:"error occured while trying to retrieve user info"})
         Sconsole.log(error.message)
      })
   }

   exports.getUserQuestions = (req,res) => {
      //answers come with the users' information 
      const user_id = req.params.id;
      const Questions = new Model('questions')
      var sql = `SELECT questions.*, users.name,users.username FROM ${Questions.table} 
                  INNER JOIN users ON questions.user_id = users.id
                  WHERE questions.user_id=${user_id} ORDER BY questions.date_created DESC`;
      Questions.executeQuery(sql).then(result => {
         res.status(200).json({count:result.length, result:result});
		}).catch(error => {
         res.status(500).json({message:"error occured while trying to retrieve user's question"})
         console.log(error.message)
      })
   }

