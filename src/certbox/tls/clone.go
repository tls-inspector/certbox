package tls

import (
	"crypto/ecdsa"
	"crypto/rsa"
	"crypto/x509"
	"encoding/asn1"
	"fmt"
	"time"
)

// Clone return a certificate request that would match this certificate
func (c Certificate) Clone() CertificateRequest {
	csr := CertificateRequest{}

	x := c.X509()

	algorithm := x.PublicKeyAlgorithm
	switch algorithm {
	case x509.RSA:
		publicKey := x.PublicKey.(*rsa.PublicKey)
		size := publicKey.Size()
		switch size {
		case 256:
			csr.KeyType = KeyTypeRSA_2048
		case 512:
			csr.KeyType = KeyTypeRSA_4096
		case 1024:
			csr.KeyType = KeyTypeRSA_8192
		default:
			panic(fmt.Sprintf("Unsupported RSA key length: %d", size))
		}
	case x509.ECDSA:
		publicKey := x.PublicKey.(*ecdsa.PublicKey)
		size := publicKey.Params().BitSize
		switch size {
		case 256:
			csr.KeyType = KeyTypeECDSA_256
		case 384:
			csr.KeyType = KeyTypeECDSA_384
		default:
			panic(fmt.Sprintf("Unsupported ECC curve size: %d", size))
		}
	default:
		panic(fmt.Sprintf("Unsupported public key algorithm: %d", algorithm))
	}
	csr.Subject = c.Subject
	csr.Validity = DateRange{
		NotBefore: x.NotBefore.UTC().Format(time.DateOnly),
		NotAfter:  x.NotAfter.UTC().Format(time.DateOnly),
	}
	csr.AlternateNames = []AlternateName{}

	switch x.SignatureAlgorithm {
	case x509.SHA256WithRSA, x509.ECDSAWithSHA256:
		csr.SignatureAlgorithm = SignatureAlgorithmSHA256
	case x509.SHA384WithRSA, x509.ECDSAWithSHA384:
		csr.SignatureAlgorithm = SignatureAlgorithmSHA384
	case x509.SHA512WithRSA, x509.ECDSAWithSHA512:
		csr.SignatureAlgorithm = SignatureAlgorithmSHA512
	}

	for _, dns := range x.DNSNames {
		csr.AlternateNames = append(csr.AlternateNames, AlternateName{
			Type:  AlternateNameTypeDNS,
			Value: dns,
		})
	}
	for _, email := range x.EmailAddresses {
		csr.AlternateNames = append(csr.AlternateNames, AlternateName{
			Type:  AlternateNameTypeEmail,
			Value: email,
		})
	}
	for _, ip := range x.IPAddresses {
		csr.AlternateNames = append(csr.AlternateNames, AlternateName{
			Type:  AlternateNameTypeIP,
			Value: ip.String(),
		})
	}
	for _, uri := range x.URIs {
		csr.AlternateNames = append(csr.AlternateNames, AlternateName{
			Type:  AlternateNameTypeURI,
			Value: uri.String(),
		})
	}
	csr.Usage = x509KeyUsageToInternal(x.KeyUsage, x.ExtKeyUsage)
	csr.IsCertificateAuthority = x.IsCA

	for _, ext := range x.Extensions {
		oid := ext.Id.String()
		var object any
		if _, err := asn1.Unmarshal(ext.Value, &object); err != nil {
			panic(fmt.Sprintf("Unsupported extension value for oid %s: %s", oid, err.Error()))
		}
		csr.Extensions = append(csr.Extensions, Extension{
			OID:   oid,
			Value: object,
		})
	}

	return csr
}
