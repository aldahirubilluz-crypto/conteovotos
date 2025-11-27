// server/internal/dto/result_dto.go
package dto

type CandidateResultResponse struct {
	CandidateID   string  `json:"candidateId"`
	CandidateName string  `json:"candidateName"`
	PositionID    *string `json:"positionId,omitempty"`
	PositionName  *string `json:"positionName,omitempty"`
	TotalVotes    int     `json:"totalVotes"`
	ImageId       string  `json:"imageId,omitempty"`
}

type ResultsSummaryResponse struct {
	TotalCandidates int                       `json:"totalCandidates"`
	TotalVotes      int                       `json:"totalVotes"`
	Results         []CandidateResultResponse `json:"results"`
}
