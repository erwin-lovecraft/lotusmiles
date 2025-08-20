package constants

import (
	"math"
)

var (
	AccuralRates = map[string]accrualRate{
		// ---------------- Business ----------------
		"J": {q: 2.00, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{2.5, 3.0, 4.6, 8.6, 12}}},
		"C": {q: 2.00, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{2.5, 3.0, 4.6, 8.6, 12}}},
		"D": {q: 1.50, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{2.0, 2.2, 3.5, 6.5, 9.0}}},
		"I": {q: 1.50, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{2.0, 2.2, 3.5, 6.5, 9.0}}},

		// ---------------- Premium Economy ----------------
		"W": {q: 1.30, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.8, 2.0, 3.0, 5.6, 8.0}}},
		"Z": {q: 1.20, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.6, 1.8, 2.7, 5.2, 7.4}}},
		"U": {q: 1.20, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.6, 1.8, 2.7, 5.2, 7.4}}},

		// ---------------- Economy (Flex) ----------------
		"Y": {q: 1.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.4, 1.5, 2.3, 4.3, 6.0}}},
		"M": {q: 1.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.4, 1.5, 2.3, 4.3, 6.0}}},
		"B": {q: 1.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.4, 1.5, 2.3, 4.3, 6.0}}},

		// ---------------- Economy (Classic) ----------------
		"S": {q: 0.65, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.0, 1.1, 1.5, 2.8, 4.0}}},
		"H": {q: 0.65, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.0, 1.1, 1.5, 2.8, 4.0}}},
		"K": {q: 0.65, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.0, 1.1, 1.5, 2.8, 4.0}}},
		"L": {q: 0.65, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{1.0, 1.1, 1.5, 2.8, 4.0}}},

		// ---------------- Economy (Lite) ----------------
		"Q": {q: 0.25, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0.5, 0.5, 0.5, 0.5, 0.5}}},
		"N": {q: 0.25, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0.5, 0.5, 0.5, 0.5, 0.5}}},
		"R": {q: 0.25, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0.5, 0.5, 0.5, 0.5, 0.5}}},
		"T": {q: 0.25, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0.5, 0.5, 0.5, 0.5, 0.5}}},
		"E": {q: 0.25, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0.5, 0.5, 0.5, 0.5, 0.5}}},

		// ---------------- Economy (Super Lite) ----------------
		"A": {q: 0.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0, 0, 0, 0, 0}}},
		"P": {q: 0.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0, 0, 0, 0, 0}}},
		"G": {q: 0.10, b: BonusMile{Miles: []float64{1000, 2000, 3000, 5000, math.MaxInt}, Values: []float64{0, 0, 0, 0, 0}}},
	}
)

type BonusMile struct {
	Miles  []float64
	Values []float64
}

func (b BonusMile) At(miles float64) float64 {
	var index int
	for idx, m := range b.Miles {
		if miles > m {
			index = idx
		}
	}
	return b.Values[index]
}

type accrualRate struct {
	q float64
	b BonusMile
}

func (r accrualRate) QualifyingMile() float64 {
	return r.q
}

func (r accrualRate) BonusMileAt(miles float64) float64 {
	return r.b.At(miles)
}
