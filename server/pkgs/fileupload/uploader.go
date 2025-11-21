// pkgs/fileupload/uploader.go
package fileupload

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type FileUploader struct {
	BaseDir string
}

func NewFileUploader() *FileUploader {
	return &FileUploader{
		BaseDir: "uploads/documents",
	}
}

func InitUploadDir() error {
	baseDir := "uploads/documents"
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		return fmt.Errorf("error creando directorio uploads: %v", err)
	}
	return nil
}

func (u *FileUploader) UploadPDF(file *multipart.FileHeader) (string, string, error) {
	if file == nil {
		return "", "", fmt.Errorf("no se proporcionó archivo")
	}

	ext := filepath.Ext(file.Filename)
	if ext != ".pdf" {
		return "", "", fmt.Errorf("solo se permiten archivos PDF")
	}

	now := time.Now()
	year := now.Format("2006")
	month := now.Format("01")
	
	uploadDir := filepath.Join(u.BaseDir, year, month)
	
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", "", fmt.Errorf("error creando directorios: %v", err)
	}

	newFileName := fmt.Sprintf("%s.pdf", uuid.New().String())
	filePath := filepath.Join(uploadDir, newFileName)

	src, err := file.Open()
	if err != nil {
		return "", "", fmt.Errorf("error abriendo archivo: %v", err)
	}
	defer src.Close()

	dst, err := os.Create(filePath)
	if err != nil {
		return "", "", fmt.Errorf("error creando archivo: %v", err)
	}
	defer dst.Close()

	if _, err := dst.ReadFrom(src); err != nil {
		return "", "", fmt.Errorf("error guardando archivo: %v", err)
	}

	normalizedPath := u.NormalizePath(filePath)
	
	return normalizedPath, file.Filename, nil
}

func (u *FileUploader) DeleteFile(filePath string) error {

	cleanPath := u.NormalizePath(filePath)
	
	if _, err := os.Stat(cleanPath); os.IsNotExist(err) {
		return nil
	}
	
	return os.Remove(cleanPath)
}

func (u *FileUploader) NormalizePath(path string) string {
	normalized := filepath.FromSlash(path)
	
	for len(normalized) > 0 && (normalized[0] == '\\' || normalized[0] == '/') {
		normalized = normalized[1:]
	}
	
	return normalized
}

func (u *FileUploader) GetAbsolutePath(relativePath string) string {
	absPath, _ := filepath.Abs(relativePath)
	return absPath
}
