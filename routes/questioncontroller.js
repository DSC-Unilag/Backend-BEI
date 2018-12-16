const Model = require('../models/model');
const express = require('express');

module.exports = {

        getAllQuestions: (req, res) => {
            //get all questions along with user
            const Questions = new Model('questions')
            var sql = `SELECT questions.*,users.name FROM ${Questions.table}
                        INNER JOIN users ON questions.user_id = users.id
                         ORDER BY date_created DESC`;
            Questions.sqlQuery(sql).then(result => {
                res.status(200).json(result);
            }).catch(error => {
            res.status(500).json({message:"error occured while trying to retrieve question"})
            console.log(error.message)
        })


        },

        postQuestion: (req, res) => {
            const newQuestion = {
                user_id:req.query.user_id,
                title:req.query.title,
                description:req.query.description
            };
            const Questions = new Model('questions');
            Questions.insert(newQuestion)
            .then(result => {
                res.status(200).json(result)
            }).catch(error => {
                res.status(500).json({message:"something went wrong from the server"})
            })
            
        },

        deleteQuestion: (req, res) => {
            const question_id = req.params.id;
            const Questions = new Model('questions');
            Questions.delete({id: question_id})
            .then(() => {
                res.status(200).json({message:"question successfully deleted"})
            }).catch(error => {
                res.status(500).json({message:"couldn't delete question"});
            })

        },

        getSingleQuestion: (req, res) => {
            //get single question along with poster details
            const question_id = req.params.id;
            const Questions = new Model('questions')
            var sql = `SELECT questions.*, users.name,
                    users.username FROM ${Questions.table} 
                    INNER JOIN users ON questions.user_id = users.id
                    WHERE questions.id=${question_id}`;
            Questions.sqlQuery(sql).then(result => {
                    res.status(200).json(result);
            }).catch(error => {
                res.status(500).json({message:"error occured while trying to retrieve question"})
                console.log(error.message)
            })
        },

        searchQuestions: (req, res) => {
            //search for questions using a query string.
            const searchQuery = req.query.s;
            const Questions = new Model('questions');
            const sql = `SELECT * FROM ${Questions.table} WHERE title LIKE 
                        %${searchQuery}% ORDER BY date_created DESC`
             Questions.sqlQuery(sql).then(result => {
                res.status(200).json(result);
                }).catch(error => {
                res.status(500).json({message:"error occured while trying to retrieve question"})
                console.log(error.message)
                })

        }

        
        



}
