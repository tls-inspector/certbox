package main

type PingParameters struct {
	Nonce string `json:"nonce"`
}

type PingResponse struct {
	Nonce string `json:"nonce"`
}

func Ping(params PingParameters) PingResponse {
	return PingResponse{params.Nonce}
}
