package main

import (
	"github.com/tlsinspector/certificate-factory/certgen/tls"
)

type ImportCertificateParameters struct {
	Data     []uint8 `json:"data"`
	Password string  `json:"password"`
}

type ImportCertificateResponse struct {
	Certificate tls.Certificate `json:"certificate"`
}

func ImportRootCertificate(data []byte, password string) (*ImportCertificateResponse, error) {
	certificate, err := tls.ImportP12(data, password)
	if err != nil {
		return nil, err
	}

	return &ImportCertificateResponse{
		Certificate: *certificate,
	}, nil
}

type CloneCertificateParameters struct {
	Data string `json:"data"`
}

type CloneCertificateResponse struct {
	Certificate tls.CertificateRequest `json:"certificate"`
}

func CloneCertificate(data []byte) (*CloneCertificateResponse, error) {
	certificate, err := tls.ImportPEMCertificate(data)
	if err != nil {
		return nil, err
	}

	return &CloneCertificateResponse{
		Certificate: certificate.Clone(),
	}, nil
}
