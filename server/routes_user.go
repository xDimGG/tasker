package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func getUID(c *gin.Context) string {
	if c.Param("uid") == "me" {
		return c.MustGet("uid").(string)
	}

	return c.Param("uid")
}

func getUserLists(c *gin.Context) {
	results := 10
	if i, err := strconv.Atoi(c.Query("results")); err == nil {
		if i < 1 {
			i = 1
		} else if i > 50 {
			i = 50
		}

		results = i
	}

	offset := 0
	if i, err := strconv.Atoi(c.Query("offset")); err == nil {
		if i < 0 {
			i = 0
		}

		offset = i
	}

	l := []List{}
	err := db.Model(&l).
		Order("created_at ASC").
		Where("creator_id = ?", getUID(c)).
		Limit(results + 1). // Fetch one more than necessary for pagination
		Offset(offset).
		Select()
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	hasMore := len(l) > results
	if hasMore {
		l = l[:results]
	}

	c.JSON(http.StatusOK, gin.H{
		"results":  l,
		"has_more": hasMore,
	})
}
