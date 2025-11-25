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
	ErrImageTooLarge    = errors.New("la imagen es demasiado grande. Máximo 10MB")
)

const (
	MaxImageSize  = 10 * 1024 * 1024
	UploadFolder  = "./uploads"
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
	// Validar tamaño
	if file.Size > MaxImageSize {
		return nil, ErrImageTooLarge
	}

	// Validar extensión
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

	// Crear carpeta uploads si no existe
	if err := os.MkdirAll(UploadFolder, 0755); err != nil {
		return nil, fmt.Errorf("error al crear carpeta uploads: %w", err)
	}

	// Leer el contenido del archivo para guardarlo en BD
	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("error al abrir archivo: %w", err)
	}
	defer src.Close()

	// Leer todos los bytes
	data := make([]byte, file.Size)
	if _, err := src.Read(data); err != nil {
		return nil, fmt.Errorf("error al leer archivo: %w", err)
	}

	// Generar nombre único para el archivo
	timestamp := time.Now().UnixNano()
	filename := fmt.Sprintf("img_%d%s", timestamp, ext)

	// Crear registro en base de datos con los bytes
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

	// Eliminar archivo físico
	filepath := filepath.Join(UploadFolder, image.Filename)
	if err := os.Remove(filepath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("error al eliminar archivo: %w", err)
	}

	// Eliminar registro de base de datos
	if err := s.db.Delete(&image).Error; err != nil {
		return err
	}

	return nil
}