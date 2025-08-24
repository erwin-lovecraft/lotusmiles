package constants

const (
	MemberTierRegister     = "register"
	MemberTierSilver       = "silver"
	MemberTierTitan        = "titan"
	MemberTierGold         = "gold"
	MemberTierPlatinum     = "platinum"
	MemberTierMillionMiler = "million_miler"
)

// MembershipTierCondition represents the qualifying miles threshold for each tier
type MembershipTierCondition struct {
	Tier     string
	MinMiles float64
}

// MembershipTierConditions defines the upgrade thresholds for each tier
var MembershipTierConditions = []MembershipTierCondition{
	{Tier: MemberTierRegister, MinMiles: 0},
	{Tier: MemberTierSilver, MinMiles: 1},
	{Tier: MemberTierTitan, MinMiles: 15000},
	{Tier: MemberTierGold, MinMiles: 30000},
	{Tier: MemberTierPlatinum, MinMiles: 50000},
	{Tier: MemberTierMillionMiler, MinMiles: 100000},
}
