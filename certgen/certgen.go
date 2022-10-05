package main

import (
	"encoding/json"
	"fmt"
	"runtime"
	"syscall/js"
)

var Version = ""
var BuildId = ""

func WasmError(err error) string {
	type eType struct {
		Error string `json:"error"`
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
	js.Global().Set("GetVersion", jsGetVersion())
	js.Global().Set("ZipFiles", jsZipFiles())
	<-make(chan bool)
}

func jsPing() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Printf("invoke: Ping()\n")

		defer func() {
			recover()
		}()

		params := PingParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}
		response := Ping(params)
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

		p12Data := jsValueToByte(args[0])
		password := args[1].String()

		response, err := ImportRootCertificate(p12Data, password)
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

		response, err := CloneCertificate(jsValueToByte(args[0]))
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

		params := ExportCertificateParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}
		response, err := ExportCertificate(params)
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

		params := ZipFilesParameters{}
		if err := json.Unmarshal([]byte(args[0].String()), &params); err != nil {
			return WasmError(err)
		}
		response, err := ZipFiles(params)
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
