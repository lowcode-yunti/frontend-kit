import { useState } from "react"
import { Button, greet, formatString } from "@lowcode-yunti/frontend-kit"

// I configured postcss in rollup, generally it extracts to index.css if extract: true or injects if not.
// In my rollup config `rollup-plugin-postcss` default is inject: true?
// Actually default is inject: true. So no need to import css explicitly if it's injected.
// But a library usually extracts to CSS file.
// Let's check rollup config again. `postcss()` default is inject to head.
// For a library, usually better to extract. But for now let's assume injection or I will modify rollup config to extract.
// If I use inject, avoiding import css is fine.

function App() {
	const [count, setCount] = useState(0)

	return (
		<div style={{ padding: 20 }}>
			<h1>Playground</h1>
			<div style={{ marginBottom: 20 }}>
				<h2>Core Utils</h2>
				<p>{greet("Visitor")}</p>
				<p>{formatString("Count is {0}", count)}</p>
			</div>

			<div style={{ marginBottom: 20 }}>
				<h2>Components</h2>
				<Button
					label="Click Me"
					onClick={() => setCount(count + 1)}
				/>
				<Button
					label="Secondary"
					variant="secondary"
					style={{ marginLeft: 10 }}
				/>
			</div>
		</div>
	)
}

export default App
