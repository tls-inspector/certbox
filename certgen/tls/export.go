package tls

import (
	"crypto/rand"
	"crypto/x509"
	"encoding/pem"

	pkcs12 "software.sslmate.com/src/go-pkcs12"
)

// ExportPKCS12 will generate a PKCS12 bag for the given certificate and private key.
//
// An optional issuer certificate can be specified. When included the certificate is included in the bag.
//
// A password is required. Providing an empty string will return an error.
func ExportPKCS12(certificate *Certificate, issuer *Certificate, password string) ([]byte, error) {
	caCerts := []*x509.Certificate{}
	if issuer != nil {
		caCerts = append(caCerts, issuer.x509())
	}

	return pkcs12.Encode(rand.Reader, certificate.pKey(), certificate.x509(), caCerts, password)
}

// ExportPEM will generate PEM files for the certificate and private key.
// Returns the certificate data, key data, and optional error.
//
// A password can optionally be specified. Providing an empty string will not encrypt the data.
func ExportPEM(certificate *Certificate, password string) ([]byte, []byte, error) {
	certPEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certificate.certificateDataBytes()})
	keyPEM := pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: certificate.keyDataBytes()})

	if password != "" {
		//lint:ignore SA1019 Responsability lies with user
		b, err := x509.EncryptPEMBlock(rand.Reader, "PRIVATE KEY", keyPEM, []byte(password), x509.PEMCipherAES128)
		if err != nil {
			return nil, nil, err
		}
		keyPEM = pem.EncodeToMemory(b)
	}

	return certPEM, keyPEM, nil
}
