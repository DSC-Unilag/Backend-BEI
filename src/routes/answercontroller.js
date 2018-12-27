const Model = require('../models/tables');


//functions to handle routes		
	exports.getAnswersForAQuestion = (req, res) => {
  	//answers come with the users' information 
    const question_id = req.params.id;
    const Answers = new Model('answers')
    var sql = `SELECT answers.*, users.name,
                users.username FROM ${Answers.table} 
                INNER JOIN users ON answers.user_id = users.id
                INNER JOIN questions ON answers.question_id = questions.id
                WHERE questions.id=${question_id} ORDER BY answers.upvotes DESC`;
		Answers.executeQuery(sql)
		.then(result => {
    	if (result.length){
        res.status(200).json({count:result.length, result: result});
      }
      res.status(201).json({count:result.length, message:"no answer for this question"})
    }).catch(error => {
        //res.status(500).json({message:"error occured while trying to retrieve Answers"})
        console.log(error.message)
      })
    }

  exports.getUsersComments = (req, res) => {
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
			Comments.executeQuery(sql).then(result => {
        if (result.length){
          res.status(200).json({ count:result.length, result:result});
        }
        res.status(404).json({count:result.length, message:"no comment for this answer"})
      }).catch(error => {
        	res.status(500).json({message:"error occured while trying to retrieve comments"})
          console.log(error.message)
      })
    }

    exports.postAnswerToAQuestion = (req, res) => {
    	const newAnswer = {
				user_id:req.body.user_id,
				description:req.body.description,
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
    }

  exports.upvoteAnswer  = (req, res) => {
    const answer_id = req.params.id;
    const Answers = new Model('answers')
    var sql = `SELECT upvotes FROM ${Answers.table} WHERE id = ${answer_id}`;
		Answers.executeSQL(sql)
		.then(result => {
    	var currentUpvotes = result[0].upvotes;
    	var newUpvotes = currentUpvotes + 1;
			Answers.update({upvotes:newUpvotes}, {id: answer_id})
			.then(() => {
          Answers.find({id:answer_id}).then(updatedrow => {
            res.status(200).json({status:"updated", result:updatedrow[0]});
          })
      }).catch(error => {
          res.status(500).json(error.message);
        })
  	})
	}

  exports.acceptAsPreferred = (req, res) => {
		const answer_id = req.params.id;
		const user_id = req.params.userid;
		const Answers = new Model('answers')
		Answers.update({preferred:1}, {id:answer_id})
		.then(() => {
			Answers.find({id:answer_id}).then(updatedrow => {
				res.status(200).json({status:"updated", result:updatedrow[0]});
			})
		}).catch(error => {
			res.status(500).json(error.message);
		})

  }

  exports.createComment = (req, res) => {
    const newComment = {
      user_id:req.body.user_id,
      text:req.body.text,
      question_id:req.params.qid,
      answer_id:req.params.id
    }
    const Comments = new Model('comments');
    Comments.insert(newComment).then(result => {
                res.status(200).json({result, message:"comment successfully posted!"})
    }).catch(error => {
        console.log(error.message)
        res.status(500).json({message:"something went wrong from the server"})
    })
	}
	
