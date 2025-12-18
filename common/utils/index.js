/**
 * Format a string with placeholders
 * @param {string} template - The template string with {n} placeholders
 * @param {...any} args - Arguments to replace placeholders
 * @returns {string} Formatted string
 */
function formatString(template, ...args) {
	return template.replace(/{(\d+)}/g, (match, index) => {
		return typeof args[index] !== "undefined" ? args[index] : match;
	});
}

/**
 * Deep clone an object or array
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
function deepClone(obj) {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}

	if (obj instanceof Array) {
		return obj.map((item) => deepClone(item));
	}

	if (obj instanceof Object) {
		const clonedObj = {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = deepClone(obj[key]);
			}
		}
		return clonedObj;
	}
}

module.exports = {
	formatString,
	deepClone,
};
