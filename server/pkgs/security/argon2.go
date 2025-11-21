// server/pkgs/security/argon2.go
package security

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

var (
	ErrInvalidHash         = errors.New("the encoded hash is not in the correct format")
	ErrIncompatibleVersion = errors.New("incompatible version of argon2")
	ErrInvalidPassword     = errors.New("invalid password")
)

type Argon2Params struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	SaltLength  uint32
	KeyLength   uint32
}

type Argon2Service struct {
	params *Argon2Params
}

// NewArgon2Service crea una instancia con parámetros recomendados por OWASP
func NewArgon2Service() *Argon2Service {
	return &Argon2Service{
		params: &Argon2Params{
			Memory:      64 * 1024, // 64 MB (mínimo recomendado por OWASP)
			Iterations:  3,         // 3 iteraciones (balance seguridad/rendimiento)
			Parallelism: 4,         // 4 hilos (tu valor original)
			SaltLength:  16,        // 16 bytes (128 bits)
			KeyLength:   32,        // 32 bytes (256 bits)
		},
	}
}

// NewArgon2ServiceWithParams permite personalizar los parámetros
func NewArgon2ServiceWithParams(params *Argon2Params) *Argon2Service {
	return &Argon2Service{params: params}
}

// HashPassword genera un hash Argon2id de la contraseña
func (a *Argon2Service) HashPassword(password string) (string, error) {
	if password == "" {
		return "", errors.New("password cannot be empty")
	}

	salt := make([]byte, a.params.SaltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		a.params.Iterations,
		a.params.Memory,
		a.params.Parallelism,
		a.params.KeyLength,
	)

	// Formato estándar PHC: $argon2id$v=19$m=65536,t=3,p=4$salt$hash
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	encodedHash := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		a.params.Memory,
		a.params.Iterations,
		a.params.Parallelism,
		b64Salt,
		b64Hash,
	)

	return encodedHash, nil
}

// CheckPasswordHash verifica si la contraseña coincide con el hash (mantiene compatibilidad)
func (a *Argon2Service) CheckPasswordHash(password, encodedHash string) bool {
	err := a.ComparePassword(encodedHash, password)
	return err == nil
}

// ComparePassword verifica la contraseña y retorna error detallado
func (a *Argon2Service) ComparePassword(encodedHash, password string) error {
	if password == "" {
		return errors.New("password cannot be empty")
	}

	params, salt, hash, err := a.decodeHash(encodedHash)
	if err != nil {
		return fmt.Errorf("failed to decode hash: %w", err)
	}

	otherHash := argon2.IDKey(
		[]byte(password),
		salt,
		params.Iterations,
		params.Memory,
		params.Parallelism,
		params.KeyLength,
	)

	// Usar subtle.ConstantTimeCompare en lugar de implementación manual
	if subtle.ConstantTimeCompare(hash, otherHash) != 1 {
		return ErrInvalidPassword
	}

	return nil
}

// decodeHash extrae los parámetros, salt y hash del string codificado
func (a *Argon2Service) decodeHash(encodedHash string) (*Argon2Params, []byte, []byte, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return nil, nil, nil, ErrInvalidHash
	}

	// Verificar que sea argon2id
	if parts[1] != "argon2id" {
		return nil, nil, nil, errors.New("hash is not argon2id")
	}

	// Extraer versión
	var version int
	if _, err := fmt.Sscanf(parts[2], "v=%d", &version); err != nil {
		return nil, nil, nil, fmt.Errorf("invalid version format: %w", err)
	}
	if version != argon2.Version {
		return nil, nil, nil, ErrIncompatibleVersion
	}

	// Extraer parámetros
	params := &Argon2Params{}
	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d",
		&params.Memory,
		&params.Iterations,
		&params.Parallelism); err != nil {
		return nil, nil, nil, fmt.Errorf("invalid params format: %w", err)
	}

	// Decodificar salt
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return nil, nil, nil, fmt.Errorf("invalid salt encoding: %w", err)
	}
	params.SaltLength = uint32(len(salt))

	// Decodificar hash
	hash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return nil, nil, nil, fmt.Errorf("invalid hash encoding: %w", err)
	}
	params.KeyLength = uint32(len(hash))

	return params, salt, hash, nil
}

// NeedsRehash verifica si el hash necesita ser regenerado (cambio de parámetros)
func (a *Argon2Service) NeedsRehash(encodedHash string) bool {
	params, _, _, err := a.decodeHash(encodedHash)
	if err != nil {
		return true
	}

	return params.Memory != a.params.Memory ||
		params.Iterations != a.params.Iterations ||
		params.Parallelism != a.params.Parallelism ||
		params.KeyLength != a.params.KeyLength
}
