package main

import (
	"fmt"

	db "./database"
)

func main() {
	var user db.User
	user = db.User{
		Name: "Uti Michael",
	}
<<<<<<< HEAD
	user.Create()
	fmt.Println(user)
	var questions db.Question
	questions = db.Question{
		Author:  user,
		UserID:  user.ID,
		Content: "Hello All",
	}
	questions.Create()
	fmt.Println(questions)
=======
	// tobi := db.User{
	// 	Name: "Oduah Tobi",
	// }
	// egahi := db.User{
	// 	Name: "Egahi Okwori",
	// }
	// user.Create()
	// tobi.Create()
	// egahi.Create()
	// fmt.Println(user)
	// var questions db.Question
	// questions = db.Question{
	// 	Author:  user,
	// 	UserID:  user.ID,
	// 	Content: "Hello All",
	// }
	// questions.Create()
	// fmt.Println(questions)
	// var comment db.Comment
	// comment = db.Comment{
	// 	Author:     tobi,
	// 	UserID:     tobi.ID,
	// 	QuestionID: questions.ID,
	// 	Content:    "Hi there",
	// }
	// comment = db.Comment{
	// 	Author:     user,
	// 	UserID:     user.ID,
	// 	QuestionID: questions.ID,
	// 	Content:    "Hi there",
	// }
	// comment.Create()
	// var reply db.Reply
	// reply = db.Reply{
	// 	Author:     egahi,
	// 	Content:    "Hello,",
	// 	UserID:     egahi.ID,
	// 	QuestionID: questions.ID,
	// 	CommentID:  comment.ID,
	// }
	// reply.Create()
	// fmt.Println(user)
	// fmt.Println(questions)
	// fmt.Println(comment)
	// fmt.Println(reply)
	user.Retrieve()
	fmt.Println(user)
	fmt.Println("Questions from", user.Name, "are: ")
	for i, num := range user.Questions {
		fmt.Println(i, ":", num.Content)
		fmt.Println("Comments are :")
		for j, num := range user.Questions[i].Comments {
			fmt.Println(j, ":", num.Content)
			fmt.Println("Replies are :")
			for k, num := range user.Questions[i].Comments[j].Replies {
				fmt.Println(k, ":", num)
			}
		}
	}
>>>>>>> 3bfe20c08e5a33276775223db5a5c25035c5ba87
}
