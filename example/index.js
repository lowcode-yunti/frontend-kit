// 示例：演示如何使用我们创建的包

// 导入core包的功能
import { greet, createUserProfile } from "@lowcode-yunti/frontend-core"

// 导入dom包的功能
import { addClass, createElement } from "@lowcode-yunti/dom-utils"

// 使用core包的功能
console.log(greet("World")) // 输出: Hello, World!

const user = createUserProfile({
	name: "John Doe",
	email: "john@example.com",
})

console.log("User Profile:", user)

// 使用dom包的功能 (这需要在浏览器环境中运行)
// const div = createElement('div', { id: 'myDiv', class: 'container' }, 'Hello World');
// addClass(div, 'active');

console.log("示例运行完成！")
