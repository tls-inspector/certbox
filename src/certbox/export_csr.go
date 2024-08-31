package certbox

import (
	"github.com/tls-inspector/certbox/tls"
)

// ExportCSRParameters describes the parameters for exporting a certificate
type ExportCSRParameters struct {
	Request tls.CertificateRequest
}

// ExportedCSR describes the response from exporting a certificate
type ExportedCSR struct {
	Name string
	Data []byte
}

// ExportCSR will generate appropriate files for the given certificates
func ExportCSR(parameters ExportCSRParameters) ([]ExportedCSR, error) {
	csrData, keyData, err := tls.ExportCSR(&parameters.Request)
	if err != nil {
		return nil, err
	}

	return []ExportedCSR{
		{
			Name: filenameSafeString(parameters.Request.Subject.CommonName) + ".csr",
			Data: csrData,
		},
		{
			Name: filenameSafeString(parameters.Request.Subject.CommonName) + ".key",
			Data: keyData,
		},
	}, nil
}
