package main

import (
	"context"
	"fmt"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at" pg:"default:now()"`
	Lists     []List    `json:"lists,omitempty" pg:"rel:has-many"`
}

type List struct {
	ID string `json:"id"`

	Name      string    `json:"name"`
	Autoplay  bool      `json:"autoplay" pg:",use_zero"`
	Loop      bool      `json:"loop" pg:",use_zero"`
	CreatedAt time.Time `json:"created_at" pg:"default:now()"`

	Items []ListItem `json:"items,omitempty" pg:"rel:has-many"`

	CreatorID string `json:"-"`
	Creator   *User  `json:"creator,omitempty" pg:"rel:has-one"`
}

type ListItem struct {
	ListID string `json:"list_id" pg:",pk"`
	Order  uint16 `json:"order" pg:",pk,use_zero"`

	Text     string `json:"text"`
	Duration uint   `json:"duration" pg:",notnull,use_zero"`
}

func createSchema() error {
	models := []interface{}{
		(*User)(nil),
		(*List)(nil),
		(*ListItem)(nil),
	}

	for _, model := range models {
		// db.Model(model).DropTable(&orm.DropTableOptions{IfExists: true})
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			// Temp: true,
			IfNotExists: true,
		})

		if err != nil {
			return err
		}
	}

	return nil
}

type dbLogger struct{}

func (d dbLogger) BeforeQuery(c context.Context, q *pg.QueryEvent) (context.Context, error) {
	return c, nil
}

func (d dbLogger) AfterQuery(c context.Context, q *pg.QueryEvent) error {
	s, _ := q.FormattedQuery()
	fmt.Println(string(s))
	return nil
}
