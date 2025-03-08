document.addEventListener("DOMContentLoaded", function () {
	// Cookie consent functionality
	const cookieConsent = document.getElementById("cookieConsent");
	const cookieAccept = document.getElementById("cookieAccept");
	const cookieDecline = document.getElementById("cookieDecline");

	// Check if user already made a choice
	if (!localStorage.getItem("cookieConsent")) {
		// Show the cookie banner if no choice was made before
		cookieConsent.style.display = "flex";
	}

	// Handle accept
	cookieAccept.addEventListener("click", function () {
		localStorage.setItem("cookieConsent", "accepted");
		cookieConsent.style.display = "none";
	});

	// Handle decline
	cookieDecline.addEventListener("click", function () {
		localStorage.setItem("cookieConsent", "declined");
		cookieConsent.style.display = "none";
	});

	// Add functionality for reset button
	const resetButton = document.getElementById("resetAll");
	resetButton.addEventListener("click", function () {
		// Get all input fields and reset them
		const allInputs = document.querySelectorAll('input[type="number"]');
		allInputs.forEach((input) => {
			input.value = "";
		});

		// Reset all result divs without removing the precision toggle buttons
		const allResults = document.querySelectorAll('[id$="Results"]');
		allResults.forEach((result) => {
			const pElement = result.querySelector("p") || document.createElement("p");
			pElement.innerHTML = "Wybierz wartość aby zobaczyć przeliczenia";

			// If paragraph doesn't exist yet, append it
			if (!pElement.parentNode) {
				result.appendChild(pElement);
			}
		});

		// Clear history
		conversionHistory = [];
		updateHistoryDisplay();

		// Set the Length category as active in the menu
		const menuItems = document.querySelectorAll(".categories-menu .nav-link");
		menuItems.forEach((item) => {
			if (item.getAttribute("data-category") === "length") {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});

		// Scroll to the top of the page
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		// Focus on the length input field after scrolling
		setTimeout(() => {
			const lengthInput = document.getElementById("lengthValue");
			if (lengthInput) {
				lengthInput.focus();
				lengthInput.select();
			}
		}, 600);
	});

	// Add functionality for individual reset buttons
	const resetUnitButtons = document.querySelectorAll(".reset-unit-btn");
	resetUnitButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const unitType = this.getAttribute("data-unit");

			// Clear the input for this specific converter
			const inputField = document.getElementById(`${unitType}Value`);
			if (inputField) {
				inputField.value = "";
			}

			// Reset the results div for this converter without removing the precision toggle
			const resultsDiv = document.getElementById(`${unitType}Results`);
			if (resultsDiv) {
				const pElement =
					resultsDiv.querySelector("p") || document.createElement("p");
				pElement.innerHTML = "<p>Wybierz wartość aby zobaczyć przeliczenia</p>";

				// If paragraph doesn't exist yet, append it
				if (!pElement.parentNode) {
					resultsDiv.appendChild(pElement);
				}
			}
		});
	});
});

// Privacy Policy Modal functionality
document.addEventListener("DOMContentLoaded", function () {
	const modal = document.getElementById("privacyPolicyModal");
	const link = document.getElementById("privacyPolicyLink");
	const closeButton = document.querySelector(".close-button");

	// Open modal when clicking the link
	link.addEventListener("click", function (e) {
		e.preventDefault();
		modal.style.display = "block";
		document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
	});

	// Close modal when clicking the close button
	closeButton.addEventListener("click", function () {
		modal.style.display = "none";
		document.body.style.overflow = "auto"; // Re-enable scrolling
	});

	// Close modal when clicking outside of it
	window.addEventListener("click", function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
			document.body.style.overflow = "auto"; // Re-enable scrolling
		}
	});

	// Close modal when pressing Escape key
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && modal.style.display === "block") {
			modal.style.display = "none";
			document.body.style.overflow = "auto"; // Re-enable scrolling
		}
	});
});



// Conversion history functionality
let conversionHistory = [];
const MAX_HISTORY_ITEMS = 5;
const historyList = document.getElementById("historyList");

function addToHistory(fromValue, fromUnit, toValue, toUnit, category) {
	// Create new history item
	const historyItem = {
		fromValue: fromValue,
		fromUnit: fromUnit,
		toValue: toValue,
		toUnit: toUnit,
		category: category,
		timestamp: new Date(),
	};

	// Add to beginning of array
	conversionHistory.unshift(historyItem);

	// Keep only the most recent items
	if (conversionHistory.length > MAX_HISTORY_ITEMS) {
		conversionHistory = conversionHistory.slice(0, MAX_HISTORY_ITEMS);
	}

	// Update history display
	updateHistoryDisplay();
}

function updateHistoryDisplay() {
	if (conversionHistory.length === 0) {
		historyList.innerHTML =
			'<li class="no-history">Brak historii konwersji</li>';
		return;
	}

	historyList.innerHTML = "";
	conversionHistory.forEach((item) => {
		const li = document.createElement("li");
		li.className = "history-item";
		// Modified to show both input value and converted result with an arrow
		li.innerHTML = `
			<span class="history-value">${formatNumber(item.fromValue, false)}</span> 
			<span class="history-unit">${item.fromUnit}</span>
			<span class="history-arrow">→</span>
			<span class="history-value">${formatNumber(item.toValue, false)}</span> 
			<span class="history-unit">${item.toUnit}</span>
			<span class="history-category">${getCategoryName(item.category)}</span>
		`;
		historyList.appendChild(li);

		// Add click event to jump to that category when history item is clicked
		li.addEventListener("click", function () {
			const categoryLink = document.querySelector(
				`.nav-link[data-category="${item.category}"]`
			);
			if (categoryLink) {
				categoryLink.click();
			}
		});
	});
}

// Helper function to get a friendly category name
function getCategoryName(categoryCode) {
	const categoryNames = {
		length: "Długość",
		mass: "Masa",
		temp: "Temperatura",
		volume: "Objętość",
		area: "Powierzchnia",
		time: "Czas",
		speed: "Prędkość",
		energy: "Energia",
		pressure: "Ciśnienie",
		power: "Moc",
		data: "Pamięć",
		freq: "Częstotliwość",
		sound: "Dźwięk",
		density: "Gęstość",
		light: "Ilość światła",
		magnetic: "Indukcja",
		inductance: "Indukcyjność",
		angle: "Kąty",
		viscosity: "Lepkość",
		luminance: "Luminancja",
		molarmass: "Masa molowa",
		torque: "Moment obrotowy",
		voltage: "Napięcie",
		illuminance: "Natężenie oświetlenia",
		acceleration: "Przyśpieszenie",
		resistance: "Rezystancja",
		fuel: "Zużycie paliwa",
		charge: "Ładunek el.",
	};

	return categoryNames[categoryCode] || categoryCode;
}

// Function to handle active menu item highlighting
function handleMenuHighlighting() {
	const menuItems = document.querySelectorAll(".categories-menu .nav-link");
	const allConverterInputs = document.querySelectorAll(
		'input[type="number"], .form-select'
	);

	// Function to set active category
	function setActiveCategory(category) {
		menuItems.forEach((item) => {
			if (item.getAttribute("data-category") === category) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});
	}

	// Listen for any input or change in converter fields
	allConverterInputs.forEach((input) => {
		input.addEventListener("focus", function () {
			// Get the category from the ID of the input
			const inputId = this.id;
			const category = inputId.replace("Value", "").replace("Unit", "");
			setActiveCategory(category);
		});
	});

	// Also handle menu item clicks
	menuItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();
			const category = this.getAttribute("data-category");
			setActiveCategory(category);

			// Scroll to the corresponding section
			const section = document.getElementById(category);
			if (section) {
				section.scrollIntoView({ behavior: "smooth" });

				// Focus the input field after scrolling
				const inputField = document.getElementById(`${category}Value`);
				if (inputField) {
					// Add a slight delay to wait for the scroll to complete
					setTimeout(() => {
						inputField.focus();
						// Select any existing content for easy replacement
						inputField.select();
					}, 600);
				}
			}
		});
	});
}

handleMenuHighlighting();

// Existing converter functionality
// Pomocnicze funkcje
function getUnitForm(value, singular, plural) {
	const baseForm = Math.abs(value) === 1 ? singular : plural;
	// If there's an abbreviation in square brackets, keep it
	if (singular.includes("[") || plural.includes("[")) {
		return baseForm;
	}
	return baseForm;
}

// Track precision toggle for each converter
const precisionStates = {};

// Enhanced formatNumber function with thousand separator
function formatNumber(num, showFullPrecision = false) {
	let result;

	// Format the number with proper precision
	if (showFullPrecision) {
		// Full precision
		if (Math.abs(num) >= 1000000) {
			result = num.toExponential(4);
		} else if (Math.abs(num) < 0.001 && num !== 0) {
			result = num.toExponential(4);
		} else {
			result = Math.abs(num) >= 100 ? num.toFixed(4) : num.toFixed(6);
		}
	} else {
		// Limited to 2 decimal places
		if (Math.abs(num) >= 1000000) {
			result = num.toExponential(2);
		} else if (Math.abs(num) < 0.001 && num !== 0) {
			result = num.toExponential(2);
		} else {
			result = num.toFixed(2);
		}
	}

	// Split the number into integer and decimal parts
	let parts = result.split(".");

	// Add thousands separators to the integer part
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

	// Rejoin and replace the decimal point with a comma
	return parts.join(",");
}

function generateResultsWithPrecision(
	conversions,
	currentUnit,
	showFullPrecision
) {
	return conversions
		.filter((c) => c.unit !== currentUnit)
		.map((c) => {
			// Get unit name
			const unitName = c.name;
			// Get unit symbol
			const unitSymbol = c.unit;

			return `<div class="result-item">
										<span class="conversion-value">${formatNumber(
											c.value,
											showFullPrecision
										)}</span>
										<span class="conversion-symbol">[${unitSymbol}]</span>
										<span class="conversion-unit">${unitName}</span>
								</div>`;
		})
		.join("");
}

// Replace the original generateResults function
function generateResults(conversions, currentUnit) {
	return generateResultsWithPrecision(conversions, currentUnit, false);
}

// Debounce function to delay execution until user stops typing
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}

// Inicjalizacja konwerterów
function initConverter(type, units) {
	const valueInput = document.getElementById(`${type}Value`);
	const unitSelect = document.getElementById(`${type}Unit`);
	const resultsDiv = document.getElementById(`${type}Results`);

	// Create precision toggle button
	const precisionToggle = document.createElement("button");
	precisionToggle.id = `${type}PrecisionToggle`;
	precisionToggle.className = "precision-toggle";
	precisionToggle.title = "Pokaż pełną precyzję";
	precisionToggle.innerHTML = '<i class="fas fa-calculator"></i>';

	// Insert the button into results div
	if (resultsDiv) {
		resultsDiv.style.position = "relative";
		resultsDiv.appendChild(precisionToggle);
	}

	// Initialize precision state for this converter
	precisionStates[type] = false;

	// Add precision toggle functionality
	precisionToggle.addEventListener("click", function () {
		// Toggle precision state for this converter
		precisionStates[type] = !precisionStates[type];

		// Update button appearance
		this.classList.toggle("active", precisionStates[type]);
		this.title = precisionStates[type]
			? "Pokaż mniej miejsc po przecinku"
			: "Pokaż pełną precyzję";

		// Refresh results if there's a value
		if (valueInput.value) {
			updateResults(false); // Pass false to not add to history when toggling precision
		}
	});

	// Create a debounced version of history update
	const debouncedHistoryUpdate = debounce((value, unit, conversions) => {
		// Add first conversion to history if available
		if (conversions.length > 0) {
			const firstConversion = conversions[0];
			addToHistory(
				value,
				units[unit].name(value),
				firstConversion.value,
				firstConversion.name,
				type
			);
		}
	}, 1500); // 1,5 seconds debounce

	// Update function now takes a parameter to control history recording
	function updateResults(addToHistoryFlag = true) {
		const value = parseFloat(valueInput.value);
		const unit = unitSelect.value;

		if (!isNaN(value)) {
			const conversions = Object.keys(units[unit].conversions).map(
				(targetUnit) => ({
					unit: targetUnit,
					value: units[unit].conversions[targetUnit](value),
					name: units[targetUnit].name(
						units[unit].conversions[targetUnit](value)
					),
				})
			);

			// Insert the paragraph content without overwriting the toggle button
			const resultContent = generateResultsWithPrecision(
				conversions,
				unit,
				precisionStates[type]
			);
			const pElement =
				resultsDiv.querySelector("p") || document.createElement("p");
			pElement.innerHTML = resultContent;

			if (!pElement.parentNode) {
				resultsDiv.appendChild(pElement);
			}

			// Only add to history after debounce if flag is true
			if (addToHistoryFlag) {
				debouncedHistoryUpdate(value, unit, conversions);
			}
		} else {
			// Keep the toggle button but reset the content
			const pElement =
				resultsDiv.querySelector("p") || document.createElement("p");
			pElement.innerHTML = "Wybierz wartość aby zobaczyć przeliczenia";

			if (!pElement.parentNode) {
				resultsDiv.appendChild(pElement);
			}
		}
	}

	valueInput.addEventListener("input", () => updateResults(true));
	unitSelect.addEventListener("change", () => updateResults(true));
}

initConverter("length", {
	mm: {
		name: (val) => getUnitForm(val, "milimetr", "milimetrów"),
		conversions: {
			cm: (val) => val / 10,
			dm: (val) => val / 100,
			m: (val) => val / 1000,
			km: (val) => val / 1000000,
			in: (val) => val / 25.4,
			ft: (val) => val / 304.8,
			yd: (val) => val / 914.4,
			mi: (val) => val / 1609344,
			nm: (val) => val / 1852000, // Nautical mile
			um: (val) => val * 1000, // Micron (micrometer)
			A: (val) => val * 10000000, // Angstrom
			ly: (val) => val / 9.461e18, // Light year
			pc: (val) => val / 3.086e19, // Parsec
		},
	},
	cm: {
		name: (val) => getUnitForm(val, "centymetr", "centymetrów"),
		conversions: {
			mm: (val) => val * 10,
			dm: (val) => val / 10,
			m: (val) => val / 100,
			km: (val) => val / 100000,
			in: (val) => val / 2.54,
			ft: (val) => val / 30.48,
			yd: (val) => val / 91.44,
			mi: (val) => val / 160934.4,
			nm: (val) => val / 185200, // Nautical mile
			um: (val) => val * 10000, // Micron
			A: (val) => val * 100000000, // Angstrom
			ly: (val) => val / 9.461e17, // Light year
			pc: (val) => val / 3.086e18, // Parsec
		},
	},
	dm: {
		name: (val) => getUnitForm(val, "decymetr", "decymetrów"),
		conversions: {
			mm: (val) => val * 100,
			cm: (val) => val * 10,
			m: (val) => val / 10,
			km: (val) => val / 10000,
			in: (val) => val * 3.937,
			ft: (val) => val * 0.3281,
			yd: (val) => val * 0.1094,
			mi: (val) => val / 16093.44,
		},
	},
	m: {
		name: (val) => getUnitForm(val, "metr", "metrów"),
		conversions: {
			mm: (val) => val * 1000,
			cm: (val) => val * 100,
			dm: (val) => val * 10,
			km: (val) => val / 1000,
			in: (val) => val * 39.3701,
			ft: (val) => val * 3.28084,
			yd: (val) => val * 1.09361,
			mi: (val) => val / 1609.344,
		},
	},
	km: {
		name: (val) => getUnitForm(val, "kilometr", "kilometrów"),
		conversions: {
			mm: (val) => val * 1000000,
			cm: (val) => val * 100000,
			dm: (val) => val * 10000,
			m: (val) => val * 1000,
			in: (val) => val * 39370.1,
			ft: (val) => val * 3280.84,
			yd: (val) => val * 1093.61,
			mi: (val) => val * 0.621371,
		},
	},
	in: {
		name: (val) => getUnitForm(val, "cal", "cali"),
		conversions: {
			mm: (val) => val * 25.4,
			cm: (val) => val * 2.54,
			dm: (val) => val * 0.254,
			m: (val) => val * 0.0254,
			km: (val) => val * 0.0000254,
			ft: (val) => val / 12,
			yd: (val) => val / 36,
			mi: (val) => val / 63360,
		},
	},
	ft: {
		name: (val) => getUnitForm(val, "stopa", "stóp"),
		conversions: {
			mm: (val) => val * 304.8,
			cm: (val) => val * 30.48,
			dm: (val) => val * 3.048,
			m: (val) => val * 0.3048,
			km: (val) => val * 0.0003048,
			in: (val) => val * 12,
			yd: (val) => val * 3,
			mi: (val) => val / 5280,
		},
	},
	yd: {
		name: (val) => getUnitForm(val, "jard", "jardów"),
		conversions: {
			mm: (val) => val * 914.4,
			cm: (val) => val * 91.44,
			dm: (val) => val * 9.144,
			m: (val) => val * 0.9144,
			km: (val) => val * 0.0009144,
			in: (val) => val * 36,
			ft: (val) => val * 3,
			mi: (val) => val / 1760,
		},
	},
	mi: {
		name: (val) => getUnitForm(val, "mila", "mil"),
		conversions: {
			mm: (val) => val * 1609344,
			cm: (val) => val * 160934.4,
			dm: (val) => val * 16093.44,
			m: (val) => val * 1609.344,
			km: (val) => val * 1.609344,
			in: (val) => val * 63360,
			ft: (val) => val * 5280,
			yd: (val) => val * 1760,
		},
	},
	nm: {
		name: (val) => getUnitForm(val, "mila morska", "mil morskich"),
		conversions: {
			mm: (val) => val * 1852000,
			cm: (val) => val * 185200,
			dm: (val) => val * 18520,
			m: (val) => val * 1852,
			km: (val) => val * 1.852,
			in: (val) => val * 72913.4,
			ft: (val) => val * 6076.12,
			yd: (val) => val * 2025.37,
			mi: (val) => val * 1.15078,
			um: (val) => val * 1852000000, // Micron
			A: (val) => val * 1.852e13, // Angstrom
			ly: (val) => val / 5.108e15, // Light year
			pc: (val) => val / 1.668e16, // Parsec
		},
	},
	um: {
		name: (val) => getUnitForm(val, "mikrometr", "mikrometrów"),
		conversions: {
			mm: (val) => val / 1000,
			cm: (val) => val / 10000,
			dm: (val) => val / 100000,
			m: (val) => val / 1000000,
			km: (val) => val / 1000000000,
			in: (val) => val / 25400,
			ft: (val) => val / 304800,
			yd: (val) => val / 914400,
			mi: (val) => val / 1609344000,
			nm: (val) => val / 1852000000,
			A: (val) => val * 10000, // Angstrom
			ly: (val) => val / 9.461e21, // Light year
			pc: (val) => val / 3.086e22, // Parsec
		},
	},
	A: {
		name: (val) => getUnitForm(val, "angstrem", "angstremów"),
		conversions: {
			mm: (val) => val / 10000000,
			cm: (val) => val / 100000000,
			dm: (val) => val / 1000000000,
			m: (val) => val / 10000000000,
			km: (val) => val / 1e13,
			in: (val) => val / 254000000,
			ft: (val) => val / 3048000000,
			yd: (val) => val / 9144000000,
			mi: (val) => val / 1.609e13,
			nm: (val) => val / 1.852e13,
			um: (val) => val / 10000, // Micron
			ly: (val) => val / 9.461e25, // Light year
			pc: (val) => val / 3.086e26, // Parsec
		},
	},
	ly: {
		name: (val) => getUnitForm(val, "rok świetlny", "lat świetlnych"),
		conversions: {
			mm: (val) => val * 9.461e18,
			cm: (val) => val * 9.461e17,
			dm: (val) => val * 9.461e16,
			m: (val) => val * 9.461e15,
			km: (val) => val * 9.461e12,
			in: (val) => val * 3.725e17,
			ft: (val) => val * 3.104e16,
			yd: (val) => val * 1.035e16,
			mi: (val) => val * 5.879e12,
			nm: (val) => val * 5.108e15,
			um: (val) => val * 9.461e21,
			A: (val) => val * 9.461e25,
			pc: (val) => val * 0.306601, // Parsec
		},
	},
	pc: {
		name: (val) => getUnitForm(val, "parsek", "parseków"),
		conversions: {
			mm: (val) => val * 3.086e19,
			cm: (val) => val * 3.086e18,
			dm: (val) => val * 3.086e17,
			m: (val) => val * 3.086e16,
			km: (val) => val * 3.086e13,
			in: (val) => val * 1.215e18,
			ft: (val) => val * 1.012e17,
			yd: (val) => val * 3.375e16,
			mi: (val) => val * 1.917e13,
			nm: (val) => val * 1.668e16,
			um: (val) => val * 3.086e22,
			A: (val) => val * 3.086e26,
			ly: (val) => val * 3.26156, // Light year
		},
	},
});

initConverter("mass", {
	mg: {
		name: (val) => getUnitForm(val, "miligram", "miligramów"),
		conversions: {
			g: (val) => val / 1000,
			dag: (val) => val / 10000,
			kg: (val) => val / 1000000,
			t: (val) => val / 1000000000,
			oz: (val) => val / 28349.5,
			lb: (val) => val / 453592,
			st: (val) => val / 6350290,
			lt: (val) => val / 1016046900,
			st: (val) => val / 907184700,
			ct: (val) => val / 200,
			gr: (val) => val / 64.8,
		},
	},
	g: {
		name: (val) => getUnitForm(val, "gram", "gramów"),
		conversions: {
			mg: (val) => val * 1000,
			dag: (val) => val / 10,
			kg: (val) => val / 1000,
			t: (val) => val / 1000000,
			oz: (val) => val / 28.3495,
			lb: (val) => val / 453.592,
			st: (val) => val / 6350.29,
			lt: (val) => val / 1016050,
			st: (val) => val / 907185,
			ct: (val) => val * 5,
			gr: (val) => val * 15.4324,
		},
	},
	dag: {
		name: (val) => getUnitForm(val, "dekagram", "dekagramów"),
		conversions: {
			mg: (val) => val * 10000,
			g: (val) => val * 10,
			kg: (val) => val / 100,
			t: (val) => val / 100000,
			oz: (val) => val / 2.83495,
			lb: (val) => val / 45.3592,
			st: (val) => val / 635.029,
			lt: (val) => val / 101605,
			st: (val) => val / 90718.5,
			ct: (val) => val * 50,
			gr: (val) => val * 154.324,
		},
	},
	kg: {
		name: (val) => getUnitForm(val, "kilogram", "kilogramów"),
		conversions: {
			mg: (val) => val * 1000000,
			g: (val) => val * 1000,
			dag: (val) => val * 100,
			t: (val) => val / 1000,
			oz: (val) => val * 35.274,
			lb: (val) => val * 2.20462,
			st: (val) => val / 6.35029,
			lt: (val) => val / 1.01605,
			st: (val) => val / 0.907185,
			ct: (val) => val * 5000,
			gr: (val) => val * 15432.4,
		},
	},
	t: {
		name: (val) => getUnitForm(val, "tona", "ton"),
		conversions: {
			mg: (val) => val * 1000000000,
			g: (val) => val * 1000000,
			dag: (val) => val * 100000,
			kg: (val) => val * 1000,
			oz: (val) => val * 35274,
			lb: (val) => val * 2204.62,
			st: (val) => val * 157.473,
			lt: (val) => val * 0.984207,
			st: (val) => val * 1.10231,
			ct: (val) => val * 5000000,
			gr: (val) => val * 15432400,
		},
	},
	oz: {
		name: (val) => getUnitForm(val, "uncja", "uncji"),
		conversions: {
			mg: (val) => val * 28349.5,
			g: (val) => val * 28.3495,
			dag: (val) => val * 2.83495,
			kg: (val) => val * 0.0283495,
			t: (val) => val * 0.0000283495,
			lb: (val) => val / 16,
			st: (val) => val / 224,
			lt: (val) => val / 35840,
			st: (val) => val / 32000,
			ct: (val) => val * 141.748,
			gr: (val) => val * 437.5,
		},
	},
	lb: {
		name: (val) => getUnitForm(val, "funt", "funtów"),
		conversions: {
			mg: (val) => val * 453592,
			g: (val) => val * 453.592,
			dag: (val) => val * 45.3592,
			kg: (val) => val * 0.453592,
			t: (val) => val * 0.000453592,
			oz: (val) => val * 16,
			st: (val) => val / 14,
			lt: (val) => val / 2240,
			st: (val) => val / 2000,
			ct: (val) => val * 2267.96,
			gr: (val) => val * 7000,
		},
	},
	st: {
		name: (val) => getUnitForm(val, "kamień", "kamieni"),
		conversions: {
			mg: (val) => val * 6350290,
			g: (val) => val * 6350.29,
			dag: (val) => val * 635.029,
			kg: (val) => val * 6.35029,
			t: (val) => val * 0.00635029,
			oz: (val) => val * 224,
			lb: (val) => val * 14,
			lt: (val) => val / 160,
			st: (val) => val / 142.9,
			ct: (val) => val * 31751.5,
			gr: (val) => val * 98000,
		},
	},
	lt: {
		name: (val) => getUnitForm(val, "tona długa", "ton długich"),
		conversions: {
			mg: (val) => val * 1016046900,
			g: (val) => val * 1016050,
			dag: (val) => val * 101605,
			kg: (val) => val * 1016.05,
			t: (val) => val * 1.01605,
			oz: (val) => val * 35840,
			lb: (val) => val * 2240,
			st: (val) => val * 160,
			st: (val) => val * 1.12,
			ct: (val) => val * 5080230,
			gr: (val) => val * 15680000,
		},
	},
	st: {
		name: (val) => getUnitForm(val, "tona krótka", "ton krótkich"),
		conversions: {
			mg: (val) => val * 907184700,
			g: (val) => val * 907185,
			dag: (val) => val * 90718.5,
			kg: (val) => val * 907.185,
			t: (val) => val * 0.907185,
			oz: (val) => val * 32000,
			lb: (val) => val * 2000,
			st: (val) => val * 142.9,
			lt: (val) => val * 0.892857,
			ct: (val) => val * 4535920,
			gr: (val) => val * 14000000,
		},
	},
	ct: {
		name: (val) => getUnitForm(val, "karat", "karatów"),
		conversions: {
			mg: (val) => val * 200,
			g: (val) => val * 0.2,
			dag: (val) => val * 0.02,
			kg: (val) => val * 0.0002,
			t: (val) => val * 2e-7,
			oz: (val) => val * 0.007055,
			lb: (val) => val * 0.000441,
			st: (val) => val * 0.0000315,
			lt: (val) => val * 1.968e-7,
			st: (val) => val * 2.205e-7,
			gr: (val) => val * 3.086,
		},
	},
	gr: {
		name: (val) => getUnitForm(val, "gran", "granów"),
		conversions: {
			mg: (val) => val * 64.8,
			g: (val) => val * 0.0648,
			dag: (val) => val * 0.00648,
			kg: (val) => val * 0.0000648,
			t: (val) => val * 6.48e-8,
			oz: (val) => val * 0.002286,
			lb: (val) => val * 0.000143,
			st: (val) => val * 0.0000102,
			lt: (val) => val * 6.377e-8,
			st: (val) => val * 7.143e-8,
			ct: (val) => val * 0.324,
		},
	},
});

initConverter("temp", {
	c: {
		name: () => "°C",
		conversions: {
			f: (val) => (val * 9) / 5 + 32,
			k: (val) => val + 273.15,
		},
	},
	f: {
		name: () => "°F",
		conversions: {
			c: (val) => ((val - 32) * 5) / 9,
			k: (val) => ((val - 32) * 5) / 9 + 273.15,
		},
	},
	k: {
		name: () => "K",
		conversions: {
			c: (val) => val - 273.15,
			f: (val) => ((val - 273.15) * 9) / 5 + 32,
		},
	},
});

initConverter("volume", {
	ml: {
		name: (val) => getUnitForm(val, "mililitr", "mililitrów"),
		conversions: {
			cl: (val) => val / 10,
			dl: (val) => val / 100,
			l: (val) => val / 1000,
			m3: (val) => val / 1000000,
			gal: (val) => val / 3785.41,
			pt: (val) => val / 473.176,
			qt: (val) => val / 946.353,
		},
	},
	cl: {
		name: (val) => getUnitForm(val, "centilitr", "centilitrów"),
		conversions: {
			ml: (val) => val * 10,
			dl: (val) => val / 10,
			l: (val) => val / 100,
			m3: (val) => val / 100000,
			gal: (val) => val / 378.541,
			pt: (val) => val / 47.3176,
			qt: (val) => val / 94.6353,
		},
	},
	dl: {
		name: (val) => getUnitForm(val, "decylitr", "decylitrów"),
		conversions: {
			ml: (val) => val * 100,
			cl: (val) => val * 10,
			l: (val) => val / 10,
			m3: (val) => val / 10000,
			gal: (val) => val / 37.8541,
			pt: (val) => val / 4.73176,
			qt: (val) => val / 9.46353,
		},
	},
	l: {
		name: (val) => getUnitForm(val, "litr", "litrów"),
		conversions: {
			ml: (val) => val * 1000,
			cl: (val) => val * 100,
			dl: (val) => val * 10,
			m3: (val) => val / 1000,
			gal: (val) => val / 3.78541,
			pt: (val) => val / 0.473176,
			qt: (val) => val / 0.946353,
		},
	},
	m3: {
		name: (val) => getUnitForm(val, "metr³", "metrów³"),
		conversions: {
			ml: (val) => val * 1000000,
			cl: (val) => val * 100000,
			dl: (val) => val * 10000,
			l: (val) => val * 1000,
			gal: (val) => val * 264.172,
			pt: (val) => val * 2113.38,
			qt: (val) => val * 1056.69,
		},
	},
	gal: {
		name: (val) => getUnitForm(val, "galon", "galonów"),
		conversions: {
			ml: (val) => val * 3785.41,
			cl: (val) => val * 378.541,
			dl: (val) => val * 37.8541,
			l: (val) => val * 3.78541,
			m3: (val) => val / 264.172,
			pt: (val) => val * 8,
			qt: (val) => val * 4,
		},
	},
	pt: {
		name: (val) => getUnitForm(val, "pinta", "pint"),
		conversions: {
			ml: (val) => val * 473.176,
			cl: (val) => val * 47.3176,
			dl: (val) => val * 4.73176,
			l: (val) => val * 0.473176,
			m3: (val) => val / 2113.38,
			gal: (val) => val / 8,
			qt: (val) => val / 2,
		},
	},
	qt: {
		name: (val) => getUnitForm(val, "kwarta", "kwart"),
		conversions: {
			ml: (val) => val * 946.353,
			cl: (val) => val * 94.6353,
			dl: (val) => val * 9.46353,
			l: (val) => val * 0.946353,
			m3: (val) => val / 1056.69,
			gal: (val) => val / 4,
			pt: (val) => val * 2,
		},
	},
	ci: {
		name: (val) => getUnitForm(val, "cal³", "cali³"),
		conversions: {
			ml: (val) => val * 16.387,
			cl: (val) => val * 1.6387,
			dl: (val) => val * 0.16387,
			l: (val) => val * 0.016387,
			m3: (val) => val * 0.000016387,
			gal: (val) => val * 0.004329,
			pt: (val) => val * 0.034632,
			qt: (val) => val * 0.017316,
			cf: (val) => val / 1728,
			cy: (val) => val / 46656,
			floz: (val) => val * 0.554113,
			tbsp: (val) => val * 1.10823,
			tsp: (val) => val * 3.32468,
		},
	},
	cf: {
		name: (val) => getUnitForm(val, "stopa³", "stóp³"),
		conversions: {
			ml: (val) => val * 28316.8,
			cl: (val) => val * 2831.68,
			dl: (val) => val * 283.168,
			l: (val) => val * 28.3168,
			m3: (val) => val * 0.0283168,
			gal: (val) => val * 7.48052,
			pt: (val) => val * 59.8442,
			qt: (val) => val * 29.9221,
			ci: (val) => val * 1728,
			cy: (val) => val / 27,
			floz: (val) => val * 957.506,
			tbsp: (val) => val * 1915.01,
			tsp: (val) => val * 5745.04,
		},
	},
	cy: {
		name: (val) => getUnitForm(val, "jard³", "jardów³"),
		conversions: {
			ml: (val) => val * 764555,
			cl: (val) => val * 76455.5,
			dl: (val) => val * 7645.55,
			l: (val) => val * 764.555,
			m3: (val) => val * 0.764555,
			gal: (val) => val * 201.974,
			pt: (val) => val * 1615.79,
			qt: (val) => val * 807.896,
			ci: (val) => val * 46656,
			cf: (val) => val * 27,
			floz: (val) => val * 25852.7,
			tbsp: (val) => val * 51705.3,
			tsp: (val) => val * 155116,
		},
	},
	floz: {
		name: (val) => getUnitForm(val, "uncja płynna", "uncji płynnych"),
		conversions: {
			ml: (val) => val * 29.5735,
			cl: (val) => val * 2.95735,
			dl: (val) => val * 0.295735,
			l: (val) => val * 0.0295735,
			m3: (val) => val * 2.95735e-5,
			gal: (val) => val * 0.0078125,
			pt: (val) => val * 0.0625,
			qt: (val) => val * 0.03125,
			ci: (val) => val * 1.80469,
			cf: (val) => val * 0.00104438,
			cy: (val) => val * 0.0000387,
			tbsp: (val) => val * 2,
			tsp: (val) => val * 6,
		},
	},
	tbsp: {
		name: (val) => getUnitForm(val, "łyżka stołowa", "łyżek stołowych"),
		conversions: {
			ml: (val) => val * 14.7868,
			cl: (val) => val * 1.47868,
			dl: (val) => val * 0.147868,
			l: (val) => val * 0.0147868,
			m3: (val) => val * 1.47868e-5,
			gal: (val) => val * 0.00390625,
			pt: (val) => val * 0.03125,
			qt: (val) => val * 0.015625,
			ci: (val) => val * 0.902344,
			cf: (val) => val * 0.000522192,
			cy: (val) => val * 0.0000193,
			floz: (val) => val * 0.5,
			tsp: (val) => val * 3,
		},
	},
	tsp: {
		name: (val) => getUnitForm(val, "łyżeczka", "łyżeczek"),
		conversions: {
			ml: (val) => val * 4.92892,
			cl: (val) => val * 0.492892,
			dl: (val) => val * 0.0492892,
			l: (val) => val * 0.00492892,
			m3: (val) => val * 4.92892e-6,
			gal: (val) => val * 0.00130208,
			pt: (val) => val * 0.0104167,
			qt: (val) => val * 0.00520833,
			ci: (val) => val * 0.300781,
			cf: (val) => val * 0.000174064,
			cy: (val) => val * 0.00000645,
			floz: (val) => val * 0.166667,
			tbsp: (val) => val / 3,
		},
	},
});

initConverter("area", {
	mm2: {
		name: (val) => getUnitForm(val, "milimetr²", "milimetrów²"),
		conversions: {
			cm2: (val) => val / 100,
			m2: (val) => val / 1000000,
			a: (val) => val / 100000000,
			ha: (val) => val / 10000000000,
			km2: (val) => val / 1000000000000,
			in2: (val) => val / 645.16,
			ft2: (val) => val / 92903,
			ac: (val) => val / 4046856422,
		},
	},
	cm2: {
		name: (val) => getUnitForm(val, "centymetr²", "centymetrów²"),
		conversions: {
			mm2: (val) => val * 100,
			m2: (val) => val / 10000,
			a: (val) => val / 1000000,
			ha: (val) => val / 100000000,
			km2: (val) => val / 10000000000,
			in2: (val) => val / 6.4516,
			ft2: (val) => val / 929.03,
			ac: (val) => val / 40468564.2,
		},
	},
	m2: {
		name: (val) => getUnitForm(val, "metr²", "metrów²"),
		conversions: {
			mm2: (val) => val * 1000000,
			cm2: (val) => val * 10000,
			a: (val) => val / 100,
			ha: (val) => val / 10000,
			km2: (val) => val / 1000000,
			in2: (val) => val * 1550,
			ft2: (val) => val * 10.7639,
			ac: (val) => val / 4046.85642,
		},
	},
	a: {
		name: (val) => getUnitForm(val, "ar", "arów"),
		conversions: {
			mm2: (val) => val * 100000000,
			cm2: (val) => val * 1000000,
			m2: (val) => val * 100,
			ha: (val) => val / 100,
			km2: (val) => val / 100000,
			in2: (val) => val * 155000,
			ft2: (val) => val * 1076.39,
			ac: (val) => val / 40.4685642,
		},
	},
	ha: {
		name: (val) => getUnitForm(val, "hektar", "hektarów"),
		conversions: {
			mm2: (val) => val * 10000000000,
			cm2: (val) => val * 100000000,
			m2: (val) => val * 10000,
			a: (val) => val * 100,
			km2: (val) => val / 100,
			in2: (val) => val * 15500000,
			ft2: (val) => val * 107639,
			ac: (val) => val * 2.47105,
		},
	},
	km2: {
		name: (val) => getUnitForm(val, "kilometr²", "kilometrów²"),
		conversions: {
			mm2: (val) => val * 1000000000000,
			cm2: (val) => val * 10000000000,
			m2: (val) => val * 1000000,
			a: (val) => val * 100000,
			ha: (val) => val * 100,
			in2: (val) => val * 1550000000,
			ft2: (val) => val * 10763910.4,
			ac: (val) => val * 247.105,
		},
	},
	in2: {
		name: (val) => getUnitForm(val, "cal²", "cali²"),
		conversions: {
			mm2: (val) => val * 645.16,
			cm2: (val) => val * 6.4516,
			m2: (val) => val / 1550,
			a: (val) => val / 155000,
			ha: (val) => val / 15500000,
			km2: (val) => val / 1550000000,
			ft2: (val) => val / 144,
			ac: (val) => val / 6272640,
		},
	},
	ft2: {
		name: (val) => getUnitForm(val, "stopa²", "stóp²"),
		conversions: {
			mm2: (val) => val * 92903,
			cm2: (val) => val * 929.03,
			m2: (val) => val / 10.7639,
			a: (val) => val / 1076.39,
			ha: (val) => val / 107639,
			km2: (val) => val / 10763910.4,
			in2: (val) => val * 144,
			ac: (val) => val / 43560,
		},
	},
	ac: {
		name: (val) => getUnitForm(val, "akr", "akrów"),
		conversions: {
			mm2: (val) => val * 4046856422,
			cm2: (val) => val * 40468564.2,
			m2: (val) => val * 4046.85642,
			a: (val) => val * 40.4685642,
			ha: (val) => val / 2.47105,
			km2: (val) => val / 247.105,
			in2: (val) => val * 6272640,
			ft2: (val) => val * 43560,
		},
	},
});

initConverter("time", {
	ms: {
		name: (val) => getUnitForm(val, "milisekunda", "milisekund"),
		conversions: {
			s: (val) => val / 1000,
			min: (val) => val / 60000,
			h: (val) => val / 3600000,
			d: (val) => val / 86400000,
			wk: (val) => val / 604800000,
			mo: (val) => val / 2628000000,
			yr: (val) => val / 31536000000,
		},
	},
	s: {
		name: (val) => getUnitForm(val, "sekunda", "sekund"),
		conversions: {
			ms: (val) => val * 1000,
			min: (val) => val / 60,
			h: (val) => val / 3600,
			d: (val) => val / 86400,
			wk: (val) => val / 604800,
			mo: (val) => val / 2628000,
			yr: (val) => val / 31536000,
		},
	},
	min: {
		name: (val) => getUnitForm(val, "minuta", "minut"),
		conversions: {
			ms: (val) => val * 60000,
			s: (val) => val * 60,
			h: (val) => val / 60,
			d: (val) => val / 1440,
			wk: (val) => val / 10080,
			mo: (val) => val / 43800,
			yr: (val) => val / 525600,
		},
	},
	h: {
		name: (val) => getUnitForm(val, "godzina", "godzin"),
		conversions: {
			ms: (val) => val * 3600000,
			s: (val) => val * 3600,
			min: (val) => val * 60,
			d: (val) => val / 24,
			wk: (val) => val / 168,
			mo: (val) => val / 730,
			yr: (val) => val / 8760,
		},
	},
	d: {
		name: (val) => getUnitForm(val, "dzień", "dni"),
		conversions: {
			ms: (val) => val * 86400000,
			s: (val) => val * 86400,
			min: (val) => val * 1440,
			h: (val) => val * 24,
			wk: (val) => val / 7,
			mo: (val) => val / 30.417,
			yr: (val) => val / 365,
		},
	},
	wk: {
		name: (val) => getUnitForm(val, "tydzień", "tygodni"),
		conversions: {
			ms: (val) => val * 604800000,
			s: (val) => val * 604800,
			min: (val) => val * 10080,
			h: (val) => val * 168,
			d: (val) => val * 7,
			mo: (val) => val / 4.345,
			yr: (val) => val / 52.143,
		},
	},
	mo: {
		name: (val) => getUnitForm(val, "miesiąc", "miesięcy"),
		conversions: {
			ms: (val) => val * 2628000000,
			s: (val) => val * 2628000,
			min: (val) => val * 43800,
			h: (val) => val * 730,
			d: (val) => val * 30.417,
			wk: (val) => val * 4.345,
			yr: (val) => val / 12,
		},
	},
	yr: {
		name: (val) => getUnitForm(val, "rok", "lat"),
		conversions: {
			ms: (val) => val * 31536000000,
			s: (val) => val * 31536000,
			min: (val) => val * 525600,
			h: (val) => val * 8760,
			d: (val) => val * 365,
			wk: (val) => val * 52.143,
			mo: (val) => val * 12,
		},
	},
});

initConverter("speed", {
	mps: {
		name: (val) => getUnitForm(val, "metr na sekundę", "metrów na sekundę"),
		conversions: {
			kph: (val) => val * 3.6,
			mph: (val) => val * 2.23694,
			fps: (val) => val * 3.28084,
			knot: (val) => val * 1.94384,
		},
	},
	kph: {
		name: (val) =>
			getUnitForm(val, "kilometr na godzinę", "kilometrów na godzinę"),
		conversions: {
			mps: (val) => val / 3.6,
			mph: (val) => val / 1.60934,
			fps: (val) => val / 1.09728,
			knot: (val) => val / 1.852,
		},
	},
	mph: {
		name: (val) => getUnitForm(val, "mila na godzinę", "mil na godzinę"),
		conversions: {
			mps: (val) => val / 2.23694,
			kph: (val) => val * 1.60934,
			fps: (val) => val * 1.46667,
			knot: (val) => val / 1.15078,
		},
	},
	fps: {
		name: (val) => getUnitForm(val, "stopa na sekundę", "stóp na sekundę"),
		conversions: {
			mps: (val) => val / 3.28084,
			kph: (val) => val * 1.09728,
			mph: (val) => val / 1.46667,
			knot: (val) => val / 1.68781,
		},
	},
	knot: {
		name: (val) => getUnitForm(val, "węzeł", "węzłów"),
		conversions: {
			mps: (val) => val / 1.94384,
			kph: (val) => val * 1.852,
			mph: (val) => val * 1.15078,
			fps: (val) => val * 1.68781,
		},
	},
});

initConverter("energy", {
	j: {
		name: (val) => getUnitForm(val, "dżul", "dżuli"),
		conversions: {
			cal: (val) => val / 4.184,
			kcal: (val) => val / 4184,
			kwh: (val) => val / 3600000,
			ev: (val) => val * 6.242e18,
			btu: (val) => val / 1055.06,
		},
	},
	cal: {
		name: (val) => getUnitForm(val, "kaloria", "kalorii"),
		conversions: {
			j: (val) => val * 4.184,
			kcal: (val) => val / 1000,
			kwh: (val) => val / 860420,
			ev: (val) => val * 2.611e19,
			btu: (val) => val / 252.164,
		},
	},
	kcal: {
		name: (val) => getUnitForm(val, "kilokaloria", "kilokalorii"),
		conversions: {
			j: (val) => val * 4184,
			cal: (val) => val * 1000,
			kwh: (val) => val / 860.42,
			ev: (val) => val * 2.611e22,
			btu: (val) => val * 3.96567,
		},
	},
	kwh: {
		name: (val) => getUnitForm(val, "kilowatogodzina", "kilowatogodzin"),
		conversions: {
			j: (val) => val * 3600000,
			cal: (val) => val * 860420,
			kcal: (val) => val * 860.42,
			ev: (val) => val * 2.247e25,
			btu: (val) => val * 3412.14,
		},
	},
	ev: {
		name: (val) => getUnitForm(val, "elektronowolt", "elektronowoltów"),
		conversions: {
			j: (val) => val / 6.242e18,
			cal: (val) => val / 2.611e19,
			kcal: (val) => val / 2.611e22,
			kwh: (val) => val / 2.247e25,
			btu: (val) => val / 6.585e21,
		},
	},
	btu: {
		name: (val) => getUnitForm(val, "BTU", "BTU"),
		conversions: {
			j: (val) => val * 1055.06,
			cal: (val) => val * 252.164,
			kcal: (val) => val / 3.96567,
			kwh: (val) => val / 3412.14,
			ev: (val) => val * 6.585e21,
		},
	},
});

initConverter("pressure", {
	pa: {
		name: (val) => getUnitForm(val, "Pascal", "Pascali"),
		conversions: {
			hpa: (val) => val / 100,
			kpa: (val) => val / 1000,
			mpa: (val) => val / 1000000,
			bar: (val) => val / 100000,
			atm: (val) => val / 101325,
			psi: (val) => val / 6894.76,
			mmhg: (val) => val / 133.322,
			inhg: (val) => val / 3386.39,
		},
	},
	hpa: {
		name: (val) => getUnitForm(val, "Hektopaskal", "Hektopascali"),
		conversions: {
			pa: (val) => val * 100,
			kpa: (val) => val / 10,
			mpa: (val) => val / 10000,
			bar: (val) => val / 1000,
			atm: (val) => val / 1013.25,
			psi: (val) => val / 68.9476,
			mmhg: (val) => val / 1.33322,
			inhg: (val) => val / 33.8639,
		},
	},
	kpa: {
		name: (val) => getUnitForm(val, "Kilopaskal", "Kilopascali"),
		conversions: {
			pa: (val) => val * 1000,
			hpa: (val) => val * 10,
			mpa: (val) => val / 1000,
			bar: (val) => val / 100,
			atm: (val) => val / 101.325,
			psi: (val) => val / 6.89476,
			mmhg: (val) => val * 7.50062,
			inhg: (val) => val / 3.38639,
		},
	},
	mpa: {
		name: (val) => getUnitForm(val, "Megapaskal", "Megapascali"),
		conversions: {
			pa: (val) => val * 1000000,
			hpa: (val) => val * 10000,
			kpa: (val) => val * 1000,
			bar: (val) => val * 10,
			atm: (val) => val * 9.86923,
			psi: (val) => val * 145.038,
			mmhg: (val) => val * 7500.62,
			inhg: (val) => val * 295.3,
		},
	},
	bar: {
		name: (val) => getUnitForm(val, "Bar", "Barów"),
		conversions: {
			pa: (val) => val * 100000,
			hpa: (val) => val * 1000,
			kpa: (val) => val * 100,
			mpa: (val) => val / 10,
			atm: (val) => val / 1.01325,
			psi: (val) => val * 14.5038,
			mmhg: (val) => val * 750.062,
			inhg: (val) => val * 29.53,
		},
	},
	atm: {
		name: (val) => getUnitForm(val, "Atmosfera", "Atmosfer"),
		conversions: {
			pa: (val) => val * 101325,
			hpa: (val) => val * 1013.25,
			kpa: (val) => val * 101.325,
			mpa: (val) => val * 0.101325,
			bar: (val) => val * 1.01325,
			psi: (val) => val * 14.6959,
			mmhg: (val) => val * 760,
			inhg: (val) => val * 29.9213,
		},
	},
	psi: {
		name: (val) => getUnitForm(val, "PSI", "PSI"),
		conversions: {
			pa: (val) => val * 6894.76,
			hpa: (val) => val * 68.9476,
			kpa: (val) => val * 6.89476,
			mpa: (val) => val * 0.00689476,
			bar: (val) => val * 0.0689476,
			atm: (val) => val * 0.068046,
			mmhg: (val) => val * 51.7149,
			inhg: (val) => val * 2.03602,
		},
	},
	mmhg: {
		name: (val) => getUnitForm(val, "mmHg", "mmHg"),
		conversions: {
			pa: (val) => val * 133.322,
			hpa: (val) => val * 1.33322,
			kpa: (val) => val * 0.133322,
			mpa: (val) => val * 0.000133322,
			bar: (val) => val * 0.00133322,
			atm: (val) => val / 760,
			psi: (val) => val * 0.0193368,
			inhg: (val) => val * 0.0393701,
		},
	},
	inhg: {
		name: (val) => getUnitForm(val, "inHg", "inHg"),
		conversions: {
			pa: (val) => val * 3386.39,
			hpa: (val) => val * 33.8639,
			kpa: (val) => val * 3.38639,
			mpa: (val) => val * 0.00338639,
			bar: (val) => val * 0.0338639,
			atm: (val) => val * 0.0334211,
			psi: (val) => val * 0.49115,
			mmhg: (val) => val * 25.4,
		},
	},
});

initConverter("power", {
	w: {
		name: (val) => getUnitForm(val, "Wat", "Watów"),
		conversions: {
			kw: (val) => val / 1000,
			mw: (val) => val / 1000000,
			hp: (val) => val / 745.7,
			ps: (val) => val / 735.5,
			btu: (val) => val * 3.41214,
		},
	},
	kw: {
		name: (val) => getUnitForm(val, "Kilowat", "Kilowatów"),
		conversions: {
			w: (val) => val * 1000,
			mw: (val) => val / 1000,
			hp: (val) => val * 1.34102,
			ps: (val) => val * 1.35962,
			btu: (val) => val * 3412.14,
		},
	},
	mw: {
		name: (val) => getUnitForm(val, "Megawat", "Megawatów"),
		conversions: {
			w: (val) => val * 1000000,
			kw: (val) => val * 1000,
			hp: (val) => val * 1341.02,
			ps: (val) => val * 1359.62,
			btu: (val) => val * 3412140,
		},
	},
	hp: {
		name: (val) =>
			getUnitForm(val, "Koń mechaniczny (hp)", "Koni mechanicznych (hp)"),
		conversions: {
			w: (val) => val * 745.7,
			kw: (val) => val * 0.7457,
			mw: (val) => val * 0.0007457,
			ps: (val) => val * 1.01387,
			btu: (val) => val * 2544.43,
		},
	},
	ps: {
		name: (val) =>
			getUnitForm(val, "Koń mechaniczny (PS)", "Koni mechanicznych (PS)"),
		conversions: {
			w: (val) => val * 735.5,
			kw: (val) => val * 0.7355,
			mw: (val) => val * 0.0007355,
			hp: (val) => val * 0.986323,
			btu: (val) => val * 2510.4,
		},
	},
	btu: {
		name: (val) => getUnitForm(val, "BTU/h", "BTU/h"),
		conversions: {
			w: (val) => val * 0.293071,
			kw: (val) => val * 0.000293071,
			mw: (val) => val * 2.93071e-7,
			hp: (val) => val * 0.000393015,
			ps: (val) => val * 0.000398466,
		},
	},
});

initConverter("data", {
	b: {
		name: (val) => getUnitForm(val, "Bit", "Bitów"),
		conversions: {
			B: (val) => val / 8,
			KB: (val) => val / 8192,
			MB: (val) => val / 8388608,
			GB: (val) => val / 8589934592,
			TB: (val) => val / 8796093022208,
			PB: (val) => val / 9007199254740992,
		},
	},
	B: {
		name: (val) => getUnitForm(val, "Bajt", "Bajtów"),
		conversions: {
			b: (val) => val * 8,
			KB: (val) => val / 1024,
			MB: (val) => val / 1048576,
			GB: (val) => val / 1073741824,
			TB: (val) => val / 1099511627776,
			PB: (val) => val / 1125899906842624,
		},
	},
	KB: {
		name: (val) => getUnitForm(val, "Kilobajt", "Kilobajtów"),
		conversions: {
			b: (val) => val * 8192,
			B: (val) => val * 1024,
			MB: (val) => val / 1024,
			GB: (val) => val / 1048576,
			TB: (val) => val / 1073741824,
			PB: (val) => val / 1099511627776,
		},
	},
	MB: {
		name: (val) => getUnitForm(val, "Megabajt", "Megabajtów"),
		conversions: {
			b: (val) => val * 8388608,
			B: (val) => val * 1048576,
			KB: (val) => val * 1024,
			GB: (val) => val / 1024,
			TB: (val) => val / 1048576,
			PB: (val) => val / 1073741824,
		},
	},
	GB: {
		name: (val) => getUnitForm(val, "Gigabajt", "Gigabajtów"),
		conversions: {
			b: (val) => val * 8589934592,
			B: (val) => val * 1073741824,
			KB: (val) => val * 1048576,
			MB: (val) => val * 1024,
			TB: (val) => val / 1024,
			PB: (val) => val / 1048576,
		},
	},
	TB: {
		name: (val) => getUnitForm(val, "Terabajt", "Terabajtów"),
		conversions: {
			b: (val) => val * 8796093022208,
			B: (val) => val * 1099511627776,
			KB: (val) => val * 1073741824,
			MB: (val) => val * 1048576,
			GB: (val) => val * 1024,
			PB: (val) => val / 1024,
		},
	},
	PB: {
		name: (val) => getUnitForm(val, "Petabajt", "Petabajtów"),
		conversions: {
			b: (val) => val * 9007199254740992,
			B: (val) => val * 1125899906842624,
			KB: (val) => val * 1099511627776,
			MB: (val) => val * 1073741824,
			GB: (val) => val * 1048576,
			TB: (val) => val * 1024,
		},
	},
});

initConverter("freq", {
	hz: {
		name: (val) => getUnitForm(val, "Herc", "Herców"),
		conversions: {
			khz: (val) => val / 1000,
			mhz: (val) => val / 1000000,
			ghz: (val) => val / 1000000000,
		},
	},
	khz: {
		name: (val) => getUnitForm(val, "Kiloherc", "Kiloherców"),
		conversions: {
			hz: (val) => val * 1000,
			mhz: (val) => val / 1000,
			ghz: (val) => val / 1000000,
		},
	},
	mhz: {
		name: (val) => getUnitForm(val, "Megaherc", "Megaherców"),
		conversions: {
			hz: (val) => val * 1000000,
			khz: (val) => val * 1000,
			ghz: (val) => val / 1000,
		},
	},
	ghz: {
		name: (val) => getUnitForm(val, "Gigaherc", "Gigaherców"),
		conversions: {
			hz: (val) => val * 1000000000,
			khz: (val) => val * 1000000,
			mhz: (val) => val * 1000,
		},
	},
});

// Sound converter
initConverter("sound", {
	db: {
		name: (val) => getUnitForm(val, "decybel", "decybeli"),
		conversions: {
			np: (val) => val / 8.686,
			phon: (val) => val, // Approximate at 1kHz
			sone: (val) => Math.pow(2, (val - 40) / 10),
			spl: (val) => val, // At reference level
		},
	},
	np: {
		name: (val) => getUnitForm(val, "neper", "neperów"),
		conversions: {
			db: (val) => val * 8.686,
			phon: (val) => val * 8.686, // Approximate at 1kHz
			sone: (val) => Math.pow(2, (val * 8.686 - 40) / 10),
			spl: (val) => val * 8.686, // At reference level
		},
	},
	phon: {
		name: (val) => getUnitForm(val, "fon", "fonów"),
		conversions: {
			db: (val) => val, // Approximate at 1kHz
			np: (val) => val / 8.686,
			sone: (val) => Math.pow(2, (val - 40) / 10),
			spl: (val) => val, // At reference level
		},
	},
	sone: {
		name: (val) => getUnitForm(val, "son", "sonów"),
		conversions: {
			db: (val) => 40 + (10 * Math.log10(val)) / Math.log10(2),
			np: (val) => (40 + (10 * Math.log10(val)) / Math.log10(2)) / 8.686,
			phon: (val) => 40 + (10 * Math.log10(val)) / Math.log10(2),
			spl: (val) => 40 + (10 * Math.log10(val)) / Math.log10(2),
		},
	},
	spl: {
		name: (val) => "SPL",
		conversions: {
			db: (val) => val,
			np: (val) => val / 8.686,
			phon: (val) => val, // Approximate at 1kHz
			sone: (val) => Math.pow(2, (val - 40) / 10),
		},
	},
});

// Density converter
initConverter("density", {
	kgm3: {
		name: (val) => getUnitForm(val, "kilogram/metr³", "kilogramów/metr³"),
		conversions: {
			gcm3: (val) => val / 1000,
			lbft3: (val) => val * 0.0624,
			lbgal: (val) => val * 0.00835,
		},
	},
	gcm3: {
		name: (val) => getUnitForm(val, "gram/centymetr³", "gramów/centymetr³"),
		conversions: {
			kgm3: (val) => val * 1000,
			lbft3: (val) => val * 62.4,
			lbgal: (val) => val * 8.35,
		},
	},
	lbft3: {
		name: (val) => getUnitForm(val, "funt/stopa³", "funtów/stopa³"),
		conversions: {
			kgm3: (val) => val / 0.0624,
			gcm3: (val) => val / 62.4,
			lbgal: (val) => val * 0.1337,
		},
	},
	lbgal: {
		name: (val) => getUnitForm(val, "funt/galon", "funtów/galon"),
		conversions: {
			kgm3: (val) => val / 0.00835,
			gcm3: (val) => val / 8.35,
			lbft3: (val) => val / 0.1337,
		},
	},
});

// Light quantity converter
initConverter("light", {
	lm: {
		name: (val) => getUnitForm(val, "lumen", "lumenów"),
		conversions: {
			cd: (val) => val / (4 * Math.PI), // For isotropic source
			lx: (val) => val, // At 1 square meter
			talbot: (val) => val, // For 1 second
		},
	},
	cd: {
		name: (val) => getUnitForm(val, "kandela", "kandeli"),
		conversions: {
			lm: (val) => val * (4 * Math.PI), // Solid angle of sphere
			lx: (val) => val * (4 * Math.PI), // At 1 square meter
			talbot: (val) => val * (4 * Math.PI), // For 1 second
		},
	},
	lx: {
		name: (val) => getUnitForm(val, "luks", "luksów"),
		conversions: {
			lm: (val) => val, // For 1 square meter
			cd: (val) => val / (4 * Math.PI), // At 1 square meter
			talbot: (val) => val, // For 1 second
		},
	},
	talbot: {
		name: (val) => getUnitForm(val, "talbot", "talbotów"),
		conversions: {
			lm: (val) => val, // For 1 second
			cd: (val) => val / (4 * Math.PI), // For 1 second
			lx: (val) => val, // For 1 square meter and 1 second
		},
	},
});

// Magnetic induction converter
initConverter("magnetic", {
	t: {
		name: (val) => getUnitForm(val, "tesla", "tesli"),
		conversions: {
			g: (val) => val * 10000,
			mt: (val) => val * 1000,
			ut: (val) => val * 1000000,
			wb: (val) => val, // Weber per square meter is same as tesla
		},
	},
	g: {
		name: (val) => getUnitForm(val, "gauss", "gaussów"),
		conversions: {
			t: (val) => val / 10000,
			mt: (val) => val / 10,
			ut: (val) => val * 100,
			wb: (val) => val / 10000,
		},
	},
	mt: {
		name: (val) => getUnitForm(val, "militesla", "militesli"),
		conversions: {
			t: (val) => val / 1000,
			g: (val) => val * 10,
			ut: (val) => val * 1000,
			wb: (val) => val / 1000,
		},
	},
	ut: {
		name: (val) => getUnitForm(val, "mikrotesla", "mikrotesli"),
		conversions: {
			t: (val) => val / 1000000,
			g: (val) => val / 100,
			mt: (val) => val / 1000,
			wb: (val) => val / 1000000,
		},
	},
	wb: {
		name: (val) => getUnitForm(val, "weber/metr²", "weberów/metr²"),
		conversions: {
			t: (val) => val,
			g: (val) => val * 10000,
			mt: (val) => val * 1000,
			ut: (val) => val * 1000000,
		},
	},
});

// Inductance converter
initConverter("inductance", {
	h: {
		name: (val) => getUnitForm(val, "henry", "henry"),
		conversions: {
			mh: (val) => val * 1000,
			uh: (val) => val * 1000000,
			nh: (val) => val * 1000000000,
		},
	},
	mh: {
		name: (val) => getUnitForm(val, "milihenry", "milihenry"),
		conversions: {
			h: (val) => val / 1000,
			uh: (val) => val * 1000,
			nh: (val) => val * 1000000,
		},
	},
	uh: {
		name: (val) => getUnitForm(val, "mikrohenry", "mikrohenry"),
		conversions: {
			h: (val) => val / 1000000,
			mh: (val) => val / 1000,
			nh: (val) => val * 1000,
		},
	},
	nh: {
		name: (val) => getUnitForm(val, "nanohenry", "nanohenry"),
		conversions: {
			h: (val) => val / 1000000000,
			mh: (val) => val / 1000000,
			uh: (val) => val / 1000,
		},
	},
});

// Angle converter
initConverter("angle", {
	deg: {
		name: (val) => getUnitForm(val, "stopień", "stopni"),
		conversions: {
			rad: (val) => (val * Math.PI) / 180,
			gon: (val) => (val * 10) / 9,
			arcmin: (val) => val * 60,
			arcsec: (val) => val * 3600,
		},
	},
	rad: {
		name: (val) => getUnitForm(val, "radian", "radianów"),
		conversions: {
			deg: (val) => (val * 180) / Math.PI,
			gon: (val) => (val * 200) / Math.PI,
			arcmin: (val) => (val * 10800) / Math.PI,
			arcsec: (val) => (val * 648000) / Math.PI,
		},
	},
	gon: {
		name: (val) => getUnitForm(val, "gradus", "gradusów"),
		conversions: {
			deg: (val) => val * 0.9,
			rad: (val) => (val * Math.PI) / 200,
			arcmin: (val) => val * 54,
			arcsec: (val) => val * 3240,
		},
	},
	arcmin: {
		name: (val) => getUnitForm(val, "minuta kątowa", "minut kątowych"),
		conversions: {
			deg: (val) => val / 60,
			rad: (val) => (val * Math.PI) / 10800,
			gon: (val) => val / 54,
			arcsec: (val) => val * 60,
		},
	},
	arcsec: {
		name: (val) => getUnitForm(val, "sekunda kątowa", "sekund kątowych"),
		conversions: {
			deg: (val) => val / 3600,
			rad: (val) => (val * Math.PI) / 648000,
			gon: (val) => val / 3240,
			arcmin: (val) => val / 60,
		},
	},
});

// Viscosity converter
initConverter("viscosity", {
	m2s: {
		name: (val) => getUnitForm(val, "metr² na sekundę", "metrów² na sekundę"),
		conversions: {
			stoke: (val) => val * 10000,
			cstoke: (val) => val * 1000000,
			ft2s: (val) => val * 10.7639,
		},
	},
	stoke: {
		name: (val) => getUnitForm(val, "stokes", "stokesów"),
		conversions: {
			m2s: (val) => val / 10000,
			cstoke: (val) => val * 100,
			ft2s: (val) => val / 929.03,
		},
	},
	cstoke: {
		name: (val) => getUnitForm(val, "centystokes", "centystokesów"),
		conversions: {
			m2s: (val) => val / 1000000,
			stoke: (val) => val / 100,
			ft2s: (val) => val / 92903,
		},
	},
	ft2s: {
		name: (val) => getUnitForm(val, "stopa² na sekundę", "stóp² na sekundę"),
		conversions: {
			m2s: (val) => val / 10.7639,
			stoke: (val) => val * 929.03,
			cstoke: (val) => val * 92903,
		},
	},
});

// Luminance converter
initConverter("luminance", {
	cdm2: {
		name: (val) => getUnitForm(val, "kandela na metr²", "kandeli na metr²"),
		conversions: {
			nit: (val) => val,
			stilb: (val) => val / 10000,
			apostilb: (val) => val * 0.3183,
			fl: (val) => val * 0.2919,
		},
	},
	nit: {
		name: (val) => getUnitForm(val, "nit", "nitów"),
		conversions: {
			cdm2: (val) => val,
			stilb: (val) => val / 10000,
			apostilb: (val) => val * 0.3183,
			fl: (val) => val * 0.2919,
		},
	},
	stilb: {
		name: (val) => getUnitForm(val, "stilb", "stilbów"),
		conversions: {
			cdm2: (val) => val * 10000,
			nit: (val) => val * 10000,
			apostilb: (val) => val * 3183.1,
			fl: (val) => val * 2919,
		},
	},
	apostilb: {
		name: (val) => getUnitForm(val, "apostilb", "apostilbów"),
		conversions: {
			cdm2: (val) => val / 0.3183,
			nit: (val) => val / 0.3183,
			stilb: (val) => val / 3183.1,
			fl: (val) => val * 0.9183,
		},
	},
	fl: {
		name: (val) => getUnitForm(val, "footlambert", "footlambertów"),
		conversions: {
			cdm2: (val) => val / 0.2919,
			nit: (val) => val / 0.2919,
			stilb: (val) => val / 2919,
			apostilb: (val) => val / 0.9183,
		},
	},
});

// Molar mass converter
initConverter("molarmass", {
	kgmol: {
		name: (val) => getUnitForm(val, "kilogram na mol", "kilogramów na mol"),
		conversions: {
			gmol: (val) => val * 1000,
			lbmol: (val) => val * 2.20462,
			uma: (val) => val * 6.02214076e23,
		},
	},
	gmol: {
		name: (val) => getUnitForm(val, "gram na mol", "gramów na mol"),
		conversions: {
			kgmol: (val) => val / 1000,
			lbmol: (val) => val * 0.00220462,
			uma: (val) => val * 6.02214076e20,
		},
	},
	lbmol: {
		name: (val) => getUnitForm(val, "funt na mol", "funtów na mol"),
		conversions: {
			kgmol: (val) => val / 2.20462,
			gmol: (val) => val / 0.00220462,
			uma: (val) => val * 2.73161e23,
		},
	},
	uma: {
		name: (val) =>
			getUnitForm(val, "jednostka masy atomowej", "jednostek masy atomowej"),
		conversions: {
			kgmol: (val) => val / 6.02214076e23,
			gmol: (val) => val / 6.02214076e20,
			lbmol: (val) => val / 2.73161e23,
		},
	},
});

// Torque converter
initConverter("torque", {
	nm: {
		name: (val) => getUnitForm(val, "niutonometr", "niutonometrów"),
		conversions: {
			kgm: (val) => val / 9.80665,
			ftlb: (val) => val / 1.35582,
			inlb: (val) => val * 8.85075,
		},
	},
	kgm: {
		name: (val) => getUnitForm(val, "kilogramometr", "kilogramometrów"),
		conversions: {
			nm: (val) => val * 9.80665,
			ftlb: (val) => val * 7.23301,
			inlb: (val) => val * 86.7962,
		},
	},
	ftlb: {
		name: (val) => getUnitForm(val, "stopofunt", "stopofuntów"),
		conversions: {
			nm: (val) => val * 1.35582,
			kgm: (val) => val / 7.23301,
			inlb: (val) => val * 12,
		},
	},
	inlb: {
		name: (val) => getUnitForm(val, "calfunt", "calfuntów"),
		conversions: {
			nm: (val) => val / 8.85075,
			kgm: (val) => val / 86.7962,
			ftlb: (val) => val / 12,
		},
	},
});

// Voltage converter
initConverter("voltage", {
	v: {
		name: (val) => getUnitForm(val, "wolt", "woltów"),
		conversions: {
			mv: (val) => val * 1000,
			kv: (val) => val / 1000,
			Mv: (val) => val / 1000000,
		},
	},
	mv: {
		name: (val) => getUnitForm(val, "miliwolt", "miliwoltów"),
		conversions: {
			v: (val) => val / 1000,
			kv: (val) => val / 1000000,
			Mv: (val) => val / 1000000000,
		},
	},
	kv: {
		name: (val) => getUnitForm(val, "kilowolt", "kilowoltów"),
		conversions: {
			v: (val) => val * 1000,
			mv: (val) => val * 1000000,
			Mv: (val) => val / 1000,
		},
	},
	Mv: {
		name: (val) => getUnitForm(val, "megawolt", "megawoltów"),
		conversions: {
			v: (val) => val * 1000000,
			mv: (val) => val * 1000000000,
			kv: (val) => val * 1000,
		},
	},
});

// Illuminance converter
initConverter("illuminance", {
	lux: {
		name: (val) => getUnitForm(val, "luks", "luksów"),
		conversions: {
			fc: (val) => val / 10.7639,
			phot: (val) => val / 10000,
			nox: (val) => val * 1000,
		},
	},
	fc: {
		name: (val) => getUnitForm(val, "foot-candle", "foot-candles"),
		conversions: {
			lux: (val) => val * 10.7639,
			phot: (val) => val / 929.03,
			nox: (val) => val * 10763.9,
		},
	},
	phot: {
		name: (val) => getUnitForm(val, "foot", "footów"),
		conversions: {
			lux: (val) => val * 10000,
			fc: (val) => val * 929.03,
			nox: (val) => val * 10000000,
		},
	},
	nox: {
		name: (val) => getUnitForm(val, "noks", "noksów"),
		conversions: {
			lux: (val) => val / 1000,
			fc: (val) => val / 10763.9,
			phot: (val) => val / 10000000,
		},
	},
});

// Acceleration converter
initConverter("acceleration", {
	mss: {
		name: (val) =>
			getUnitForm(val, "metr na sekundę kwadrat", "metrów na sekundę kwadrat"),
		conversions: {
			g: (val) => val / 9.80665,
			ftss: (val) => val * 3.28084,
			gal: (val) => val * 100,
		},
	},
	g: {
		name: (val) => getUnitForm(val, "g", "g"),
		conversions: {
			mss: (val) => val * 9.80665,
			ftss: (val) => val * 32.174,
			gal: (val) => val * 980.665,
		},
	},
	ftss: {
		name: (val) =>
			getUnitForm(val, "stopa na sekundę kwadrat", "stóp na sekundę kwadrat"),
		conversions: {
			mss: (val) => val / 3.28084,
			g: (val) => val / 32.174,
			gal: (val) => val * 30.48,
		},
	},
	gal: {
		name: (val) => getUnitForm(val, "gal", "gali"),
		conversions: {
			mss: (val) => val / 100,
			g: (val) => val / 980.665,
			ftss: (val) => val / 30.48,
		},
	},
});

// Resistance converter
initConverter("resistance", {
	ohm: {
		name: (val) => getUnitForm(val, "om", "omów"),
		conversions: {
			kohm: (val) => val / 1000,
			mohm: (val) => val / 1000000,
			uohm: (val) => val * 1000000,
		},
	},
	kohm: {
		name: (val) => getUnitForm(val, "kiloom", "kiloomów"),
		conversions: {
			ohm: (val) => val * 1000,
			mohm: (val) => val / 1000,
			uohm: (val) => val * 1000000000,
		},
	},
	mohm: {
		name: (val) => getUnitForm(val, "megaom", "megaomów"),
		conversions: {
			ohm: (val) => val * 1000000,
			kohm: (val) => val * 1000,
			uohm: (val) => val * 1000000000000,
		},
	},
	uohm: {
		name: (val) => getUnitForm(val, "mikroom", "mikroomów"),
		conversions: {
			ohm: (val) => val / 1000000,
			kohm: (val) => val / 1000000000,
			mohm: (val) => val / 1000000000000,
		},
	},
});

// Fuel consumption converter
initConverter("fuel", {
	lkm: {
		name: (val) => getUnitForm(val, "litr na 100 km", "litrów na 100 km"),
		conversions: {
			mpg: (val) => (val > 0 ? 235.214 / val : 0),
			kmpl: (val) => (val > 0 ? 100 / val : 0),
			mpl: (val) => (val > 0 ? 62.1371 / val : 0),
		},
	},
	mpg: {
		name: (val) => getUnitForm(val, "mila na galon", "mil na galon"),
		conversions: {
			lkm: (val) => (val > 0 ? 235.214 / val : 0),
			kmpl: (val) => val * 0.425144,
			mpl: (val) => val * 0.264172,
		},
	},
	kmpl: {
		name: (val) => getUnitForm(val, "kilometr na litr", "kilometrów na litr"),
		conversions: {
			lkm: (val) => (val > 0 ? 100 / val : 0),
			mpg: (val) => val / 0.425144,
			mpl: (val) => val * 0.621371,
		},
	},
	mpl: {
		name: (val) => getUnitForm(val, "mila na litr", "mil na litr"),
		conversions: {
			lkm: (val) => (val > 0 ? 62.1371 / val : 0),
			mpg: (val) => val / 0.264172,
			kmpl: (val) => val / 0.621371,
		},
	},
});

// Electric charge converter
initConverter("charge", {
	c: {
		name: (val) => getUnitForm(val, "kulomb", "kulombów"),
		conversions: {
			mc: (val) => val * 1000,
			uc: (val) => val * 1000000,
			nc: (val) => val * 1000000000,
			pc: (val) => val * 1000000000000,
		},
	},
	mc: {
		name: (val) => getUnitForm(val, "milikulomb", "milikulombów"),
		conversions: {
			c: (val) => val / 1000,
			uc: (val) => val * 1000,
			nc: (val) => val * 1000000,
			pc: (val) => val * 1000000000,
		},
	},
	uc: {
		name: (val) => getUnitForm(val, "mikrokulomb", "mikrokulombów"),
		conversions: {
			c: (val) => val / 1000000,
			mc: (val) => val / 1000,
			nc: (val) => val * 1000,
			pc: (val) => val * 1000000,
		},
	},
	nc: {
		name: (val) => getUnitForm(val, "nanokulomb", "nanokulombów"),
		conversions: {
			c: (val) => val / 1000000000,
			mc: (val) => val / 1000000,
			uc: (val) => val / 1000,
			pc: (val) => val * 1000,
		},
	},
	pc: {
		name: (val) => getUnitForm(val, "pikokulomb", "pikokulombów"),
		conversions: {
			c: (val) => val / 1000000000000,
			mc: (val) => val / 1000000000,
			uc: (val) => val / 1000000,
			nc: (val) => val / 1000,
		},
	},
});

// Also update the select options for area units to match the new notation
const areaSelect = document.getElementById("areaUnit");
if (areaSelect) {
	Array.from(areaSelect.options).forEach((option) => {
		if (option.text.includes("kwadratowy")) {
			option.text = option.text.replace("kwadratowy", "²");
		} else if (option.text.includes("kwadratowa")) {
			option.text = option.text.replace("kwadratowa", "²");
		}
	});
	// Update volume dropdown for cubic notation
	const volumeSelect = document.getElementById("volumeUnit");
	if (volumeSelect) {
		Array.from(volumeSelect.options).forEach((option) => {
			if (option.text.includes("sześcienny")) {
				option.text = option.text.replace("sześcienny", "³");
			}
		});
	}
}

// Reset button should also clear history
resetButton.addEventListener("click", function () {
	// Get all input fields and reset them
	const allInputs = document.querySelectorAll('input[type="number"]');
	allInputs.forEach((input) => {
		input.value = "";
	});

	// Reset all result divs without removing the precision toggle buttons
	const allResults = document.querySelectorAll('[id$="Results"]');
	allResults.forEach((result) => {
		const pElement = result.querySelector("p") || document.createElement("p");
		pElement.innerHTML = "Wybierz wartość aby zobaczyć przeliczenia";

		// If paragraph doesn't exist yet, append it
		if (!pElement.parentNode) {
			result.appendChild(pElement);
		}
	});

	// Clear history
	conversionHistory = [];
	updateHistoryDisplay();

	// Scroll to the top of the page
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});
