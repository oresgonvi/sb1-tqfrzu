package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/boltdb/bolt"
)

type Record struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func getAllRecords() ([]Record, error) {
	var records []Record

	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket not found")
		}

		return b.ForEach(func(k, v []byte) error {
			var record Record
			if err := json.Unmarshal(v, &record); err != nil {
				return fmt.Errorf("failed to unmarshal record: %w", err)
			}
			records = append(records, record)
			return nil
		})
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get records: %w", err)
	}

	return records, nil
}

func saveRecord(record Record) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket not found")
		}

		encoded, err := json.Marshal(record)
		if err != nil {
			return fmt.Errorf("failed to marshal record: %w", err)
		}

		return b.Put([]byte(record.ID), encoded)
	})
}