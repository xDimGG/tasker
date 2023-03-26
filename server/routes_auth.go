package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
)

type postLoginForm struct {
	Name string `json:"name"`
	From string `json:"from"`
}

// The first route the frontend calls when the user signs in
// If they have signed in before, their account information is returned
// If they have not signed in before, they are registered in the database
// If they provided a from parameter, the old jwt uid data is ported to the new logged in user
func postLogin(c *gin.Context) {
	uid := c.MustGet("uid").(string)
	anon := c.MustGet("anonymous").(bool)

	body := &postLoginForm{}
	if err := c.BindJSON(body); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	u := &User{ID: uid}
	if err := db.Model(u).WherePK().Select(); err != nil {
		if err != pg.ErrNoRows {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		if !anon {
			if body.Name == "" {
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "no `name` provided"})
				return
			}

			u.Name = body.Name
		}

		if _, err := db.Model(u).Returning("*").Insert(); err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
	}

	if !anon && body.From != "" {
		token, err := authClient.VerifyIDToken(context.Background(), body.From)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		_, err = db.Model((*List)(nil)).
			Where("creator_id = ?", token.UID).
			Set("creator_id = ?", u.ID).
			Update()
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
	}

	c.JSON(http.StatusOK, u)
}
