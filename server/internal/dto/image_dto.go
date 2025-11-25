// server/internal/dto/image_dto.go
package dto

type ImageResponse struct {
	ID       string `json:"id"`
	Filename string `json:"filename"`
	Name     string `json:"name"`
	URL      string `json:"url"`
	Size     int64  `json:"size,omitempty"`
}