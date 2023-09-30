package tls_test

import (
	"bytes"
	"crypto/x509"
	"testing"

	"github.com/tls-inspector/certbox/tls"
)

func TestConvertPEMtoDER(t *testing.T) {
	t.Parallel()

	_, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	certPEM, keyPEM, err := tls.ExportPEM(leaf)
	if err != nil {
		t.Fatalf("Error exporting certificate as PEM: %s", err.Error())
	}

	certDER, keyDER, err := tls.ConvertPEMtoDER(certPEM, keyPEM)
	if err != nil {
		t.Fatalf("Error converting PEM to DER: %s", err.Error())
	}

	if _, err := x509.ParseCertificate(certDER); err != nil {
		t.Fatalf("Invalid DER certificate returned: %s", err.Error())
	}
	if keyDER == nil {
		t.Fatalf("No DER key returned")
	}
}

func TestConvertDERtoPEM(t *testing.T) {
	t.Parallel()

	_, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	certDER, keyDER, err := tls.ExportDER(leaf)
	if err != nil {
		t.Fatalf("Error exporting certificate as DER: %s", err.Error())
	}

	certPEM, keyPEM, err := tls.ConvertDERtoPEM(certDER, keyDER)
	if err != nil {
		t.Fatalf("Error converting DER to PEm: %s", err.Error())
	}

	newLeaf, err := tls.ImportPEM(certPEM, keyPEM, "")
	if err != nil {
		t.Fatalf("invalid PEM: %s", err.Error())
	}
	if !bytes.Equal(newLeaf.X509().Raw, leaf.X509().Raw) {
		t.Fatalf("leaf certificate does not match")
	}
}

func TestExtractPKCS12(t *testing.T) {
	t.Parallel()

	root, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	p12, err := tls.ExportPKCS12(leaf, root, "1234")
	if err != nil {
		t.Fatalf("Error exporting as PKCS12: %s", err.Error())
	}

	certPEM, keyPEM, cacertPEM, err := tls.ExtractPKCS12(p12, "1234")
	if err != nil {
		t.Fatalf("Error extracting PKCS12: %s", err.Error())
	}

	newLeaf, err := tls.ImportPEM(certPEM, keyPEM, "")
	if err != nil {
		t.Fatalf("invalid PEM: %s", err.Error())
	}
	if !bytes.Equal(newLeaf.X509().Raw, leaf.X509().Raw) {
		t.Fatalf("leaf certificate does not match")
	}

	newRoot, err := tls.ImportPEM(cacertPEM, keyPEM, "")
	if err != nil {
		t.Fatalf("invalid PEM: %s", err.Error())
	}
	if !bytes.Equal(newRoot.X509().Raw, root.X509().Raw) {
		t.Fatalf("root certificate does not match")
	}
}

func TestCreatePKCS12(t *testing.T) {
	t.Parallel()

	root, leaf, err := generateCertificateChain()
	if err != nil {
		t.Fatalf("Error generating certificate: %s", err.Error())
	}

	rootPEM, _, err := tls.ExportPEM(root)
	if err != nil {
		t.Fatalf("Error exporting certificate as PEM: %s", err.Error())
	}
	leafCertPEM, leafKeyPEM, err := tls.ExportPEM(leaf)
	if err != nil {
		t.Fatalf("Error exporting certificate as PEM: %s", err.Error())
	}

	p12, err := tls.CreatePKCS12(leafCertPEM, leafKeyPEM, rootPEM, "1234")
	if err != nil {
		t.Fatalf("Error creating PKCS12: %s", err.Error())
	}

	certPEM, keyPEM, cacertPEM, err := tls.ExtractPKCS12(p12, "1234")
	if err != nil {
		t.Fatalf("Error extracting PKCS12: %s", err.Error())
	}

	newLeaf, err := tls.ImportPEM(certPEM, keyPEM, "")
	if err != nil {
		t.Fatalf("invalid PEM: %s", err.Error())
	}
	if !bytes.Equal(newLeaf.X509().Raw, leaf.X509().Raw) {
		t.Fatalf("leaf certificate does not match")
	}

	newRoot, err := tls.ImportPEM(cacertPEM, keyPEM, "")
	if err != nil {
		t.Fatalf("invalid PEM: %s", err.Error())
	}
	if !bytes.Equal(newRoot.X509().Raw, root.X509().Raw) {
		t.Fatalf("root certificate does not match")
	}
}
