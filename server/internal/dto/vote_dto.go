package dto

type CreateVoteRequest struct {
	Mesa        string `json:"mesa" validate:"required,min=0"`
	CandidateID string `json:"candidateId" validate:"required"`
	TotalVotes  int    `json:"totalVotes" validate:"required,min=0"`
}

type UpdateVoteRequest struct {
	TotalVotes *int `json:"totalVotes,omitempty" validate:"omitempty,min=0"`
}

type VoteResponse struct {
	ID            string `json:"id"`
	Mesa          string `json:"mesa"`
	CandidateID   string `json:"candidateId"`
	CandidateName string `json:"candidateName,omitempty"`
	TotalVotes    int    `json:"totalVotes"`
}
