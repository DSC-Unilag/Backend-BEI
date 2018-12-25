//Since theres complexity using GORM i've decided to go pure sql instead using sqlx library
package database

import (
	"fmt"
	"log"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB
var err error

//User ...
type User struct {
	ID        int
	CreatedAt time.Time
	Name      string `db:"author"`
	Questions []Question
}

//Question ... Posts struct
type Question struct {
	ID       int
	Author   User   `db:"author"`
	UserID   int    `db:"user_id"`
	Content  string `db:"content"`
	Comments []Comment
}

//Comment ... Comment struct
type Comment struct {
	ID         int
	Author     User
	UserID     int `db:"user_id"`
	QuestionID int `db:"question_id"`
	Content    string
	Acceptable bool
	Replies    []Reply
}

//Reply ... Reply struct
type Reply struct {
	ID         int
	Author     User
	Content    string
	UserID     int `db:"user_id"`
	QuestionID int `db:"question_id"`
	CommentID  int `db:"comment_id"`
}

func init() {
	//added port 5434 cos of update to postgres(11)
	db, err = sqlx.Open("postgres", "user=DSC port=5434 password=DSC dbname=database")
	if err != nil {
		panic(err)
	}
}

//Create .... CRUD
func (user *User) Create() {
	err := db.QueryRow("insert into users (author) values($1) returning id, created_at", user.Name).Scan(&user.ID, &user.CreatedAt)
	fmt.Println("1", err)
}

//Delete ... CRUD
func (user *User) Delete() error {
	//note when i delete user it doesnt delete question and other details but just simply gives nobody as its user
	_, err := db.Exec("delete from users where id = $1", user.ID)
	return err
}

//Retrieve ... Retrieves all users questions comments and replies
func (user *User) Retrieve() error {
	var comments Comment
	var question Question
	var replies Reply
	//for question
	rows, err := db.Queryx("select id, content from questions where author = $1", user.Name)
	if err != nil {
		log.Fatalln("error getting question ", err)
	}
	for rows.Next() {
		err := rows.Scan(&question.ID, &question.Content)
		fmt.Println(question)
		user.Questions = append(user.Questions, question)
		if err != nil {
			fmt.Println(err)
		}

		fmt.Println(user.Questions, question)
	} // reply.Create()
	fmt.Println(question)
	// reply.Create()

	rows, err = db.Queryx("select id, content, question_id from comments where author = $1", user.Name)
	fmt.Println("hello")
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		err := rows.Scan(&comments.ID, &comments.Content, &comments.QuestionID)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(comments)
		user.Questions[comments.QuestionID-1].Comments = append(user.Questions[comments.QuestionID-1].Comments, comments)

	}
	fmt.Println("hellot")
	//for replies
	rows, err = db.Queryx("select id, content, question_id, comment_id from replies where author = $1", user.Name)
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		err := rows.Scan(&replies.ID, &replies.Content, &replies.QuestionID, &replies.CommentID)
		user.Questions[replies.QuestionID-1].Comments[replies.CommentID-1].Replies = append(user.Questions[replies.QuestionID-1].Comments[replies.CommentID-1].Replies, replies)
		if err != nil {
			fmt.Println(err)
		}
	}
	return err
}

//Delete ... CRUD
func (question *Question) Delete() error {
	_, err := db.Exec("delete from questions where id = $1", question.ID)
	return err
}

//Create ... Questions CRUD
func (question *Question) Create() {
	db.QueryRow("insert into questions (author, content, user_id) values ($1, $2, $3) returning id", question.Author.Name, question.Content, question.UserID).Scan(&question.ID)
}

//Create ... CRUD
func (comment *Comment) Create() error {
	//since we have question i omitted passing question struct to parameter

	err := db.QueryRow("insert into comments (author, user_id, question_id, content, acceptable) values ($1, $2, $3, $4, $5) returning id", comment.Author.Name, comment.UserID, comment.QuestionID, comment.Content, comment.Acceptable).Scan(&comment.ID)
	return err
}

//Delete .... CRUD
func (comment *Comment) Delete() error {
	_, err := db.Exec("delete from comments where id = $1", comment.ID)
	return err
}

//Create .... CRUD
func (reply *Reply) Create() error {
	err := db.QueryRow("insert into replies (author, content, user_id, question_id, comment_id) values ($1, $2, $3, $4, $5) returning id ", reply.Author.Name, reply.Content, reply.UserID, reply.QuestionID, reply.CommentID).Scan(&reply.ID)
	return err
}

//Delete .... CRUD
func (reply Reply) Delete() error {
	_, err := db.Exec("delete from replies where id = $1", reply.ID)
	return err
}
