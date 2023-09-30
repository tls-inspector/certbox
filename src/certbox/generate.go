package certbox

import (
	"github.com/tls-inspector/certbox/tls"
)

// GenerateCertificatesParameters parameters for generating a certificate
type GenerateCertificatesParameters struct {
	Requests     []tls.CertificateRequest
	ImportedRoot *tls.Certificate
}

// GenerateCertificates will generate associated keys for the given certificate requests
func GenerateCertificates(parameters GenerateCertificatesParameters) ([]tls.Certificate, error) {
	var certificates = []tls.Certificate{}
	var root tls.Certificate
	if parameters.ImportedRoot != nil {
		root = *parameters.ImportedRoot
	} else {
		for _, request := range parameters.Requests {
			if !request.IsCertificateAuthority {
				continue
			}

			cert, err := tls.GenerateCertificate(request, nil)
			if err != nil {
				return nil, err
			}
			root = *cert
			certificates = append(certificates, *cert)
		}
	}

	for _, request := range parameters.Requests {
		if request.IsCertificateAuthority {
			continue
		}

		cert, err := tls.GenerateCertificate(request, &root)
		if err != nil {
			return nil, err
		}
		certificates = append(certificates, *cert)
	}

	return certificates, nil
}
