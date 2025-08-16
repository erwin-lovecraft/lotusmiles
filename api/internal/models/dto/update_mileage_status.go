package dto

type UpdateMileageStatus struct {
	Status       string  `json:"status" binding:"required,oneof=pending approved rejected cancelled"`
	RejectReason *string `json:"reject_reason,omitempty"`
}
