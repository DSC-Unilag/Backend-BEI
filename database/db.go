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

type User struct {
	ID        int
	CreatedAt time.Time
	Name      string `db:"author"`
}

//Question ... Posts struct
type Question struct {
	id int
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
	db, err = sqlx.Open("postgres", "user = DSC password = DSC dbname = test sslmode = disable")
	if err != nil {
		log.Fatalln("error opening database: ", err)
	}
}

//Create .... CRUD
func (user *User) Create() {
	err := db.QueryRow("insert into users (author) values($1) returning id, created_at", user.Name).Scan(&user.ID, &user.CreatedAt)
	fmt.Println("1", err)
	
}

//Delete ... CRUD
func (user *User) Delete() error {
	_, err := db.Exec("delete from users where id = $1", user.ID)
	return err

}

//Retrieve ... Retrieves all users questions comments and replies
func (user *User) Retrieve() error {
	//var comments []Comment
	var questions []Question
	//var replies []Reply
	//for question
	err = db.QueryRowx("select id, content, user_id from questions where user_id = $1", user.ID).StructScan(&questions)
	fmt.Println("Questions retrieved are", questions)
	return err
}

//Delete ... CRUD
func (question *Question) Delete() error {
	_, err := db.Exec("delete from question where id = $1", question.ID)
	return err
}

//Create ... Questions CRUD
func (question *Question) Create() {
	db.QueryRow("insert into questions (author, content, user_id) values ($1, $2, $3) returning id", question.Author.Name, question.Content, question.UserID).Scan(&question.ID)
}

// func (comment *Comment) ViewComments() []Comment {
// 	//going to get comments and replies to comments
// 	db.First(&comment) //Lets hope this shit works
// }
