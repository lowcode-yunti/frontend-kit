import React from "react"
import { formatString } from "@lowcode-yunti/common"
import { css } from "@emotion/css"
import "./button.css"

const buttonStyleConfig = {
	buttonWrapper: css`
        overflow-x: auto;
        margin-top: 12px;
        min-height: 384px;
    `,
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: "primary" | "secondary"
}

export const Button = ({ label, variant = "primary", ...props }: ButtonProps) => {
	return (
		<button
			className={`wrapper kit-button kit-button--${variant} ${buttonStyleConfig.buttonWrapper}`}
			{...props}
		>
			这是一个 打包的文件 lowcode-yunti packages/kit {label}-{formatString(label)}
		</button>
	)
}
