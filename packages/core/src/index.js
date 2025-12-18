import { formatString, deepClone } from "@lowcode-yunti/utils";

/**
 * Create a greeting message
 * @param {string} name - The name to greet
 * @returns {string} Greeting message
 */
function greet(name) {
	return formatString("Hello, {0}!", name);
}

/**
 * Create a user profile with default values
 * @param {Object} userData - Partial user data
 * @returns {Object} Complete user profile
 */
function createUserProfile(userData) {
	const defaults = {
		id: null,
		name: "",
		email: "",
		preferences: {
			theme: "light",
			notifications: true,
		},
	};

	return deepClone({ ...defaults, ...userData });
}

export { greet, createUserProfile };
