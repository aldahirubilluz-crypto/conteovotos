package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"

	"server/internal/services"
	"server/pkgs/logger"
)

type UserManagementHandler struct {
	userManagementService *services.UserManagementService
}

func NewUserManagementHandler(userManagementService *services.UserManagementService) *UserManagementHandler {
	return &UserManagementHandler{userManagementService: userManagementService}
}

func (h *UserManagementHandler) UserAll(c fiber.Ctx) (interface{}, string, error) {
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o expirado")
	}
	requesterID := userID.(string)

	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible en token")
	}

	userOffice := ""
	if office := c.Locals("userOffice"); office != nil {
		userOffice = office.(string)
	}

	users, err := h.userManagementService.UserAll(requesterID, userRole.(string), userOffice)
	if err != nil {
		logger.Log.Errorf("❌ List users failed: %v", err)

		switch err {
		case services.ErrUnauthorizedAccess:
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		default:
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
	}

	logger.Log.Infof("✅ Users listed by %s", requesterID)
	return users, "Usuarios obtenidos exitosamente", nil
}

func (h *UserManagementHandler) UserOne(c fiber.Ctx) (interface{}, string, error) {

	targetID := c.Params("id")

	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o expirado")
	}
	requesterID := userID.(string)

	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible en token")
	}

	userOffice := ""
	if office := c.Locals("userOffice"); office != nil {
		userOffice = office.(string)
	}

	user, err := h.userManagementService.UserOne(targetID, requesterID, userRole.(string), userOffice)
	if err != nil {
		logger.Log.Errorf("❌ Get user failed: %v", err)

		switch err {
		case services.ErrUnauthorizedAccess:
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		default:
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
	}

	logger.Log.Infof("👁 User %s requested by %s", targetID, requesterID)
	return user, "Usuario obtenido exitosamente", nil
}

func (h *UserManagementHandler) CreateUser(c fiber.Ctx) (interface{}, string, error) {
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o expirado")
	}

	createdByID := userID.(string)

	var req dto.CreateUserRequest
	if err := c.Bind().JSON(&req); err != nil {
		return nil, "Datos inválidos", fiber.NewError(fiber.StatusBadRequest, "Datos inválidos")
	}

	user, err := h.userManagementService.CreateUser(req, createdByID)
	if err != nil {
		logger.Log.Errorf("❌ Create user failed: %v", err)

		if err == services.ErrCreateUserEmailTaken {
			return nil, err.Error(), fiber.NewError(fiber.StatusConflict, err.Error())
		}

		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	logger.Log.Infof("✅ User created: %s", user.Email)
	return user, "Usuario creado exitosamente", nil
}

func (h *UserManagementHandler) DeleteUser(c fiber.Ctx) (interface{}, string, error) {

	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o expirado")
	}
	requesterID := userID.(string)

	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible en token")
	}

	targetID := c.Params("id")
	if targetID == "" {
		return nil, "ID del usuario requerido", fiber.NewError(fiber.StatusBadRequest, "ID del usuario es obligatorio")
	}

	err := h.userManagementService.DeleteUser(targetID, requesterID, userRole.(string))
	if err != nil {
		logger.Log.Errorf("❌ Delete user failed: %v", err)

		switch err {
		case services.ErrUnauthorizedAccess:
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		case services.ErrUserNotFound:
			return nil, err.Error(), fiber.NewError(fiber.StatusNotFound, err.Error())
		default:
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
	}

	logger.Log.Infof("✅ User deleted: %s", targetID)
	return nil, "Usuario eliminado exitosamente", nil
}

func (h *UserManagementHandler) UpdateUser(c fiber.Ctx) (interface{}, string, error) {
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o expirado")
	}
	requesterID := userID.(string)

	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible en token")
	}

	userOffice := ""
	if office := c.Locals("userOffice"); office != nil {
		userOffice = office.(string)
	}

	targetID := c.Params("id")
	if targetID == "" {
		return nil, "ID del usuario requerido", fiber.NewError(fiber.StatusBadRequest, "ID del usuario es obligatorio")
	}

	var req dto.UpdateUserRequest
	if err := c.Bind().JSON(&req); err != nil {
		return nil, "Datos inválidos", fiber.NewError(fiber.StatusBadRequest, "No se pudo parsear body")
	}

	updatedUser, err := h.userManagementService.UpdateUser(targetID, requesterID, userRole.(string), userOffice, req)
	if err != nil {
		logger.Log.Errorf("❌ Update user failed: %v", err)

		switch err {
		case services.ErrUnauthorizedAccess:
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		case services.ErrUserNotFound:
			return nil, err.Error(), fiber.NewError(fiber.StatusNotFound, err.Error())
		default:
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
	}

	logger.Log.Infof("✅ User updated: %s", targetID)
	return updatedUser, "Usuario actualizado exitosamente", nil
}
