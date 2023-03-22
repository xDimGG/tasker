package main

import (
	"time"

	"github.com/go-pg/pg/v10/orm"
)

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at" pg:"default:now()"`
	Lists     []List    `json:"lists" pg:"rel:has-many"`
}

type List struct {
	ID string `json:"id"`

	Name     string `json:"name"`
	Autoplay bool   `json:"autoplay"`
	Loop     bool   `json:"loop"`

	Items []ListItem `json:"items" pg:"rel:has-many"`

	CreatorID string `json:"-"`
	Creator   User   `pg:"rel:has-one"`
}

type ListItem struct {
	ListID string `json:"list_id"`

	Text     string `json:"text"`
	Duration uint   `json:"duration"`
	Order    uint   `json:"order"`
}

func createSchema() error {
	models := []interface{}{
		(*User)(nil),
		(*List)(nil),
		(*ListItem)(nil),
	}

	for _, model := range models {
		db.Model(model).DropTable(&orm.DropTableOptions{IfExists: true})
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			// Temp: true,
		})

		if err != nil {
			return err
		}
	}

	return nil
}
