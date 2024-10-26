package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/boltdb/bolt"
)

var (
	db     *bolt.DB
	dbPath = "data/records.db"
)

func init() {
	// Ensure data directory exists
	if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
		log.Fatal("Failed to create data directory:", err)
	}

	// Configure logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	// Initialize database
	var err error
	db, err = initDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize router
	router := setupRouter()

	// Start server
	port := ":8080"
	fmt.Printf("Server running at http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, router))
}