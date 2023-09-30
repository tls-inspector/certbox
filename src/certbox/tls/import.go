package tls

import (
	"crypto/x509"
	"encoding/hex"
	"encoding/pem"
	"fmt"

	pkcs12 "software.sslmate.com/src/go-pkcs12"
)

// ImportPEM try to import the given PEM data as a certificate object
func ImportPEM(certData []byte, keyData []byte, password string) (*Certificate, error) {
	certPEM, _ := pem.Decode(certData)
	if certPEM == nil {
		return nil, fmt.Errorf("cert is not valid PEM")
	}
	keyPEM, _ := pem.Decode(keyData)
	if keyPEM == nil {
		return nil, fmt.Errorf("key is not valid PEM")
	}

	certificate := Certificate{
		CertificateData: hex.EncodeToString(certPEM.Bytes),
	}

	certificate.Serial = certificate.X509().Subject.SerialNumber
	certificate.CertificateAuthority = certificate.X509().IsCA
	certificate.Subject = nameFromPkix(certificate.X509().Subject)

	if password != "" {
		//lint:ignore SA1019 Responsability lies with user
		key, err := x509.DecryptPEMBlock(keyPEM, []byte(password))
		if err != nil {
			return nil, err
		}
		certificate.KeyData = hex.EncodeToString(key)
	} else {
		certificate.KeyData = hex.EncodeToString(keyPEM.Bytes)
	}

	return &certificate, nil
}

// ImportPEMCertificate try to import the given PEM certificate only
func ImportPEMCertificate(certData []byte) (*Certificate, error) {
	certPEM, _ := pem.Decode(certData)
	if certPEM == nil {
		return nil, fmt.Errorf("cert is not valid PEM")
	}

	certificate := Certificate{
		CertificateData: hex.EncodeToString(certPEM.Bytes),
	}

	certificate.Serial = certificate.X509().Subject.SerialNumber
	certificate.CertificateAuthority = certificate.X509().IsCA
	certificate.Subject = nameFromPkix(certificate.X509().Subject)

	return &certificate, nil
}

// ImportP12 try to import the given P12 data as a certificate object
func ImportP12(p12Data []byte, password string) (*Certificate, error) {
	privateKey, xCert, err := pkcs12.Decode(p12Data, password)
	if err != nil {
		return nil, err
	}

	pkeyBytes, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		return nil, err
	}

	certificate := Certificate{
		CertificateData: hex.EncodeToString(xCert.Raw),
		KeyData:         hex.EncodeToString(pkeyBytes),
	}
	certificate.Serial = certificate.X509().Subject.SerialNumber
	certificate.CertificateAuthority = certificate.X509().IsCA
	certificate.Subject = nameFromPkix(certificate.X509().Subject)

	return &certificate, nil
}
