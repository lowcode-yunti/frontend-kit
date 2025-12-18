import { formatString } from "@lowcode-yunti/utils";

/**
 * Add a class to an element
 * @param {HTMLElement} element - The DOM element
 * @param {string} className - The class name to add
 */
function addClass(element, className) {
	if (element.classList) {
		element.classList.add(className);
	} else {
		element.className += " " + className;
	}
}

/**
 * Remove a class from an element
 * @param {HTMLElement} element - The DOM element
 * @param {string} className - The class name to remove
 */
function removeClass(element, className) {
	if (element.classList) {
		element.classList.remove(className);
	} else {
		element.className = element.className.replace(
			new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
			" ",
		);
	}
}

/**
 * Create a DOM element with attributes and content
 * @param {string} tagName - The tag name of the element
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {string} content - Text content of the element
 * @returns {HTMLElement} The created element
 */
function createElement(tagName, attributes = {}, content = "") {
	const element = document.createElement(tagName);

	// Set attributes
	Object.keys(attributes).forEach((key) => {
		element.setAttribute(key, attributes[key]);
	});

	// Set content
	if (content) {
		element.textContent = content;
	}

	return element;
}

export { addClass, removeClass, createElement };
