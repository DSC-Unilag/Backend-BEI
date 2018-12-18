package main

import (
	"fmt"

	db "./database"
)

func main() {
	var user db.User
	user = db.User{
		Name: "Test
	}
	test1 := db.User{
		Name: "Test1",
	}
	test2 := db.User{
		Name: "Test2",
	}
	user.Create()
	test1.Create()
	test2.Create()
	fmt.Println(user)
	var questions db.Question
	questions = db.Question{
		Author:  user,
		UserID:  user.ID,
		Content: "Hello All",
	}
	questions.Create()
	fmt.Println(questions)
	var comment db.Comment
	comment = db.Comment{
		Author:     test1,
		UserID:     test1.ID,
		QuestionID: questions.ID,
		Content:    "Hi there",
	}
	comment.Create()
	comment = db.Comment{
		Author:     user,
		UserID:     user.ID,
		QuestionID: questions.ID,
		Content:    "Hi there",
	}
	comment.Create()
	var reply db.Reply
	reply = db.Reply{
		Author:     test1,
		Content:    "Hello,",
		UserID:     test1.ID,
		QuestionID: questions.ID,
		CommentID:  comment.ID,
	}
	reply.Create()
	comment = db.Comment{
		Author:     user,
		UserID:     user.ID,
		QuestionID: questions.ID,
		Content:    "I am Michael Uti",
	}
	comment.Create()
	fmt.Println(user)
	fmt.Println(questions)
	fmt.Println(comment)
	fmt.Println(reply)
	user.Retrieve()
	fmt.Println(user)
	fmt.Println("Questions from", user.Name, "are: ")
	for i, num := range user.Questions {
		fmt.Println(i, ":", num.Content)
		for j, num := range user.Questions[i].Comments {
			fmt.Println("Comments are :")
			fmt.Println(j, ":", num.Content)
			for k, num := range user.Questions[i].Comments[j].Replies {
				fmt.Println("Replies are :")
				fmt.Println(k, ":", num)
			}
		}
	}
}
