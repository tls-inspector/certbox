package certbox

import "strings"

func filenameSafeString(in string) (out string) {
	out = in

	// Need to remove all NTFS characters,
	// as well as a couple more annoynances
	naughty := map[string]string{
		"<":    "",
		">":    "",
		":":    "",
		"\"":   "",
		"/":    "",
		"\\":   "",
		"|":    "",
		"?":    "",
		"*":    "",
		" ":    "_",
		",":    "",
		"#":    "",
		"\000": "",
	}

	for bad, good := range naughty {
		out = strings.Replace(out, bad, good, -1)
	}

	// Don't allow UNIX "hidden" files
	if out[0] == '.' {
		out = "_" + out
	}

	return out
}
