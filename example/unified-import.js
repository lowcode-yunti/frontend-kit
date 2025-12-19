// 示例：演示如何从统一入口导入所有功能

// 从根目录统一入口导入所有功能
import {
	// 来自core包的功能
	greet,
	createUserProfile,
	// 来自dom包的功能
	addClass,
	removeClass,
	createElement,
	// 来自utils包的功能
	formatString,
	deepClone,
} from "../dist/index.js"

// 测试core包的功能
console.log(greet("World")) // 输出: Hello, World!

const user = createUserProfile({
	name: "John Doe",
	email: "john@example.com",
})
console.log("User Profile:", user)

// 测试utils包的功能
const formatted = formatString("Hello {0}, you have {1} messages", "John", 5)
console.log("Formatted string:", formatted)

const originalObj = { a: 1, b: { c: 2 } }
const clonedObj = deepClone(originalObj)
clonedObj.b.c = 3
console.log("Original object:", originalObj) // { a: 1, b: { c: 2 } }
console.log("Cloned object:", clonedObj) // { a: 1, b: { c: 3 } }

console.log("Unified import example completed!")
