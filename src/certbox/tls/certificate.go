package tls

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"encoding/hex"
	"fmt"
	"math/big"
	"net"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// Name describes a X.509 name object
type Name struct {
	Organization string
	City         string
	Province     string
	Country      string
	CommonName   string
}

func (n Name) pkix() pkix.Name {
	name := pkix.Name{
		CommonName: n.CommonName,
	}
	if n.Country != "" {
		name.Country = []string{n.Country}
	}
	if n.Organization != "" {
		name.Organization = []string{n.Organization}
	}
	if n.City != "" {
		name.Locality = []string{n.City}
	}
	if n.Province != "" {
		name.Province = []string{n.Province}
	}
	return name
}

func nameFromPkix(p pkix.Name) Name {
	n := Name{
		CommonName: p.CommonName,
	}

	if len(p.Organization) > 0 {
		n.Organization = p.Organization[0]
	}

	if len(p.Locality) > 0 {
		n.City = p.Locality[0]
	}

	if len(p.Province) > 0 {
		n.Province = p.Province[0]
	}

	if len(p.Country) > 0 {
		n.Country = p.Country[0]
	}

	return n
}

// DateRange describes a date range. Values must be in YYYY-mm-DD (2006-01-02) format and the time is always fixed to
// 00:00:00UTC. Dates can be in the future or past, but the NotBefore date must always be before the NotAfter.
type DateRange struct {
	NotBefore string
	NotAfter  string
}

func (d DateRange) dates() (*time.Time, *time.Time, error) {
	notBefore, err := time.ParseInLocation(time.DateOnly, strings.Split(d.NotBefore, "T")[0], time.UTC)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid notBefore: %s", err.Error())
	}

	notAfter, err := time.ParseInLocation(time.DateOnly, strings.Split(d.NotAfter, "T")[0], time.UTC)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid not After: %s", err.Error())
	}

	return &notBefore, &notAfter, nil
}

func (d DateRange) mustDates() (time.Time, time.Time) {
	nb, na, err := d.dates()
	if err != nil {
		panic(err.Error())
	}
	return *nb, *na
}

// IsValid is the values of the date range valid
func (d DateRange) IsValid() bool {
	nb, na, err := d.dates()
	if err != nil {
		return false
	}
	notBefore := *nb
	notAfter := *na

	return notBefore.Before(notAfter)
}

const (
	// AlternateNameTypeDNS enum value for DNS type alternate names
	AlternateNameTypeDNS = "dns"
	// AlternateNameTypeEmail enum value for Email type alternate names
	AlternateNameTypeEmail = "email"
	// AlternateNameTypeIP enum value for IP type alternate names
	AlternateNameTypeIP = "ip"
	// AlternateNameTypeURI enum value for URI type alternate names
	AlternateNameTypeURI = "uri"
)

// AlternateName describes an alternate name
type AlternateName struct {
	Type  string
	Value string
}

// KeyUsage describes usage properties for an X.509 key
type KeyUsage struct {
	// Basic
	DigitalSignature  bool
	ContentCommitment bool
	KeyEncipherment   bool
	DataEncipherment  bool
	KeyAgreement      bool
	CertSign          bool
	CRLSign           bool
	EncipherOnly      bool
	DecipherOnly      bool

	// Extended
	ServerAuth      bool
	ClientAuth      bool
	CodeSigning     bool
	EmailProtection bool
	TimeStamping    bool
	OCSPSigning     bool
	CustomEKUs      []string
}

func (u KeyUsage) usage() x509.KeyUsage {
	var usage x509.KeyUsage

	if u.DigitalSignature {
		usage = usage | x509.KeyUsageDigitalSignature
	}
	if u.ContentCommitment {
		usage = usage | x509.KeyUsageContentCommitment
	}
	if u.KeyEncipherment {
		usage = usage | x509.KeyUsageKeyEncipherment
	}
	if u.DataEncipherment {
		usage = usage | x509.KeyUsageDataEncipherment
	}
	if u.KeyAgreement {
		usage = usage | x509.KeyUsageKeyAgreement
	}
	if u.CertSign {
		usage = usage | x509.KeyUsageCertSign
	}
	if u.CRLSign {
		usage = usage | x509.KeyUsageCRLSign
	}
	if u.EncipherOnly {
		usage = usage | x509.KeyUsageEncipherOnly
	}
	if u.DecipherOnly {
		usage = usage | x509.KeyUsageDecipherOnly
	}

	return usage
}

func (u KeyUsage) extendedUsage() []x509.ExtKeyUsage {
	usage := []x509.ExtKeyUsage{}
	if u.ServerAuth {
		usage = append(usage, x509.ExtKeyUsageServerAuth)
	}
	if u.ClientAuth {
		usage = append(usage, x509.ExtKeyUsageClientAuth)
	}
	if u.CodeSigning {
		usage = append(usage, x509.ExtKeyUsageCodeSigning)
	}
	if u.EmailProtection {
		usage = append(usage, x509.ExtKeyUsageEmailProtection)
	}
	if u.TimeStamping {
		usage = append(usage, x509.ExtKeyUsageTimeStamping)
	}
	if u.OCSPSigning {
		usage = append(usage, x509.ExtKeyUsageOCSPSigning)
	}
	return usage
}

func (u KeyUsage) customExtendedUsage() ([]asn1.ObjectIdentifier, error) {
	usage := make([]asn1.ObjectIdentifier, len(u.CustomEKUs))
	for i, oidStr := range u.CustomEKUs {
		parts := strings.Split(oidStr, ".")
		val := make([]int, len(parts))
		for j, part := range parts {
			id, err := strconv.Atoi(part)
			if err != nil {
				return nil, fmt.Errorf("invalid custom eku at index %d", i)
			}
			val[j] = id
		}
		usage[i] = asn1.ObjectIdentifier(val)
	}
	return usage, nil
}

func x509KeyUsageToInternal(usage x509.KeyUsage, eku []x509.ExtKeyUsage) (u KeyUsage) {
	u.DigitalSignature = usage&x509.KeyUsageDigitalSignature != 0
	u.ContentCommitment = usage&x509.KeyUsageContentCommitment != 0
	u.KeyEncipherment = usage&x509.KeyUsageKeyEncipherment != 0
	u.DataEncipherment = usage&x509.KeyUsageDataEncipherment != 0
	u.KeyAgreement = usage&x509.KeyUsageKeyAgreement != 0
	u.CertSign = usage&x509.KeyUsageCertSign != 0
	u.CRLSign = usage&x509.KeyUsageCRLSign != 0
	u.EncipherOnly = usage&x509.KeyUsageEncipherOnly != 0
	u.DecipherOnly = usage&x509.KeyUsageDecipherOnly != 0

	for _, ku := range eku {
		switch ku {
		case x509.ExtKeyUsageServerAuth:
			u.ServerAuth = true
		case x509.ExtKeyUsageClientAuth:
			u.ClientAuth = true
		case x509.ExtKeyUsageCodeSigning:
			u.CodeSigning = true
		case x509.ExtKeyUsageEmailProtection:
			u.EmailProtection = true
		case x509.ExtKeyUsageTimeStamping:
			u.TimeStamping = true
		case x509.ExtKeyUsageOCSPSigning:
			u.OCSPSigning = true
		}
	}
	return
}

const (
	// RSA with a 2048-bit key
	KeyTypeRSA_2048 = "rsa2048"
	// RSA with a 4096-bit key
	KeyTypeRSA_4096 = "rsa4096"
	// RSA with a 8192-bit key
	KeyTypeRSA_8192 = "rsa8192"
	// ECDSA with a 256-bit curve
	KeyTypeECDSA_256 = "ecc256"
	// ECDSA with a 394-bit curve
	KeyTypeECDSA_384 = "ecc384"
)

const (
	// SHA 256
	SignatureAlgorithmSHA256 = "sha256"
	// SHA 348
	SignatureAlgorithmSHA384 = "sha384"
	// SHA 512
	SignatureAlgorithmSHA512 = "sha512"
)

// CertificateRequest describes a certificate request
type CertificateRequest struct {
	KeyType                string
	SignatureAlgorithm     string
	Subject                Name
	Validity               DateRange
	AlternateNames         []AlternateName
	Usage                  KeyUsage
	IsCertificateAuthority bool
	StatusProviders        StatusProviders
}

// StatusProviders describes providers for certificate status
type StatusProviders struct {
	CRL  *string
	OCSP *string
}

// Certificate describes a certificate
type Certificate struct {
	Serial               string
	Subject              Name
	CertificateAuthority bool
	CertificateData      string
	KeyData              string
}

func (c Certificate) certificateDataBytes() []byte {
	data, err := hex.DecodeString(c.CertificateData)
	if err != nil {
		panic(err)
	}
	return data
}

func (c Certificate) keyDataBytes() []byte {
	data, err := hex.DecodeString(c.KeyData)
	if err != nil {
		panic(err)
	}
	return data
}

// Description return a script description of the certificate
func (c Certificate) Description() string {
	return fmt.Sprintf("%v", nameFromPkix(c.X509().Subject))
}

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

	return csr
}

// x509 return the x509.Certificate data structure for this certificate (reading from the
// CertificateData bytes). This will panic on an error, but that shouldn't happen unless
// CertificateData was corrupted.
func (c Certificate) X509() *x509.Certificate {
	x, err := x509.ParseCertificate(c.certificateDataBytes())
	if err != nil {
		panic(err)
	}
	return x
}

// pKey return the crypto.PrivateKey structure for this certificate (reading from the KeyData bytes).
// This will panic on an error, but that shouldn't happen unless KeyData was corrupted.
func (c Certificate) PKey() crypto.PrivateKey {
	k, err := x509.ParsePKCS8PrivateKey(c.keyDataBytes())
	if err != nil {
		panic(err)
	}
	return k
}

// GenerateCertificate will generate a certificate from the given certificate request
func GenerateCertificate(request CertificateRequest, issuer *Certificate) (*Certificate, error) {
	var pKey crypto.PrivateKey
	var err error

	switch request.KeyType {
	case KeyTypeRSA_2048:
		pKey, err = generateRSAKey(2048)
	case KeyTypeRSA_4096:
		pKey, err = generateRSAKey(4096)
	case KeyTypeRSA_8192:
		pKey, err = generateRSAKey(8192)
	case KeyTypeECDSA_256:
		pKey, err = generateECDSAKey(elliptic.P256())
	case KeyTypeECDSA_384:
		pKey, err = generateECDSAKey(elliptic.P384())
	default:
		return nil, fmt.Errorf("invalid key type")
	}
	if err != nil {
		return nil, err
	}
	pub := pKey.(crypto.Signer).Public()
	serial, err := randomSerialNumber()
	if err != nil {
		return nil, err
	}

	pKeyBytes, err := x509.MarshalPKCS8PrivateKey(pKey)
	if err != nil {
		return nil, err
	}

	publicKeyBytes, err := x509.MarshalPKIXPublicKey(pub)
	if err != nil {
		return nil, err
	}
	subjectKeyId := sha1.Sum(publicKeyBytes)

	var authorityKeyId [20]byte
	if issuer != nil {
		issuerPublicKey := issuer.PKey().(crypto.Signer).Public()
		issuerPublicKeyBytes, err := x509.MarshalPKIXPublicKey(issuerPublicKey)
		if err != nil {
			return nil, err
		}
		authorityKeyId = sha1.Sum(issuerPublicKeyBytes)
	}

	var signatureAlgorithm x509.SignatureAlgorithm
	switch request.KeyType {
	case KeyTypeRSA_2048, KeyTypeRSA_4096, KeyTypeRSA_8192:
		switch request.SignatureAlgorithm {
		case SignatureAlgorithmSHA256:
			signatureAlgorithm = x509.SHA256WithRSA
		case SignatureAlgorithmSHA384:
			signatureAlgorithm = x509.SHA384WithRSA
		case SignatureAlgorithmSHA512:
			signatureAlgorithm = x509.SHA512WithRSA
		default:
			return nil, fmt.Errorf("invalid signature algorithm")
		}
	case KeyTypeECDSA_256, KeyTypeECDSA_384:
		switch request.SignatureAlgorithm {
		case SignatureAlgorithmSHA256:
			signatureAlgorithm = x509.ECDSAWithSHA256
		case SignatureAlgorithmSHA384:
			signatureAlgorithm = x509.ECDSAWithSHA384
		case SignatureAlgorithmSHA512:
			signatureAlgorithm = x509.ECDSAWithSHA512
		default:
			return nil, fmt.Errorf("invalid signature algorithm")
		}
	}

	certificate := Certificate{
		Serial:               serial.String(),
		CertificateAuthority: issuer == nil,
		KeyData:              hex.EncodeToString(pKeyBytes),
		Subject:              request.Subject,
	}

	customEku, err := request.Usage.customExtendedUsage()
	if err != nil {
		return nil, err
	}

	notBefore, notAfter := request.Validity.mustDates()

	tpl := &x509.Certificate{
		SerialNumber:          serial,
		Subject:               request.Subject.pkix(),
		NotBefore:             notBefore,
		NotAfter:              notAfter,
		KeyUsage:              request.Usage.usage(),
		BasicConstraintsValid: true,
		SubjectKeyId:          subjectKeyId[:],
		ExtKeyUsage:           request.Usage.extendedUsage(),
		UnknownExtKeyUsage:    customEku,
		SignatureAlgorithm:    signatureAlgorithm,
		IsCA:                  request.IsCertificateAuthority,
	}

	if issuer != nil {
		tpl.Issuer = issuer.X509().Subject
		tpl.AuthorityKeyId = authorityKeyId[:]
	}

	for _, name := range request.AlternateNames {
		if len(name.Value) == 0 {
			return nil, fmt.Errorf("empty alternate name value")
		}

		switch name.Type {
		case AlternateNameTypeDNS:
			if name.Value == " " {
				return nil, fmt.Errorf("invalid dns name value")
			}
			tpl.DNSNames = append(tpl.DNSNames, name.Value)
		case AlternateNameTypeEmail:
			tpl.EmailAddresses = append(tpl.EmailAddresses, name.Value)
		case AlternateNameTypeIP:
			ip := net.ParseIP(name.Value)
			if ip == nil {
				return nil, fmt.Errorf("invalid ip address %s", name.Value)
			}
			tpl.IPAddresses = append(tpl.IPAddresses, ip)
		case AlternateNameTypeURI:
			u, err := url.Parse(name.Value)
			if err != nil {
				return nil, err
			}
			tpl.URIs = append(tpl.URIs, u)
		default:
			return nil, fmt.Errorf("unknown alternate name type")
		}
	}

	var certBytes []byte
	if issuer == nil {
		certBytes, err = x509.CreateCertificate(rand.Reader, tpl, tpl, pub, pKey)
		if err != nil {
			return nil, err
		}
	} else {
		certBytes, err = x509.CreateCertificate(rand.Reader, tpl, issuer.X509(), pub, issuer.PKey())
		if err != nil {
			return nil, err
		}
	}

	certificate.CertificateData = hex.EncodeToString(certBytes)
	return &certificate, nil
}

func randomSerialNumber() (*big.Int, error) {
	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	return rand.Int(rand.Reader, serialNumberLimit)
}

func generateRSAKey(length int) (crypto.PrivateKey, error) {
	return rsa.GenerateKey(rand.Reader, length)
}

func generateECDSAKey(curve elliptic.Curve) (crypto.PrivateKey, error) {
	return ecdsa.GenerateKey(curve, rand.Reader)
}
