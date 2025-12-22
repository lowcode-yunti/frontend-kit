import React from "react";
import { getUUID } from "../utils";

export interface HrefButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: "primary" | "secondary";
}

export const HrefButton = ({
    label,
    variant = "primary",
    ...props
}: HrefButtonProps) => {
    return (
        <button className={`kit-button kit-button--${variant}`} {...props}>
            这是一个 打包的文件 lowcode-yunti packages/kit HrefButtonProps
            {label}
            {getUUID()}
        </button>
    );
};
