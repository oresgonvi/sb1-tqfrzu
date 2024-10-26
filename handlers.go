package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"
)

func handleHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	tmpl, err := template.ParseFiles("templates/home.html")
	if err != nil {
		log.Printf("Failed to parse template: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := tmpl.Execute(w, nil); err != nil {
		log.Printf("Failed to execute template: %v", err)
	}
}

func handleGetRecords(w http.ResponseWriter, r *http.Request) {
	records, err := getAllRecords()
	if err != nil {
		log.Printf("Failed to get records: %v", err)
		http.Error(w, "Failed to retrieve records", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(records); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}

func handleCreateRecord(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Content string `json:"content"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if input.Content == "" {
		http.Error(w, "Content cannot be empty", http.StatusBadRequest)
		return
	}

	record := Record{
		ID:        fmt.Sprintf("%d", time.Now().UnixNano()),
		Content:   input.Content,
		CreatedAt: time.Now(),
	}

	if err := saveRecord(record); err != nil {
		log.Printf("Failed to save record: %v", err)
		http.Error(w, "Failed to save record", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(record); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}