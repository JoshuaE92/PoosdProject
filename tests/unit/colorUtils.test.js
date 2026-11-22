// Front-end unit tests: pure functions only, no browser, no server, no database.
const {
	isValidColorName,
	formatColorList,
	MAX_COLOR_NAME_LENGTH,
} = require("../../public/js/colorUtils");

describe("isValidColorName", () => {
	test("accepts a normal color name", () => {
		expect(isValidColorName("Blue")).toBe(true);
	});

	test("accepts a name with surrounding spaces (it gets trimmed)", () => {
		expect(isValidColorName("  Sea Green  ")).toBe(true);
	});

	test("rejects an empty string", () => {
		expect(isValidColorName("")).toBe(false);
	});

	test("rejects whitespace only", () => {
		expect(isValidColorName("   ")).toBe(false);
	});

	test("accepts a name exactly at the length limit", () => {
		expect(isValidColorName("a".repeat(MAX_COLOR_NAME_LENGTH))).toBe(true);
	});

	test("rejects a name longer than the database column allows", () => {
		expect(isValidColorName("a".repeat(MAX_COLOR_NAME_LENGTH + 1))).toBe(false);
	});

	test("rejects non-string input", () => {
		expect(isValidColorName(undefined)).toBe(false);
		expect(isValidColorName(null)).toBe(false);
		expect(isValidColorName(42)).toBe(false);
	});
});

describe("formatColorList", () => {
	test("joins colors with HTML line breaks", () => {
		expect(formatColorList(["Red", "Green", "Blue"])).toBe(
			"Red<br />\r\nGreen<br />\r\nBlue"
		);
	});

	test("returns a single color with no trailing break", () => {
		expect(formatColorList(["Red"])).toBe("Red");
	});

	test("returns an empty string for an empty list", () => {
		expect(formatColorList([])).toBe("");
	});

	test("returns an empty string when results is missing", () => {
		// SearchColors.php sends no "results" key when nothing matches
		expect(formatColorList(undefined)).toBe("");
	});
});
