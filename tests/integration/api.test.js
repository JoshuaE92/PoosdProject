// Integration tests: real HTTP requests to the real PHP API backed by a real MySQL database.
// Node only runs the tests. PHP's built-in server runs the app (see .github/workflows/lint.yml).
//
// Run locally with a PHP server and MySQL up:
//   API_BASE_URL=http://127.0.0.1:8000/api npm run test:integration

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

// Matches tests/fixtures/seed.sql
const TEST_LOGIN = "testuser";
const TEST_PASSWORD = "testpass";

// POST a JSON body to an endpoint, the same way code.js does with XMLHttpRequest
async function postJson(endpoint, body)
{
	const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=UTF-8" },
		body: JSON.stringify(body),
	});

	const text = await response.text();
	let json;
	try
	{
		json = JSON.parse(text);
	}
	catch
	{
		throw new Error(`${endpoint} did not return valid JSON. Got: ${text}`);
	}

	return { status: response.status, contentType: response.headers.get("content-type"), json };
}

describe("Login.php", () => {
	test("returns the user's id and name for valid credentials", async () => {
		const { status, contentType, json } = await postJson("Login.php", {
			login: TEST_LOGIN,
			password: TEST_PASSWORD,
		});

		expect(status).toBe(200);
		expect(contentType).toContain("application/json");
		expect(json).toEqual({
			id: expect.any(Number),
			firstName: "Test",
			lastName: "User",
			error: "",
		});
		expect(json.id).toBeGreaterThan(0);
	});

	test("returns id 0 and an error for a wrong password", async () => {
		const { json } = await postJson("Login.php", {
			login: TEST_LOGIN,
			password: "wrong-password",
		});

		expect(json.id).toBe(0);
		expect(json.error).toBe("No Records Found");
	});
});

describe("AddColor.php and SearchColors.php", () => {
	let userId;
	// Unique per run so repeated runs against the same database don't collide
	const colorName = `TestColor${Date.now()}`;

	beforeAll(async () => {
		const { json } = await postJson("Login.php", { login: TEST_LOGIN, password: TEST_PASSWORD });
		userId = json.id;
	});

	test("AddColor returns an empty error on success", async () => {
		const { status, json } = await postJson("AddColor.php", { color: colorName, userId });

		expect(status).toBe(200);
		expect(json).toEqual({ error: "" });
	});

	test("SearchColors finds the color that was just added", async () => {
		const { status, json } = await postJson("SearchColors.php", {
			search: colorName,
			userId,
		});

		expect(status).toBe(200);
		expect(Array.isArray(json.results)).toBe(true);
		expect(json.results).toContain(colorName);
		expect(json.error).toBe("");
	});

	test("SearchColors returns an error when nothing matches", async () => {
		const { json } = await postJson("SearchColors.php", {
			search: "no-such-color-xyz",
			userId,
		});

		expect(json.results).toBeUndefined();
		expect(json.error).toBe("No Records Found");
	});

	test("SearchColors does not return another user's colors", async () => {
		const { json } = await postJson("SearchColors.php", {
			search: colorName,
			userId: userId + 9999,
		});

		expect(json.error).toBe("No Records Found");
	});
});
