package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
)

func getList(c *gin.Context) {
	l := &List{ID: c.Param("id")}
	if err := db.Model(l).Relation("Creator").Relation("Items").WherePK().Select(); err != nil {
		if err == pg.ErrNoRows {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "the list does not exist"})
			return
		}

		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, l)
}

type postListForm struct {
	Name     string   `json:"name" binding:"required"`
	Autoplay bool     `json:"autoplay"`
	Loop     bool     `json:"loop"`
	Text     []string `json:"text" binding:"required,min=1"`
	Duration []uint   `json:"duration" binding:"required,min=1"`
}

func postList(c *gin.Context) {
	body := &postListForm{}
	if err := c.BindJSON(body); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	if len(body.Duration) != len(body.Text) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "lengths of `duration` and `text` are not equal"})
		return
	}

	id := uuid.NewString()

	items := make([]ListItem, len(body.Text))
	for i := range items {
		items[i].ListID = id
		items[i].Order = uint16(i)
		items[i].Text = body.Text[i]
		items[i].Duration = body.Duration[i]
	}

	list := &List{
		ID:        id,
		Name:      body.Name,
		Autoplay:  body.Autoplay,
		Loop:      body.Loop,
		Items:     items,
		CreatorID: c.MustGet("uid").(string),
	}

	if err := db.RunInTransaction(context.Background(), func(tx *pg.Tx) (err error) {
		if _, err = tx.Model(list).Insert(); err != nil {
			return
		}

		_, err = tx.Model(&list.Items).Insert()

		return
	}); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, list)
}

func deleteList(c *gin.Context) {
	uid := c.MustGet("uid").(string)
	id := c.Param("id")

	if _, err := db.Model((*List)(nil)).Where("id = ?", id).Where("creator_id = ?", uid).Delete(); err != nil {
		fmt.Println(err.Error())
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "the resource you are trying to delete either doesn't exist or doesn't belong to you",
		})
		return
	}

	c.AbortWithStatus(http.StatusNoContent)
}
