export function formatString(template: string, ...args: any[]): string {
	return template.replace(/{(\d+)}/g, (match, index) => {
		return typeof args[Number(index)] !== "undefined"
			? String(args[Number(index)])
			: match
	})
}

export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") {
		return obj
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as any
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => deepClone(item)) as any
	}

	if (obj instanceof Object) {
		const clonedObj: any = {}
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				clonedObj[key] = deepClone((obj as any)[key])
			}
		}
		return clonedObj
	}

	return obj
}

export function addClass(element: HTMLElement, className: string): void {
	if (element.classList) {
		element.classList.add(className)
	} else {
		element.className += " " + className
	}
}

export function removeClass(element: HTMLElement, className: string): void {
	if (element.classList) {
		element.classList.remove(className)
	} else {
		element.className = element.className.replace(
			new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
			" ",
		)
	}
}

export function createElement(
	tagName: string,
	attributes: Record<string, string> = {},
	content: string = "",
): HTMLElement {
	const element = document.createElement(tagName)

	Object.keys(attributes).forEach((key) => {
		element.setAttribute(key, attributes[key])
	})

	if (content) {
		element.textContent = content
	}

	return element
}
