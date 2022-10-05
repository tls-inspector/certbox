package tls_test

import (
	"encoding/hex"
	"strings"
	"testing"
	"time"

	"github.com/tlsinspector/certificate-factory/certgen/tls"
)

// The certificate and keys used in this file are from the known-bad 'Superfish' certificate.
// https://gist.github.com/mathiasbynens/7a13a467b22c42505490
// Thanks to Chris Palmer, Matt Burke, Karl Koscher, and Robert Graham
const superfishPassword = "komodia"

const pemCert = `-----BEGIN CERTIFICATE-----
MIIC9TCCAl6gAwIBAgIJANL8E4epRNznMA0GCSqGSIb3DQEBBQUAMFsxGDAWBgNV
BAoTD1N1cGVyZmlzaCwgSW5jLjELMAkGA1UEBxMCU0YxCzAJBgNVBAgTAkNBMQsw
CQYDVQQGEwJVUzEYMBYGA1UEAxMPU3VwZXJmaXNoLCBJbmMuMB4XDTE0MDUxMjE2
MjUyNloXDTM0MDUwNzE2MjUyNlowWzEYMBYGA1UEChMPU3VwZXJmaXNoLCBJbmMu
MQswCQYDVQQHEwJTRjELMAkGA1UECBMCQ0ExCzAJBgNVBAYTAlVTMRgwFgYDVQQD
Ew9TdXBlcmZpc2gsIEluYy4wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAOjz
Shh2Xxk/sc9Y6X9DBwmVgDXFD/5xMSeBmRImIKXfj2r8QlU57gk4idngNsSsAYJb
1Tnm+Y8HiN/+7vahFM6pdEXY/fAXVyqC4XouEpNarIrXFWPRt5tVgA9YvBxJ7SBi
3bZMpTrrHD2g/3pxptMQeDOuS8Ic/ZJKocPnQaQtAgMBAAGjgcAwgb0wDAYDVR0T
BAUwAwEB/zAdBgNVHQ4EFgQU+5izU38URC7o7tUJml4OVoaoNYgwgY0GA1UdIwSB
hTCBgoAU+5izU38URC7o7tUJml4OVoaoNYihX6RdMFsxGDAWBgNVBAoTD1N1cGVy
ZmlzaCwgSW5jLjELMAkGA1UEBxMCU0YxCzAJBgNVBAgTAkNBMQswCQYDVQQGEwJV
UzEYMBYGA1UEAxMPU3VwZXJmaXNoLCBJbmMuggkA0vwTh6lE3OcwDQYJKoZIhvcN
AQEFBQADgYEApHyg7ApKx3DEcWjzOyLi3JyN0JL+c35yK1VEmxu0Qusfr76645Oj
1IsYwpTws6a9ZTRMzST4GQvFFQra81eLqYbPbMPuhC+FCxkUF5i0DNSWi+kczJXJ
TtCqSwGl9t9JEoFqvtW+znZ9TqyLiOMw7TGEUI+88VAqW0qmXnwPcfo=
-----END CERTIFICATE-----`

const pemEncryptedKey = `-----BEGIN PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,998f7fda4f810c621b890a1eabdf0d95

MbxFc/binX6yz/2UewtL9WMOuuzNpchzHZ3eRxZVpHqLlEorofIh3AwTYbKrlnrJ
LS4aukwfGWu2LKtjWCmKnHnhLlsoacgp1gIBAcpKtGUts2507GzIJRcSV9C3zEhT
iYeNhC3zToHUwemx9LRt8rSc5Wm1iVLEbpd2pBbAFjaXC4EOfUSt+hfD0cnPxqk+
P91quc1dDeiC+MsIefvKSjgRTVopxEW4uDTqm0I3UmDq2OtvxupNY6ABYhHdfRid
yLg8jZgl8B8nn7tm2+jW1vDmHbilhBOkXOhEs2wq6opySe1RFaQQQWHGtOe11/g/
LgmNPnRcMprLk1PVaz8FwS8tO3ne8OlEHVbmqIQYY01SvGvg/R+O5As1KqDham7J
6vjOXbHFegtZXt9/cWE2vxMfbNkyPKwr1/+LWRO/tWr4f1L23bUOwkeUSpXMM7Ik
Da9DOM08P8BPfqnJ4RkY5/a+qbg4kJpKYbc4ur+6xGY69gZS5FTVOE1qqe2Snb8u
xeUR4zterbu8myTjhxt6xMsFBZHOnozQ4H1ai6PQt4JzyYN3KjUvdJ93r3+vKZth
tu7NQS4qnzhKYgNSCh+iy3L1PwavLo0a/4JzWTMQuGrPt3QjBKtGoAM1nHDWXKUR
+WSYS8+TfBsliBzy7Za+L72aD56Ndhax6YJXfX+8Dvmoeps0LKE39r/VnUP5xnvc
GpM+eNVvDxDubKmZl5hMksuZMAb/moz9dwuDP7K8TpmDCT6JQJtkOvu0f0R168qT
PrvNEPXnepTU8k6khjzyicESHFrasHMqfLqz33lkjmiNDxwC77TZ1cw8tZ4dtw/4
KICsKxSdC8TuQyBfw5A9YH+b9YIs8i7+QHW4RqcPqAgkxxLT4s37p+9WEByA5aeQ
CvZQ2G3IYJVh3x41LjKZA0/Zx0o73SIGvkIqlhC4473/Av3KMMjxpxF0IUedXG0g
4ZKI6dBNJbd78QZfSXbLU191ns0S9IvTHIZpGeWcw0ZPqVzzmj8pdBsMzu5n+Drx
zo7BLYjS1cD5vyPHLLk+q4hJSD/i6pJtJCVyNDat7RhhzUlFO5HdJmP4eFREw+lc
vfT9hYV4MW0nCAUSsb0oW6z/ZnqoHyp3+yr3M4GLTgeXUqHjxWmaDEW1rEE3V4qJ
B3ZNrA4OWPKYDXlEhqEDDB7Qg5g6gFmaIioLeroZ6xg=
-----END PRIVATE KEY-----`

const pemPlainKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDo80oYdl8ZP7HPWOl/QwcJlYA1xQ/+cTEngZkSJiCl349q/EJV
Oe4JOInZ4DbErAGCW9U55vmPB4jf/u72oRTOqXRF2P3wF1cqguF6LhKTWqyK1xVj
0bebVYAPWLwcSe0gYt22TKU66xw9oP96cabTEHgzrkvCHP2SSqHD50GkLQIDAQAB
AoGBAKepW14J7F5e0ppa8wvOcUU7neCVafKHA4rcoxBF8t+P7UhiMVfn7uQiFk2D
K8gXyKpLcEdRb7K7CI+3i8RkoXTRDEZU5XPMJnZsE5LWgNQ+pi3HwMEdR0vD2Iyv
vIH3tq6mNKgDu+vozm8DWsEP96jrhVbo1U1rzyEtX46afo79AkEA/VXanGaqj4ua
EsqfY6n/7+MTm4iPOM7qfoyI4EppJXZklc/FbcV2lAjY2Jl9U6X7WnqCPn+/zg44
6lKWTnhAawJBAOtmi6nw8WjY6uyXZosE/0r4SkSSo20EJbBCJcgdofKT+VCGB4hp
h6XwGdls0ca+qa5ZE1a196dpwwVre0hm88cCQQDrUm3QbHmw/39uRzOJs6dfYPKc
vlwz69jdFpQqrFRBjVlf4/FDx3IfjpxHj0RgiEUUxcnoXmh/8qwh1fdzCrbjAkB4
afg/chTLQUrKw5ecvW2p9+Blu20Fsv1kcDHLb/0LjU4XNrhbuz+8TlmqstOMCrPZ
j48o5+RLKvqrpxNlMeS5AkEA6qIdW/yp5N8b1j2OxYZ9u5O//BvspwRITGM60Cps
yemZE/ua8wm34SKvDHf5uxcmofShW17PLICrsLJ7P35y/A==
-----END RSA PRIVATE KEY-----`

func TestImportPEM(t *testing.T) {
	certificate, err := tls.ImportPEM([]byte(pemCert), []byte(pemEncryptedKey), superfishPassword)
	if err != nil {
		t.Fatalf("Error importing certifcate with encrypted key: %s", err.Error())
	}

	if certificate.Description() == "" {
		t.Fatal("Empty description")
	}

	certificate, err = tls.ImportPEM([]byte(pemCert), []byte(pemPlainKey), "")
	if err != nil {
		t.Fatalf("Error importing certifcate: %s", err.Error())
	}

	if certificate.Description() == "" {
		t.Fatal("Empty description")
	}
}

func TestImportPEMInvalidPassword(t *testing.T) {
	_, err := tls.ImportPEM([]byte(pemCert), []byte(pemEncryptedKey), "12345678")
	if err == nil {
		t.Errorf("No error seen when one expected for invalid PEM data")
	}
}

// Hex-encoded PKCS12 archive of the superfish certificate (see above)
// encrypted with the password: komodia
const p12Hex = `308206f1020103308206b706092a864886f70d010701a08206a8048206a4
308206a03082039f06092a864886f70d010706a08203903082038c020100
3082038506092a864886f70d010701301c060a2a864886f70d010c010630
0e040861a4fe0c01c8badc02020800808203589e0cc92ba64150bdc02317
7195d955fdd56325766336be2d93261ea3cc5749799e04f27d08d875cb30
98fae5129592950e62e80530467b917c2dd70addb4fc33d6450979697d19
7d0f95259ca61da5eac3019636ac2a238850e75e0114afe0e40770738df9
67c2237e1228deca19b49846011f60cf8523e52d7014a187295078adf950
9b237722f4f710bf9bf43ff5ef0e08075f4e9d1b215b54878259e9ce11c4
7ac997703bad92e44a376675af08c13b4af43ecb715f88994f848460ea4a
9445fa75a7b18875e1339d7e47c5a5c4d440c38ac7a5d38199b180b82373
d6a1fb1c55bad4419976144c3a1439dc71cb816316a9afe5a6cd06934453
a22dc5ed5de4e0c7727194f5d2d88ad9b6ef2c3b9c907c58300a46d75c24
1600a2f53d5e693dc099e85d06e71a92857d69078023f667d542dd7da6f7
6e988406f65937e42d8b7c662db117fefee2b7ed1113557f85d89f0751d0
2e68ee333b61aa835ef53b5dc491c0b3375f05d0b72fd10dc4aca68f334a
7c5efcc0944a9b67a23ef4cdf60e0cb64910fbb66faa8c0525c96379dc08
2cc4b811f04c8b325127b3d3afc22c911897f732a903ec569143e2350783
b467c9a8b39a9ea5ce7c2b4d6612c8b2ca24d10fde3fcd7b1aea95635608
6e5ed02576cf6e8b6a9a28b0f4750d1a9d6e37cf19de04088662acdd0e49
063664fef2a227de0b082674a02aa9ca8f6925c24bf19d2746a7f2cc742e
bca2925c6c534cb9272c86974ccfa0a14b17c7a84c505c77f1c881b2edd6
2f9f8665db402fa11730536b7dc1ab95bed617a77ea04c8e988113b6119b
4c900f9feeba77fe056b8f9a311291a1dbd15b5be19eebd9d1a048b8e9b2
4cf06aa2dae45c813dad36994075044b584cd55b2bb183e66cb6627cc039
02b44dbebd1463ffabfc013a75a083dc6bcdfb43228aa74c3f7ea31b10bc
7f4b27c4e2fc894f9651886cb99f31269fcc42a6485e4d8185cd901c0d70
ad6d9ee50dbe60c379b77766609a829ccd7fc747dfbec30531556ed02028
e462be611200b9645c5eae0383b5ae061e34ba8803341cc65d61ef93fa33
5f10215089f55bec05a017902214c7529ffe729f0b63bb795671f0ca42ce
83d0bf686df657a796b248c8e07d92c5868c7d1f151305d3fccf1ee6c8b7
2fed0a0f95115cf0a4410d26202e3ca2f5a8faa4248dbd6d27e609987472
5751fbbb13308202f906092a864886f70d010701a08202ea048202e63082
02e2308202de060b2a864886f70d010c0a0102a08202a6308202a2301c06
0a2a864886f70d010c0103300e04081df85bfea3ac818e02020800048202
808ad2dbbf1c79624edba829aa5ebd141f5659d9a90e6c76c4e463804473
b7ad733e4bc8b1b14761b4a5f89c3c6dae63d371277f6b0b20101015112a
0e8366615953714a56599aa9df47910814956e99019aaf31df432245813c
f642cfbf7d131615050b23cb61dfcb1318cd02744ead7db1594c9279a4c3
1b0cc8a7a39b74550c426a7f1311b38ebba700b5eb194b77ff1fcb8bf74d
8a2bdd0bad4bd746e04fd0214ed764ca976bdb97483ea0aaab247b193cce
639c6a32e70c7b73d5dbcf604cbb78e3d8d4b8a21609a35768649f9ae0b8
e25aed06b2ecf9fbb2e34e84c75df6040d1e9a4121edc370b205df20a535
b46c479532316f920a33d9e56772e84ae990c67ef8c955ac601e491dbe6e
04de62294268336004ff54eb302551f4921ebe34a8064057583f33652824
12a1fb341b278967a159ae3f81895b0968766965abc5f0f3ee18cd15c023
04762ef2027cea2c174726562b25faab7d6de768be6ff447c5c671a3ef07
73835775940d2f3bd75d6264f902f2e1bdb8054ec8cd00bfe3c413b91a3c
22bf991fdf05c8c5b0bca44e2afab8818804794782a9eb2acf9b097bb620
476484a06cc848b16a74f4e7b8bb35fac35915d9ce399d9f0be64d5e6aac
30891787759542452d2078ec49ae819e9f4fbf2d17d2d67ebfef336c33ec
fb116ec3911d73a33baea0cbd3d1810cc5ee7d5398270b76304840c13bf2
30f46b72b434fc63caa07199121740dc64c582982920cabe54c2eadbb7a0
eaf2604c087e2c419ad1eb3956a4cfe3f70331ec4b0a8b17c18135ca62d1
4574275568cea4e2ff146413b45a795b59ebd7c805544c7a2fb762af3553
0e068fc0a3a41f00c004fe092b50b51e79d649f563a5daa88fbee5f17b03
16010e03194bc968e6f3263125302306092a864886f70d01091531160414
c864484869d41d2b0d32319c5a62f9315aaf2cbd30313021300906052b0e
03021a05000414d5382d814a03d68dd596ea7fb636036424598c610408c8
c40046c2e4c02502020800`

func TestImportP12(t *testing.T) {
	p12Data, err := hex.DecodeString(strings.ReplaceAll(p12Hex, "\n", ""))
	if err != nil {
		panic(err)
	}

	certificate, err := tls.ImportP12(p12Data, superfishPassword)
	if err != nil {
		t.Fatalf("Error importing P12: %s", err.Error())
	}

	if certificate.Description() == "" {
		t.Fatal("Empty description")
	}
}

func TestImportInvalidPEM(t *testing.T) {
	_, err := tls.ImportPEM([]byte("FOO BAR"), []byte("FOO BAR"), "")
	if err == nil {
		t.Errorf("No error seen when one expected for invalid PEM data")
	}

	_, err = tls.ImportPEM([]byte(pemCert), []byte("FOO BAR"), "")
	if err == nil {
		t.Errorf("No error seen when one expected for invalid PEM data")
	}
}

func TestImportInvalidP12(t *testing.T) {
	_, err := tls.ImportP12([]byte(""), "")
	if err == nil {
		t.Errorf("No error seen when one expected for invalid P12 data")
	}
}

func TestImportP12InvalidPassword(t *testing.T) {
	p12Data, err := hex.DecodeString(strings.ReplaceAll(p12Hex, "\n", ""))
	if err != nil {
		panic(err)
	}

	_, err = tls.ImportP12(p12Data, "12345678")
	if err == nil {
		t.Errorf("No error seen when one expected for importing P12 with invalid password")
	}
}

func TestImportClone(t *testing.T) {
	request := tls.CertificateRequest{
		KeyType: tls.KeyTypeECDSA_256,
		Subject: tls.Name{
			Organization: "example.com",
			City:         "Vancouver",
			Province:     "British Columbia",
			Country:      "CA",
			CommonName:   "example.com Example Root",
		},
		Validity: tls.DateRange{
			NotBefore: time.Now().AddDate(-1, 0, 0),
			NotAfter:  time.Now().AddDate(20, 0, 0),
		},
		Usage: tls.KeyUsage{
			DigitalSignature: true,
			KeyEncipherment:  true,
			CRLSign:          true,
			OCSPSigning:      true,
		},
		AlternateNames: []tls.AlternateName{
			{
				Type:  tls.AlternateNameTypeDNS,
				Value: "example.com",
			},
			{
				Type:  tls.AlternateNameTypeEmail,
				Value: "foo@example.com",
			},
			{
				Type:  tls.AlternateNameTypeIP,
				Value: "127.0.0.1",
			},
			{
				Type:  tls.AlternateNameTypeURI,
				Value: "https://www.example.com",
			},
		},
		IsCertificateAuthority: true,
	}

	root, err := tls.GenerateCertificate(request, nil)
	if err != nil {
		panic(err)
	}

	cert, _, err := tls.ExportPEM(root, "")
	if err != nil {
		panic(err)
	}

	reimport, err := tls.ImportPEMCertificate(cert)
	if err != nil {
		panic(err)
	}

	clone := reimport.Clone()

	if request.KeyType != clone.KeyType {
		t.Errorf("Incorrect KeyType")
	}
	if request.Subject.Organization != clone.Subject.Organization {
		t.Errorf("Incorrect Subject.Organization")
	}
	if request.Subject.City != clone.Subject.City {
		t.Errorf("Incorrect Subject.City")
	}
	if request.Subject.Province != clone.Subject.Province {
		t.Errorf("Incorrect Subject.Province")
	}
	if request.Subject.Country != clone.Subject.Country {
		t.Errorf("Incorrect Subject.Country")
	}
	if request.Subject.CommonName != clone.Subject.CommonName {
		t.Errorf("Incorrect Subject.CommonName")
	}
	if request.Validity.NotBefore.Unix() != clone.Validity.NotBefore.Unix() {
		t.Errorf("Incorrect Validity.NotBefore")
	}
	if request.Validity.NotAfter.Unix() != clone.Validity.NotAfter.Unix() {
		t.Errorf("Incorrect Validity.NotAfter")
	}
	if request.Usage.DigitalSignature != clone.Usage.DigitalSignature {
		t.Errorf("Incorrect Usage.DigitalSignature")
	}
	if request.Usage.ContentCommitment != clone.Usage.ContentCommitment {
		t.Errorf("Incorrect Usage.ContentCommitment")
	}
	if request.Usage.KeyEncipherment != clone.Usage.KeyEncipherment {
		t.Errorf("Incorrect Usage.KeyEncipherment")
	}
	if request.Usage.DataEncipherment != clone.Usage.DataEncipherment {
		t.Errorf("Incorrect Usage.DataEncipherment")
	}
	if request.Usage.KeyAgreement != clone.Usage.KeyAgreement {
		t.Errorf("Incorrect Usage.KeyAgreement")
	}
	if request.Usage.CertSign != clone.Usage.CertSign {
		t.Errorf("Incorrect Usage.CertSign")
	}
	if request.Usage.CRLSign != clone.Usage.CRLSign {
		t.Errorf("Incorrect Usage.CRLSign")
	}
	if request.Usage.EncipherOnly != clone.Usage.EncipherOnly {
		t.Errorf("Incorrect Usage.EncipherOnly")
	}
	if request.Usage.DecipherOnly != clone.Usage.DecipherOnly {
		t.Errorf("Incorrect Usage.DecipherOnly")
	}
	if request.Usage.ServerAuth != clone.Usage.ServerAuth {
		t.Errorf("Incorrect Usage.ServerAuth")
	}
	if request.Usage.ClientAuth != clone.Usage.ClientAuth {
		t.Errorf("Incorrect Usage.ClientAuth")
	}
	if request.Usage.CodeSigning != clone.Usage.CodeSigning {
		t.Errorf("Incorrect Usage.CodeSigning")
	}
	if request.Usage.EmailProtection != clone.Usage.EmailProtection {
		t.Errorf("Incorrect Usage.EmailProtection")
	}
	if request.Usage.TimeStamping != clone.Usage.TimeStamping {
		t.Errorf("Incorrect Usage.TimeStamping")
	}
	if request.Usage.OCSPSigning != clone.Usage.OCSPSigning {
		t.Errorf("Incorrect Usage.OCSPSigning")
	}
	if request.IsCertificateAuthority != clone.IsCertificateAuthority {
		t.Errorf("Incorrect IsCertificateAuthority")
	}

	for i, requestName := range request.AlternateNames {
		cloneName := clone.AlternateNames[i]

		if requestName.Type != cloneName.Type {
			t.Errorf("Incorrect altername name Type at index %d", i)
		}
		if requestName.Value != cloneName.Value {
			t.Errorf("Incorrect altername name Value at index %d", i)
		}
	}
}
