package main

import (
	"encoding/json"
	"os"
	"runtime"
)

func getVersion() {
	type responseType struct {
		Version string
	}
	response := responseType{runtime.Version()[2:]}

	json.NewEncoder(os.Stdout).Encode(response)
}
