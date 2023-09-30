package certbox

import (
	"fmt"

	"github.com/tls-inspector/certbox/tls"
)

// ImportRootCertificateParameters parameters for importing a root certificate
type ImportRootCertificateParameters struct {
	Password string
	Data     []byte
}

// ImportRootCertificate will import a PKCS12 certificate and key as a root
func ImportRootCertificate(parameters ImportRootCertificateParameters) (*tls.Certificate, error) {
	certificate, err := tls.ImportP12(parameters.Data, parameters.Password)
	if err != nil {
		return nil, fmt.Errorf("error importing P12: " + err.Error())
	}

	return certificate, nil
}

// CloneCertificateParameters parameters for cloning a certificate
type CloneCertificateParameters struct {
	Data []byte
}

// CloneCertificate will return a new certificate request that clones details of the given PEM encoded certificate
func CloneCertificate(parameters CloneCertificateParameters) (*tls.CertificateRequest, error) {
	certificate, err := tls.ImportPEMCertificate(parameters.Data)
	if err != nil {
		return nil, fmt.Errorf("error importing pem cert: " + err.Error())
	}

	request := certificate.Clone()
	return &request, nil
}
