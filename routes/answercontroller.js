const Model = require('../models/model');
const express = require('express');

module.exports = {

    getAnswersForAQuestion:(req, res) => {
        //answers come with the users' information 
        const question_id = req.params.id;
        const Answers = new Model('answers')
        var sql = `SELECT answers.*, users.name,
                users.username FROM ${Answers.table} 
                INNER JOIN users ON answers.user_id = users.id
                INNER JOIN questions ON answers.question_id = questions.id
                WHERE questions.id=${question_id} ORDER BY answers.upvotes DESC`;
        Answers.sqlQuery(sql).then(result => {
                res.status(200).json({
                    count:result.length,
                    result});
        }).catch(error => {
            res.status(500).json({message:"error occured while trying to retrieve Answers"})
            console.log(error.message)
        })
    },

        getUsersComments:(req, res) => {
            //this function returns the comments by users for a particular Answer
            const question_id = req.params.qid;
            const answer_id = req.params.id;
            const Comments = new Model('comments')
            const sql = `SELECT comments.*, users.name,
            users.username FROM ${Comments.table} 
            INNER JOIN users ON comments.user_id = users.id
            INNER JOIN questions ON comments.question_id = questions.id
            INNER JOIN answers ON comments.answer_id = answers.id
            WHERE answers.id=${answer_id} AND questions.id=${question_id} ORDER BY comments.date_posted DESC`;

            Comments.sqlQuery(sql).then(result => {
                res.status(200).json({
                    count:result.length,
                    result});
            }).catch(error => {
                res.status(500).json({message:"error occured while trying to retrieve comments"})
                console.log(error.message)
            })
        },
        postAnswerToAQuestion: (req, res) => {
            const newAnswer = {
                user_id:req.query.user_id,
                description:req.query.description,
                question_id:req.params.id
            }
            const Answers = new Model('answers');
            Answers.insert(newAnswer)
            .then(result => {
                res.status(200).json({result, message:"answer successfully posted!"})
            }).catch(error => {
                console.log(error.message)
                res.status(500).json({message:"something went wrong from the server"})
            })
            
        },

        upvoteAnswer: (req, res) => {
            const answer_id = req.params.id;
            const Answers = new Model('answers')
            var sql = `SELECT upvotes FROM ${Answers.table} WHERE id = ${answer_id}`;
            Answers.executeSQL(sql).then(result => {
                var currentUpvotes = result[0].upvotes;
                var newUpvotes = currentUpvotes + 1;
                Answers.update({upvotes:newUpvotes}, {id: answer_id})
                .then(result => {
                        res.status(200).json(result);
                }).catch(error => {
                    res.status(500).json(error.message);
                })
            })
        },

        acceptAsPreffered: (req, res) => {


        },

        createComment: (req, res) => {

            const newComment = {
                user_id:req.query.user_id,
                text:req.query.text,
                question_id:req.params.qid,
                answer_id:req.params.id
            }
            const Comments = new Model('comments');
            Comments.insert(newComment)
            .then(result => {
                res.status(200).json({result, message:"comment successfully posted!"})
            }).catch(error => {
                console.log(error.message)
                res.status(500).json({message:"something went wrong from the server"})
            })
            
        }




}