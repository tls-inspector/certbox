package main

var Version = ""
var BuildId = ""

// Possible actions
const (
	ActionPing                  = "PING"
	ActionImportRootCertificate = "IMPORT_ROOT_CERTIFICATE"
	ActionCloneCertificate      = "CLONE_CERTIFICATE"
	ActionGenerateCertificates  = "GENERATE_CERTIFICATES"
	ActionExportCertificates    = "EXPORT_CERTIFICATES"
	ActionGetVersion            = "GET_VERSION"
	ActionConvertPEMtoDER       = "CONVERT_PEM_DER"
	ActionConvertDERtoPEM       = "CONVERT_DER_PEM"
	ActionExtractPKCS12         = "EXTRACT_P12"
	ActionCreatePKCS12          = "CREATE_PKCS12"
)
