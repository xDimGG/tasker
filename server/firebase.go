package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const BearerPrefix = "Bearer "

func auth(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if !strings.HasPrefix(auth, BearerPrefix) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, "No bearer token provided")
		return
	}

	token, err := authClient.VerifyIDToken(context.Background(), strings.TrimPrefix(auth, BearerPrefix))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid bearer token provided")
		return
	}

	c.Set("uid", token.UID)
	c.Set("anonymous", token.Firebase.SignInProvider == "anonymous")
}
