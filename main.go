package main

import (
	"log"

	"github.com/jinzhu/gorm"
)

var db gorm.DB

func init() {
	db, err := gorm.Open("postgres", "user=DSC password=DSC dbname=dbname sslmode=disable")
	if err != nil {
		log.Fatalln("error opening database: ", err)
	}
	db.AutoMigrate()

}

func main() {

}
