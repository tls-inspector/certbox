package tls_test

import (
	"testing"

	"github.com/tls-inspector/certbox/tls"
)

func TestExportPKCS12(t *testing.T) {
	root, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	data, err := tls.ExportPKCS12(leaf, root, "12345678")
	if err != nil {
		t.Fatalf("Error generating PKCS12 export: %s", err.Error())
	}

	if len(data) == 0 {
		t.Fatalf("Empty PKCS12 data")
	}
}

func TestExportPEM(t *testing.T) {
	_, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	certData, keyData, err := tls.ExportPEM(leaf)
	if err != nil {
		t.Fatalf("Error generating PKCS12 export: %s", err.Error())
	}

	if len(certData) == 0 {
		t.Fatalf("Empty PEM certificate data")
	}

	if len(keyData) == 0 {
		t.Fatalf("Empty PEM key data")
	}
}
