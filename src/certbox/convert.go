package certbox

import "github.com/tls-inspector/certbox/tls"

type ConvertPEMtoDERParameters struct {
	Cert []byte
	Key  []byte
}

type ConvertPEMtoDERResult struct {
	Cert []byte
	Key  []byte
}

// ConvertPEMtoDER will concert the given PEM-encoded certificate and/or key and return them as DER-encoded.
func ConvertPEMtoDER(parameters ConvertPEMtoDERParameters) (*ConvertPEMtoDERResult, error) {
	cert, key, err := tls.ConvertPEMtoDER(parameters.Cert, parameters.Key)
	if err != nil {
		return nil, err
	}
	return &ConvertPEMtoDERResult{cert, key}, nil
}

type ConvertDERtoPEMParameters struct {
	Cert []byte
	Key  []byte
}

type ConvertDERtoPEMResult struct {
	Cert []byte
	Key  []byte
}

// ConvertDERtoPEM will concert the given DER-encoded certificate and/or key and return them as PEM-encoded.
func ConvertDERtoPEM(parameters ConvertDERtoPEMParameters) (*ConvertDERtoPEMResult, error) {
	cert, key, err := tls.ConvertDERtoPEM(parameters.Cert, parameters.Key)
	if err != nil {
		return nil, err
	}
	return &ConvertDERtoPEMResult{cert, key}, nil
}

type ExtractPKCS12Parameters struct {
	Data     []byte
	Password string
}

type ExtractPKCS12Result struct {
	Cert   []byte
	Key    []byte
	CACert []byte
}

// ExtractPKCS12 will extract the certificate, private key, and optional CA certificate from the given PKCS12 data
func ExtractPKCS12(parameters ExtractPKCS12Parameters) (*ExtractPKCS12Result, error) {
	cert, key, cacert, err := tls.ExtractPKCS12(parameters.Data, parameters.Password)
	if err != nil {
		return nil, err
	}
	return &ExtractPKCS12Result{cert, key, cacert}, nil
}

type CreatePKCS12Parameters struct {
	Cert     []byte
	Key      []byte
	CACert   []byte
	Password string
}

type CreatePKCS12Result struct {
	Data []byte
}

// CreatePKCS12 will create a PKCS12 file with the given certificate, private key, and optional CA certificate.
func CreatePKCS12(parameters CreatePKCS12Parameters) (*CreatePKCS12Result, error) {
	data, err := tls.CreatePKCS12(parameters.Cert, parameters.Key, parameters.CACert, parameters.Password)
	if err != nil {
		return nil, err
	}
	return &CreatePKCS12Result{data}, nil
}
