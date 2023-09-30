//go:build !js && !wasm

package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path"
	"runtime"

	"github.com/tls-inspector/certbox"
)

func main() {
	if len(os.Args) != 2 {
		printHelpAndExit()
	}

	action := os.Args[1]

	parameterBytes := []byte{}
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		parameterBytes = append(parameterBytes, scanner.Bytes()...)
	}

	switch action {
	case ActionPing:
		ping(parameterBytes)
	case ActionImportRootCertificate:
		importRootCertificate(parameterBytes)
	case ActionCloneCertificate:
		cloneCertificate(parameterBytes)
	case ActionGenerateCertificates:
		generateCertificate(parameterBytes)
	case ActionExportCertificates:
		exportCertificates(parameterBytes)
	case ActionGetVersion:
		getVersion()
	case ActionConvertPEMtoDER:
		convertPemDer(parameterBytes)
	case ActionConvertDERtoPEM:
		convertDerPem(parameterBytes)
	default:
		fatalError("Unknown action " + action)
	}
}

func printHelpAndExit() {
	fmt.Fprint(os.Stderr, "Do not run this application directly, instead use the Certbox application\n\nAlso, Black lives matter and all cops are bastards.\n")
	os.Exit(1)
}

func fatalError(err interface{}) {
	fmt.Fprintf(os.Stderr, "%s\n", err)
	os.Exit(2)
}

func importRootCertificate(parameterBytes []byte) {
	parameters := certbox.ImportRootCertificateParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	certificate, err := certbox.ImportRootCertificate(parameters)
	if err != nil {
		fatalError(err)
	}

	json.NewEncoder(os.Stdout).Encode(certificate)
}

func cloneCertificate(parameterBytes []byte) {
	parameters := certbox.CloneCertificateParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	certificateRequest, err := certbox.CloneCertificate(parameters)
	if err != nil {
		fatalError(err)
	}

	json.NewEncoder(os.Stdout).Encode(certificateRequest)
}

func generateCertificate(parameterBytes []byte) {
	parameters := certbox.GenerateCertificatesParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	certificates, err := certbox.GenerateCertificates(parameters)
	if err != nil {
		fatalError(err)
	}

	json.NewEncoder(os.Stdout).Encode(certificates)
}

type ExportCertificatesParameters struct {
	certbox.ExportCertificatesParameters
	ExportDir string
}

func exportCertificates(parameterBytes []byte) {
	parameters := ExportCertificatesParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	files, err := certbox.ExportCertificates(parameters.ExportCertificatesParameters)
	if err != nil {
		fatalError(err)
	}

	fileNames := make([]string, len(files))

	for i, file := range files {
		os.WriteFile(path.Join(parameters.ExportDir, file.Name), file.Data, 0644)
		fileNames[i] = file.Name
	}

	json.NewEncoder(os.Stdout).Encode(fileNames)
}

type PingParameters struct {
	Nonce string
}

func ping(parameterBytes []byte) {
	parameters := PingParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	type PingResponseType struct {
		OK    bool
		Nonce string
	}

	response := PingResponseType{
		OK:    true,
		Nonce: parameters.Nonce,
	}

	json.NewEncoder(os.Stdout).Encode(response)
}

func getVersion() {
	type responseType struct {
		Version string
	}
	response := responseType{runtime.Version()[2:]}

	json.NewEncoder(os.Stdout).Encode(response)
}

func convertPemDer(parameterBytes []byte) {
	parameters := certbox.ConvertPEMtoDERParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	result, err := certbox.ConvertPEMtoDER(parameters)
	if err != nil {
		fatalError(err)
	}

	json.NewEncoder(os.Stdout).Encode(result)
}

func convertDerPem(parameterBytes []byte) {
	parameters := certbox.ConvertDERtoPEMParameters{}
	if err := json.Unmarshal(parameterBytes, &parameters); err != nil {
		fatalError(err)
	}

	result, err := certbox.ConvertDERtoPEM(parameters)
	if err != nil {
		fatalError(err)
	}

	json.NewEncoder(os.Stdout).Encode(result)
}
