package services

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"server/internal/models"
	"strings"
	"time"

	"gorm.io/gorm"
)

var (
	ErrImageNotFound    = errors.New("imagen no encontrada")
	ErrInvalidImageType = errors.New("tipo de imagen no válido. Solo se permiten: jpg, jpeg, png, gif, webp")
	ErrImageTooLarge    = errors.New("la imagen es demasiado grande. Máximo 5MB")
)

const (
	MaxImageSize = 10 * 1024 * 1024
	UploadFolder = "./uploads"
)

type ImageService interface {
	SaveImage(file *multipart.FileHeader) (*models.Image, error)
	GetByID(id string) (*models.Image, error)
	Delete(id string) error
}

type imageServiceImpl struct {
	db *gorm.DB
}

func NewImageService(db *gorm.DB) ImageService {
	return &imageServiceImpl{db: db}
}

func (s *imageServiceImpl) SaveImage(file *multipart.FileHeader) (*models.Image, error) {

	if file.Size > MaxImageSize {
		return nil, ErrImageTooLarge
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
	}

	if !allowedExts[ext] {
		return nil, ErrInvalidImageType
	}

	if err := os.MkdirAll(UploadFolder, 0755); err != nil {
		return nil, fmt.Errorf("error al crear carpeta uploads: %w", err)
	}

	timestamp := time.Now().UnixNano()
	filename := fmt.Sprintf("img_%d%s", timestamp, ext)

	image := models.Image{
		Filename: filename,
		Name:     file.Filename,
		URL:      fmt.Sprintf("/uploads/%s", filename),
	}

	if err := s.db.Create(&image).Error; err != nil {
		return nil, fmt.Errorf("error al guardar registro de imagen: %w", err)
	}
	return &image, nil
}

func (s *imageServiceImpl) GetByID(id string) (*models.Image, error) {
	var image models.Image
	if err := s.db.First(&image, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrImageNotFound
		}
		return nil, err
	}
	return &image, nil
}

func (s *imageServiceImpl) Delete(id string) error {
	var image models.Image
	if err := s.db.First(&image, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrImageNotFound
		}
		return err
	}

	filepath := filepath.Join(UploadFolder, image.Filename)
	if err := os.Remove(filepath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("error al eliminar archivo: %w", err)
	}

	if err := s.db.Delete(&image).Error; err != nil {
		return err
	}

	return nil
}
