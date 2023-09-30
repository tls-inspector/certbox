package certbox

import (
	"fmt"

	"github.com/tls-inspector/certbox/tls"
)

// Export formats
const (
	FormatPEM = "PEM"
	FormatP12 = "PKCS12"
	FormatDER = "DER"
)

// ExportCertificatesParameters describes the parameters for exporting a certificate
type ExportCertificatesParameters struct {
	Certificates []tls.Certificate
	Format       string
	Password     string
}

// ExportedCertificate describes the response from exporting a certificate
type ExportedCertificate struct {
	Name string
	Data []byte
}

// ExportCertificates will generate appropriate files for the given certificates
func ExportCertificates(parameters ExportCertificatesParameters) ([]ExportedCertificate, error) {
	var root *tls.Certificate
	for _, certificate := range parameters.Certificates {
		if !certificate.X509().IsCA {
			continue
		}
		root = &certificate
	}

	exportedCertificates := []ExportedCertificate{}

	for _, certificate := range parameters.Certificates {
		switch parameters.Format {
		case FormatPEM:
			certData, keyData, err := tls.ExportPEM(&certificate)
			if err != nil {
				return nil, err
			}

			exportedCertificates = append(exportedCertificates, []ExportedCertificate{
				{
					Name: filenameSafeString(certificate.Subject.CommonName) + "_" + certificate.Serial[0:8] + ".crt",
					Data: certData,
				},
				{
					Name: filenameSafeString(certificate.Subject.CommonName) + "_" + certificate.Serial[0:8] + ".key",
					Data: keyData,
				},
			}...)
		case FormatDER:
			certData, keyData, err := tls.ExportDER(&certificate)
			if err != nil {
				return nil, err
			}

			exportedCertificates = append(exportedCertificates, []ExportedCertificate{
				{
					Name: filenameSafeString(certificate.Subject.CommonName) + "_" + certificate.Serial[0:8] + ".crt",
					Data: certData,
				},
				{
					Name: filenameSafeString(certificate.Subject.CommonName) + "_" + certificate.Serial[0:8] + ".key",
					Data: keyData,
				},
			}...)
		case FormatP12:
			var ca *tls.Certificate
			if !certificate.CertificateAuthority {
				ca = root
			}

			p12Data, err := tls.ExportPKCS12(&certificate, ca, parameters.Password)
			if err != nil {
				return nil, err
			}

			exportedCertificates = append(exportedCertificates, ExportedCertificate{
				Name: filenameSafeString(certificate.Subject.CommonName) + "_" + certificate.Serial[0:8] + ".p12",
				Data: p12Data,
			})
		default:
			return nil, fmt.Errorf("unknown export format %s", parameters.Format)
		}
	}

	return exportedCertificates, nil
}
