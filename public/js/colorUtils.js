/* exported isValidColorName, formatColorList */

// Pure helper functions for the COLORS front end.
// "Pure" means they don't touch the DOM or the network: same input, same output.
// That keeps them easy to unit test with Jest, separately from code.js.

const MAX_COLOR_NAME_LENGTH = 50; // matches Colors.Name VARCHAR(50) in db/schema.sql

// Returns true if the user typed a color name the API should accept.
function isValidColorName(name)
{
	if (typeof name !== "string")
	{
		return false;
	}

	const trimmed = name.trim();
	return trimmed.length > 0 && trimmed.length <= MAX_COLOR_NAME_LENGTH;
}

// Turns the "results" array from SearchColors.php into the HTML shown on the page.
function formatColorList(results)
{
	if (!Array.isArray(results))
	{
		return "";
	}

	return results.join("<br />\r\n");
}

// In the browser this file is a plain <script>, so the functions above are globals.
// Under Node (Jest), `module` exists, so we also export them for require().
// Same trick the bundled md5.js library uses.
if (typeof module !== "undefined" && module.exports)
{
	module.exports = { isValidColorName, formatColorList, MAX_COLOR_NAME_LENGTH };
}
