package main

import "github.com/gin-gonic/gin"

func postLogin(c *gin.Context) {
	c.BindHeader("Authorization")
	// c.BindJSON()
	db.Model()
}
