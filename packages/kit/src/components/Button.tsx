import React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: "primary" | "secondary"
}

export const Button = ({ label, variant = "primary", ...props }: ButtonProps) => {
	return (
		<button
			className={`kit-button kit-button--${variant}`}
			{...props}
		>
			这是一个 打包的文件 lowcode-yunti packages/kit {label}
		</button>
	)
}
