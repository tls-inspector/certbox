package tls

import (
	"crypto/rand"
	"crypto/x509"
	"encoding/pem"
	"fmt"

	pkcs12 "software.sslmate.com/src/go-pkcs12"
)

// ConvertPEMtoDER will concert the given PEM-encoded certificate and/or key and return them as DER-encoded.
func ConvertPEMtoDER(pemCert []byte, pemKey []byte) ([]byte, []byte, error) {
	var certDER []byte
	var keyDER []byte

	if pemCert != nil {
		certPem, _ := pem.Decode(pemCert)
		if certPem == nil {
			return nil, nil, fmt.Errorf("cert is not valid PEM")
		}
		certDER = certPem.Bytes
	}
	if pemKey != nil {
		keyPem, _ := pem.Decode(pemKey)
		if keyPem == nil {
			return nil, nil, fmt.Errorf("key is not valid PEM")
		}
		keyDER = keyPem.Bytes
	}

	return certDER, keyDER, nil
}

// ConvertDERtoPEM will concert the given DER-encoded certificate and/or key and return them as PEM-encoded.
func ConvertDERtoPEM(derCert []byte, derKey []byte) ([]byte, []byte, error) {
	var certPEM []byte
	var keyPEM []byte

	if derCert != nil {
		certPEM = pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: derCert})
		if certPEM == nil {
			return nil, nil, fmt.Errorf("cert is not valid DER")
		}
	}
	if derKey != nil {
		keyPEM = pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: derKey})
		if keyPEM == nil {
			return nil, nil, fmt.Errorf("key is not valid DER")
		}
	}

	return certPEM, keyPEM, nil
}

// ExtractPKCS12 will extract the certificate, private key, and optional CA certificate from the given PKCS12 data.
// Certificates and keys are returned using PEM encoding.
func ExtractPKCS12(p12Data []byte, password string) ([]byte, []byte, []byte, error) {
	privateKey, cert, chain, err := pkcs12.DecodeChain(p12Data, password)
	if err != nil {
		return nil, nil, nil, err
	}

	keyDER, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		return nil, nil, nil, err
	}

	certDER := cert.Raw
	var cacertPEM []byte
	if len(chain) > 0 {
		p, _, err := ConvertDERtoPEM(chain[0].Raw, nil)
		if err != nil {
			return nil, nil, nil, err
		}
		cacertPEM = p
	}

	certPEM, keyPEM, err := ConvertDERtoPEM(certDER, keyDER)
	if err != nil {
		return nil, nil, nil, err
	}

	return certPEM, keyPEM, cacertPEM, nil
}

// CreatePKCS12 will create a PKCS12 file with the given PEM-encoded certificate, private key, and optional CA certificate.
func CreatePKCS12(certBytes []byte, keyBytes []byte, caCertBytes []byte, password string) ([]byte, error) {
	certPem, _ := pem.Decode(certBytes)
	if certPem == nil {
		return nil, fmt.Errorf("invalid pem certificate")
	}
	cert, err := x509.ParseCertificate(certPem.Bytes)
	if err != nil {
		return nil, fmt.Errorf("invalid pem certificate: %s", err)
	}

	keyPem, _ := pem.Decode(keyBytes)
	if keyPem == nil {
		return nil, fmt.Errorf("invalid pem private key")
	}
	pkey, err := x509.ParsePKCS8PrivateKey(keyPem.Bytes)
	if err != nil {
		return nil, fmt.Errorf("invalid pem private key: %s", err.Error())
	}

	caCerts := []*x509.Certificate{}
	if caCertBytes != nil {
		caCertPem, _ := pem.Decode(caCertBytes)
		if caCertPem == nil {
			return nil, fmt.Errorf("invalid pem ca certificate")
		}
		caCert, err := x509.ParseCertificate(caCertPem.Bytes)
		if err != nil {
			return nil, err
		}
		caCerts = append(caCerts, caCert)
	}

	return pkcs12.Encode(rand.Reader, pkey, cert, caCerts, password)
}
