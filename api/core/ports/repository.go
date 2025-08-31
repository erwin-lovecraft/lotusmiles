package ports

type Repository interface {
	Customer() CustomerRepository
	Mileage() MileageRepository
	Membership() MembershipRepository
}
