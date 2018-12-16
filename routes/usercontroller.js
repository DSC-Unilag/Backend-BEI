const Model = require('../models/model');
const express = require('express');

module.exports = {

        getUserprofile: (req, res) => {
            const user_id = req.params.id;
            const Users = new Model('users')
            var sql = `SELECT * FROM ${Users.table} 
                    WHERE questions.id=${user_id}`;
            Questions.sqlQuery(sql).then(result => {
                    res.status(200).json(result);
            }).catch(error => {
                res.status(500).json({message:"error occured while trying to retrieve user info"})
                console.log(error.message)
            })
        },

        getUserQuestions:(req,res) => {

        }
        


}