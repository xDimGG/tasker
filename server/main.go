package main

import (
	"context"

	firebase "firebase.google.com/go"
	firebaseAuth "firebase.google.com/go/auth"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"google.golang.org/api/option"
)

var db *pg.DB
var authClient *firebaseAuth.Client

func main() {
	// Setup Firebase app and auth
	app, err := firebase.NewApp(context.Background(), nil, option.WithCredentialsFile("private.json"))
	if err != nil {
		panic(err)
	}

	authClient, err = app.Auth(context.Background())
	if err != nil {
		panic(err)
	}

	// Setup DB connection
	db = pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "postgres",
		Password: "1234",
	})
	db.AddQueryHook(dbLogger{})

	// Setup DB tables
	if err = createSchema(); err != nil {
		panic(err)
	}

	r := gin.Default()
	cfg := cors.DefaultConfig()
	cfg.AllowAllOrigins = true
	cfg.AddAllowHeaders("Authorization")
	r.Use(cors.New(cfg))

	// Register API routes
	api := r.Group("/api", auth)

	api.POST("/login", postLogin)

	api.POST("/lists", postList)

	api.GET("/lists/:id", getList)
	api.DELETE("/lists/:id", deleteList)

	api.GET("/users/:uid/lists", getUserLists)

	// Bind to port
	r.Run("localhost:8080")
}
