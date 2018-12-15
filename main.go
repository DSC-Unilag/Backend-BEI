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
}
