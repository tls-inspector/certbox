package tls_test

import (
	"testing"
	"time"

	"github.com/tls-inspector/certbox/tls"
)

const rsa2048cert = `-----BEGIN CERTIFICATE-----
MIIDgTCCAmmgAwIBAgIRALHOXoJa5PiUzBoUGGVFtS4wDQYJKoZIhvcNAQELBQAw
WjEQMA4GA1UEBhMHRXhhbXBsZTEQMA4GA1UECBMHRXhhbXBsZTEQMA4GA1UEBxMH
RXhhbXBsZTEQMA4GA1UEChMHRXhhbXBsZTEQMA4GA1UEAxMHRXhhbXBsZTAeFw0y
MjA1MjYwMDAwMDBaFw0yMzA1MjYyMzU5NTlaMFoxEDAOBgNVBAYTB0V4YW1wbGUx
EDAOBgNVBAgTB0V4YW1wbGUxEDAOBgNVBAcTB0V4YW1wbGUxEDAOBgNVBAoTB0V4
YW1wbGUxEDAOBgNVBAMTB0V4YW1wbGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQDFMg9o1I36aXb1/QE7xbbB8SpgvsJBGCgu5b63+AzyMWPuCgR7R/t7
UEc2kJvJ6anldsx1tCx5VK502a3jfJUrnkNh1Pt/KOFOKDjLr8Rx3LduwahDRLP3
XjJQ705pOA2Uqm/n284A7S/Tm1q8tWu4Srik/TWqOLJPtloWvdRbA7uJoPfieYGI
Xr/T1TMibrqWtEaGiK4Hk9NDHrNOrKfrOl+Evni8HorUICLqpdrFreUGlL1Qbl73
ZM4zhD/NaSzrn8PddS6iQs0+qN03Kd95X9Wav45CKCY7+8Q5T6BSUVNt12BsyJ5l
E5P2YFSHS2qEXWD6pkc3rL8nXuAq3lb9AgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIC
hDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBS8wIdtHgcphwUFl9YIOr/sqBW0
CzANBgkqhkiG9w0BAQsFAAOCAQEAiQwqxhJoeQURamXyrF3kgtsD4lh92RD2KoTY
0UJc8+lsiv2mqipjhZxi5rRRWXtS+xeNw1yTPOaIwTuFM5CKgsYLT7j4QoEKGAPX
K74WskIezaEsuqvt/W1tcvLAA5aXIaufch0KGK1+WyTH/6j/QgSUWmGUTLQLkGi8
gRQUdrxsU56EPRlxvA//xO6SHIPnE9YPSIqspzaJxWXns2GHFdNMNgQD62o5WqKm
W7cfL7Zc3mJVuGTO4Nw7m5w+a1dZ9n65BI1qWp2QXexQEii0tS2fFZVS6SsCXJR7
jls6NAx+RSpnc2ncnvri6tK3OHFdb+7Axp24FOhEjiPAH/8BnA==
-----END CERTIFICATE-----
`

const rsa4096cert = `-----BEGIN CERTIFICATE-----
MIIFgTCCA2mgAwIBAgIRAKSycaxRC39LVVsfqsBVsbcwDQYJKoZIhvcNAQELBQAw
WjEQMA4GA1UEBhMHRXhhbXBsZTEQMA4GA1UECBMHRXhhbXBsZTEQMA4GA1UEBxMH
RXhhbXBsZTEQMA4GA1UEChMHRXhhbXBsZTEQMA4GA1UEAxMHRXhhbXBsZTAeFw0y
MjA1MjYwMDAwMDBaFw0yMzA1MjYyMzU5NTlaMFoxEDAOBgNVBAYTB0V4YW1wbGUx
EDAOBgNVBAgTB0V4YW1wbGUxEDAOBgNVBAcTB0V4YW1wbGUxEDAOBgNVBAoTB0V4
YW1wbGUxEDAOBgNVBAMTB0V4YW1wbGUwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAw
ggIKAoICAQDjs5GVc00vXla2KXmIvnTkorA6pdcwkTgfaFGpJiWF355dY9Dr4R6G
87173wh3nVk1o2wbC+A40urU6Ggc/OCIlt/YKRkyFb/flcYyNCG6J3puQZUSEULO
GKI1ahLWnn8FlyxnN3N0lSZh6SiIqUF0e6kXLYLgGO3QWNBepJU5de8IGrF7jCVD
67LP8NB01+5eluHTrISElr6qQqnZ3Zt8isciMnAtO+okrUy66F884MxyG5W4fkP9
5/DJuZJE38TWaDdM1L5g3xPqjkAerYYvQksNkr4ML+fBpRV6f/ZqcyfIalodH/tz
hGdDw83Xgv03W1IozeeZLBkRMtZVAeoWJC0olClvwm/5OkiM37lVxVYj/K5d0hdD
/uHRZsYA2vGTKysGUYXt51wfsXxZPQ+iWsOJr2ZDxCJkf4USCeCz0FJg7Autd9v9
q9HEuk4YIua/5AXRZKfeK8i3NvTUOjjc4csPQZAUz56FE2JmWjI1EMQL5O47TrWt
z24Wg1NTx/KDGqGOrQJVPDNAUtbYGdrpxyFXrJzzF2Zl5MPzirytrH6NT+zEfmIa
uhSGyVYD/2nHlEn2AmfeIwCks+KfM5TngdvR7s8Ed3LlHHazi8mXVQqX/7Prd2XM
ok8xAUlJBzw+Q/Mw7Cs3xnCpfQJIHHIl39zsqT7+yWrYsLwGrl7aKwIDAQABo0Iw
QDAOBgNVHQ8BAf8EBAMCAoQwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUVitF
3F0aoKXvToB8gazpeYO7v9wwDQYJKoZIhvcNAQELBQADggIBAI2JiO6TSISr/b+j
S+4IxD6b3yf2O/G8otAeB46V/dJiZdec5SY5G7aCf05sj87OQ6bkXw3N6z8Rij6Y
CLN4SXm082De6eS01ywewarbZdTkn6AmrOmmm1Ck18QxzYiY0G2/165o1ZT9+pmR
44Pe63zFacJt+OcbUGfTb/xQZ+W9LAXWDxWMLN7PEnyYidUdiooiSytlX7ScFChu
WVfhV+9syyNS5IAC6gwMBZQwta/05ka9aHVLp+YmfHbDyPZ2w0itmDOO3Ejc5VyV
QB6Yvrz+8gZ0rc7QFJlgQ2GnMxNtGoIx/XX4SC2CCrm0rpGyspZ0PbyeEA1RzoHY
tOv8OQE/PuvUtimqOhcqrIBb9A6ozVKvxo6bzOzGckmac7mj+Xkr99MvQo2QJtYW
4rCPKiEZfcQxa5USDPvMNw2auydUmjeW845nNgrZFixWtrwmqfB/ixL7oeCdCvLE
AXDThfaGDbO/XSNYabk/1KysahCzmK7xUaOwNHCakXvCnSjDWF0GA579iALu/Lzr
t//MopSsW5B2XxtsWjYvhGjvoFSXgplxE4Zvy/djFJPlewr2whhMIzdHU2eyL/q9
4DWHEwruwiWoGc49/TgC8r4IWztbmq6xcKbYmje9D6MA6Hkdkx9V4XtFBZ9qrdKP
zbpJxk8ZCtGZW1TxUr8y0Cmyfi6a
-----END CERTIFICATE-----
`

const rsa8192cert = `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----
`

const ecc256cert = `-----BEGIN CERTIFICATE-----
MIIB9TCCAZugAwIBAgIRAJJXMNCIfcC7P8Rxo3guh90wCgYIKoZIzj0EAwIwWjEQ
MA4GA1UEBhMHRXhhbXBsZTEQMA4GA1UECBMHRXhhbXBsZTEQMA4GA1UEBxMHRXhh
bXBsZTEQMA4GA1UEChMHRXhhbXBsZTEQMA4GA1UEAxMHRXhhbXBsZTAeFw0yMjA1
MjYwMDAwMDBaFw0yMzA1MjYyMzU5NTlaMFoxEDAOBgNVBAYTB0V4YW1wbGUxEDAO
BgNVBAgTB0V4YW1wbGUxEDAOBgNVBAcTB0V4YW1wbGUxEDAOBgNVBAoTB0V4YW1w
bGUxEDAOBgNVBAMTB0V4YW1wbGUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASs
qdLvm8/95PdMeGQ0bqoEq6BS80kRi4SO/A1UrozcsI5Jy+HMYegfBI12NATFpxo4
cdKoZmg36ajLIhu7uDMYo0IwQDAOBgNVHQ8BAf8EBAMCAoQwDwYDVR0TAQH/BAUw
AwEB/zAdBgNVHQ4EFgQUVUG6YThc7QFRFLTidf1F9zlyPlowCgYIKoZIzj0EAwID
SAAwRQIgHNSU2c7RV3k/RbKyO8OAn3sHJLUxiE9aJWNSiyufOkcCIQDVTyknBR86
FA4CWPtAONrKOYKWnW28heg8dQnhjkNWVA==
-----END CERTIFICATE-----
`

const ecc384cert = `-----BEGIN CERTIFICATE-----
MIICMTCCAbigAwIBAgIRAOHxb8my2fRvgj47D7J7hSEwCgYIKoZIzj0EAwMwWjEQ
MA4GA1UEBhMHRXhhbXBsZTEQMA4GA1UECBMHRXhhbXBsZTEQMA4GA1UEBxMHRXhh
bXBsZTEQMA4GA1UEChMHRXhhbXBsZTEQMA4GA1UEAxMHRXhhbXBsZTAeFw0yMjA1
MjYwMDAwMDBaFw0yMzA1MjYyMzU5NTlaMFoxEDAOBgNVBAYTB0V4YW1wbGUxEDAO
BgNVBAgTB0V4YW1wbGUxEDAOBgNVBAcTB0V4YW1wbGUxEDAOBgNVBAoTB0V4YW1w
bGUxEDAOBgNVBAMTB0V4YW1wbGUwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAAQ9wRd5
h57JWJaOc2C43v/vAbyoHclMooJYX3zosBWy7/TXgDmhi3ZQLBtF/KdbYjN+f5+I
bEd8LfGpCy3q7qfNkx33Sc+b61Kr7vEzSmBKiF/uX1YoOgQN3791SoGy2AWjQjBA
MA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRXul9Z
QgBCitEaO50SDgf3BvixCjAKBggqhkjOPQQDAwNnADBkAjBu3OGvmv7zDk2jsJVe
18pdVsIG8AiTnjVhEje7+C/rUwDPsnNAO3kQIYPUATixmqMCMFLOR4o96qW65q7t
ING261RByELj8QjcAVk7U+00xWmGR7yFZ+giUYrLTa9IyFx+5Q==
-----END CERTIFICATE-----
`

const fakeKey = `-----BEGIN RSA PRIVATE KEY-----
SGVsbG8gV29ybGQh
-----END RSA PRIVATE KEY-----
`

const certWithExt = `-----BEGIN CERTIFICATE-----
MIICVTCCAfugAwIBAgIQFHBvz1osyN2gmpoNLfaSSjAKBggqhkjOPQQDAjB1MQsw
CQYDVQQGEwJDQTEZMBcGA1UECBMQQnJpdGlzaCBDb2x1bWJpYTESMBAGA1UEBxMJ
VmFuY291dmVyMRQwEgYDVQQKEwtleGFtcGxlLmNvbTEhMB8GA1UEAxMYZXhhbXBs
ZS5jb20gRXhhbXBsZSBSb290MB4XDTAxMDEwMTAwMDAwMFoXDTAyMDEwMTAwMDAw
MFowdTELMAkGA1UEBhMCQ0ExGTAXBgNVBAgTEEJyaXRpc2ggQ29sdW1iaWExEjAQ
BgNVBAcTCVZhbmNvdXZlcjEUMBIGA1UEChMLZXhhbXBsZS5jb20xITAfBgNVBAMT
GGV4YW1wbGUuY29tIEV4YW1wbGUgUm9vdDBZMBMGByqGSM49AgEGCCqGSM49AwEH
A0IABE5DIgW4C3jBFASnjAqU7aYeqK5ZaJdplzKbTfMUIFszhuFHrKw6/VAK6cLp
uQgnije5zXWtJmaCEyPItGC5MBmjbTBrMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0O
BBYEFB4q7t8PK8X9gn9GwdsbtGOPxwljMBAGBSoDBAUGBAcTBWhlbGxvMA0GBSoD
BAUHBAQCAgU5MBgGBSoDBAUIBA8XDTIzMTEyOTIwMzQwMFowCgYIKoZIzj0EAwID
SAAwRQIgJ5RwAHrklbBDCEqetbVdILxem899JdLpI2taBhGtWdwCIQCnMsOMD87n
9ovPJpGVUxbEYWtiAS1EiZsRGsHF5AVIgw==
-----END CERTIFICATE-----
`

func TestCloneRSA2048(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(rsa2048cert), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	if request.KeyType != tls.KeyTypeRSA_2048 {
		t.Errorf("Incorrect key type. Expected '%s' got '%s'", tls.KeyTypeRSA_2048, request.KeyType)
	}
}

func TestCloneRSA4096(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(rsa4096cert), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	if request.KeyType != tls.KeyTypeRSA_4096 {
		t.Errorf("Incorrect key type. Expected '%s' got '%s'", tls.KeyTypeRSA_4096, request.KeyType)
	}
}

func TestCloneRSA8192(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(rsa8192cert), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	if request.KeyType != tls.KeyTypeRSA_8192 {
		t.Errorf("Incorrect key type. Expected '%s' got '%s'", tls.KeyTypeRSA_8192, request.KeyType)
	}
}

func TestCloneECDSA256(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(ecc256cert), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	if request.KeyType != tls.KeyTypeECDSA_256 {
		t.Errorf("Incorrect key type. Expected '%s' got '%s'", tls.KeyTypeECDSA_256, request.KeyType)
	}
}

func TestCloneECDSA384(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(ecc384cert), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	if request.KeyType != tls.KeyTypeECDSA_384 {
		t.Errorf("Incorrect key type. Expected '%s' got '%s'", tls.KeyTypeECDSA_384, request.KeyType)
	}
}

func TestCloneCertWithExt(t *testing.T) {
	t.Parallel()

	certificate, err := tls.ImportPEM([]byte(certWithExt), []byte(fakeKey), "")
	if err != nil {
		t.Fatalf("Error importing key: %s", err.Error())
	}

	request := certificate.Clone()
	foundStringExtension := false
	foundNumberExtension := false
	foundTimeExtension := false

	for _, extension := range request.Extensions {
		if extension.OID == stringExtensionId {
			var value string
			value, isStr := extension.Value.(string)
			if !isStr {
				t.Fatalf("Incorrect value type for string extensions")
				continue
			}
			if value != stringExtensionValue {
				t.Fatalf("String extension value does not match %v != %v", value, stringExtensionValue)
				continue
			}
			foundStringExtension = true
		}

		if extension.OID == numberExtensionId {
			var value int64
			value, isStr := extension.Value.(int64)
			if !isStr {
				t.Fatalf("Incorrect value type for number extensions. Expected int")
				continue
			}
			if int(value) != numberExtensionValue {
				t.Fatalf("Number extension value does not match %v != %v", value, numberExtensionValue)
				continue
			}
			foundNumberExtension = true
		}

		if extension.OID == timeExtensionId {
			var value time.Time
			value, isStr := extension.Value.(time.Time)
			if !isStr {
				t.Fatalf("Incorrect value type for time extensions")
				continue
			}
			if value.Unix() != timeExtensionValue.Unix() { // Use unix since millisecond precision is lost
				t.Fatalf("Time extension value does not match %v != %v", value, timeExtensionValue)
				continue
			}
			foundTimeExtension = true
		}
	}

	if !foundStringExtension {
		t.Fatalf("Did not find string extension")
	}
	if !foundNumberExtension {
		t.Fatalf("Did not find number extension")
	}
	if !foundTimeExtension {
		t.Fatalf("Did not find time extension")
	}
}
