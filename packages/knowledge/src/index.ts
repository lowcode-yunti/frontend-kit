import { formatString, deepClone } from "@lowcode-yunti/common"

export function greet(name: string): string {
	return formatString("Hello, {0}!", name)
}

export interface UserProfile {
	id: string | null
	name: string
	email: string
	preferences: {
		theme: string
		notifications: boolean
	}
}

export function createUserProfile(userData: Partial<UserProfile>): UserProfile {
	const defaults: UserProfile = {
		id: null,
		name: "",
		email: "",
		preferences: {
			theme: "light",
			notifications: true,
		},
	}

	return deepClone({ ...defaults, ...userData })
}
