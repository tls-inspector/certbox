package main

import (
	"archive/zip"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"runtime"
	"strings"
	"syscall/js"

	"github.com/tls-inspector/certbox-go"
)

var Version = ""
var BuildId = ""

func WasmError(err error) string {
	type eType struct {
		Error string
	}

	data, _ := json.Marshal(eType{err.Error()})
	return string(data)
}

func main() {
	fmt.Printf("go wasm loaded: version='%s' build_id='%s'\n", Version, BuildId)
	js.Global().Set("Ping", jsPing())
	js.Global().Set("ImportRootCertificate", jsImportRootCertificate())
	js.Global().Set("CloneCertificate", jsCloneCertificate())
	js.Global().Set("ExportCertificate", jsExportCertificate())
	js.Global().Set("ZipFiles", jsZipFiles())
	<-make(chan bool)
}

func jsPing() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: Ping()\n")

		defer func() {
			recover()
		}()

		type PingParameters struct {
			Nonce string
		}

		params := PingParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}
		type PingResponseType struct {
			OK    bool
			Nonce string
		}

		response := PingResponseType{
			OK:    true,
			Nonce: params.Nonce,
		}
		data, err := json.Marshal(response)
		if err != nil {
			return WasmError(err)
		}
		return string(data)
	})
}

func jsImportRootCertificate() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: ImportRootCertificate()\n")

		defer func() {
			recover()
		}()

		parameters := certbox.ImportRootCertificateParameters{
			Password: args[1].String(),
			Data:     jsValueToByte(args[0]),
		}
		response, err := certbox.ImportRootCertificate(parameters)
		if err != nil {
			return WasmError(err)
		}
		data, err := json.Marshal(response)
		if err != nil {
			return WasmError(err)
		}
		return string(data)
	})
}

func jsCloneCertificate() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: CloneCertificate()\n")

		defer func() {
			recover()
		}()

		parameters := certbox.CloneCertificateParameters{
			Data: jsValueToByte(args[0]),
		}
		response, err := certbox.CloneCertificate(parameters)
		if err != nil {
			return WasmError(err)
		}
		data, err := json.Marshal(response)
		if err != nil {
			return WasmError(err)
		}
		return string(data)
	})
}

func jsExportCertificate() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: ExportCertificate()\n")

		defer func() {
			recover()
		}()

		params := certbox.ExportCertificatesParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}
		response, err := certbox.ExportCertificates(params)
		if err != nil {
			return WasmError(err)
		}
		data, err := json.Marshal(response)
		if err != nil {
			return WasmError(err)
		}
		return string(data)
	})
}

func jsGetVersion() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: GetVersion()\n")

		return runtime.Version()[2:]
	})
}

func jsZipFiles() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: ZipFiles()\n")

		defer func() {
			recover()
		}()

		type ZipFilesParameters struct {
			Files []certbox.ExportedCertificate
		}

		type ExportedFile struct {
			Name string
			Mime string
			Data string
		}

		type ZipFilesResponse struct {
			File ExportedFile
		}

		params := ZipFilesParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}

		fileName := strings.Split(params.Files[0].Name, ".")[0] + ".zip"

		buf := &bytes.Buffer{}
		zw := zip.NewWriter(buf)
		for _, file := range params.Files {
			zf, err := zw.Create(file.Name)
			if err != nil {
				return WasmError(err)
			}
			zf.Write([]byte(file.Data))
		}
		zw.Flush()
		zw.Close()

		response := ZipFilesResponse{
			File: ExportedFile{
				Name: fileName,
				Data: base64.StdEncoding.EncodeToString(buf.Bytes()),
			},
		}

		data, err := json.Marshal(response)
		if err != nil {
			return WasmError(err)
		}
		return string(data)
	})
}

func jsValueToByte(v js.Value) []byte {
	length := v.Length()
	data := make([]byte, length)
	for i := 0; i < length; i++ {
		data[i] = byte(v.Index(i).Int())
	}
	return data
}
