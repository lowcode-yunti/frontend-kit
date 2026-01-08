import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { cn } from "@lowcode-yunti/common"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React, { useState, useRef, useEffect } from "react"

export interface BreadcrumbItem {
	title: string
	key: string
	onClick?: () => void
	className?: string
}

export interface EllipsisBreadcrumbProps {
	items: BreadcrumbItem[]
	separator?: React.ReactNode
	className?: string
	fontSize?: string | number
}

const Separator = ({
	separator,
}: {
	separator?: EllipsisBreadcrumbProps["separator"]
}) => <span className="px-2 text-gray-400">{separator}</span>

export const EllipsisBreadcrumb: React.FC<EllipsisBreadcrumbProps> = ({
	items,
	separator = ">",
	className = "",
	fontSize,
}) => {
	const [visibleItems, setVisibleItems] = useState<BreadcrumbItem[]>([])
	const [hiddenItems, setHiddenItems] = useState<BreadcrumbItem[]>([])
	const [showDropdown, setShowDropdown] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLSpanElement | null)[]>([])

	// 根据容器宽度动态计算可见项
	useEffect(() => {
		if (!containerRef.current || items.length === 0) {
			setVisibleItems(items)
			setHiddenItems([])
			return
		}

		// 重置refs
		itemRefs.current = itemRefs.current.slice(0, items.length)

		// 如果没有项，直接返回
		if (items.length === 0) {
			setVisibleItems([])
			setHiddenItems([])
			return
		}

		// 如果只有一项，直接显示
		if (items.length === 1) {
			setVisibleItems(items)
			setHiddenItems([])
			return
		}

		// 对于两项或更少，直接显示
		if (items.length <= 2) {
			setVisibleItems(items)
			setHiddenItems([])
			return
		}

		// 对于超过2项的情况，始终显示第一项、省略号和最后一项
		const firstItem = items[0]
		const lastItem = items[items.length - 1]
		const middleItems = items.slice(1, items.length - 1)

		setVisibleItems([firstItem, lastItem])
		setHiddenItems(middleItems)

		// 在下一帧执行宽度计算，尝试添加更多项
		requestAnimationFrame(() => {
			if (!containerRef.current) return

			const containerWidth = containerRef.current.offsetWidth
			const itemWidths: number[] = []

			// 获取每个项的宽度
			itemRefs.current.forEach((el, index) => {
				if (el) {
					// 添加一些额外的宽度用于分隔符和安全边距
					itemWidths[index] = el.offsetWidth + 30
				}
			})

			// 始终保持第一项和最后一项可见
			const newVisibleItems = [firstItem]
			const newHiddenItems = [...middleItems]

			// 尝试从后往前添加项，直到接近容器宽度
			let accumulatedWidth = itemWidths[0] + 50 // 第一项 + 省略号按钮宽度

			for (let i = items.length - 2; i > 0; i--) {
				if (accumulatedWidth + itemWidths[i] <= containerWidth * 1) {
					// 可以添加此项
					newVisibleItems.push(items[i])
					accumulatedWidth += itemWidths[i]
					// 从隐藏项中移除
					const hiddenIndex = newHiddenItems.findIndex(
						(item) => item.key === items[i].key,
					)
					if (hiddenIndex > -1) {
						newHiddenItems.splice(hiddenIndex, 1)
					}
				}
			}

			// 添加最后一项
			newVisibleItems.push(lastItem)

			// 按原始顺序排序可见项
			const sortedVisibleItems = newVisibleItems.sort((a, b) => {
				return items.indexOf(a) - items.indexOf(b)
			})

			setVisibleItems(sortedVisibleItems)
			setHiddenItems(newHiddenItems)
		})
	}, [items])

	// Radix UI dropdown 不需要预处理菜单项

	// 设置ref的处理函数
	const setItemRef = (index: number) => (el: HTMLSpanElement | null) => {
		itemRefs.current[index] = el
	}

	return (
		<div
			ref={containerRef}
			className={`flex items-center flex-wrap ${className}`}
		>
			{visibleItems.map((item, index) => (
				<React.Fragment key={item.key}>
					{/* 在第二位置显示省略号下拉菜单（如果有隐藏项） */}
					{index === 1 && hiddenItems.length > 0 && (
						<>
							{/* @ts-expect-error - Radix UI 尚未完全支持 React 19 类型 */}
							<DropdownMenu.Root
								open={showDropdown}
								onOpenChange={setShowDropdown}
							>
								{/* @ts-expect-error - Radix UI 尚未完全支持 React 19 类型 */}
								<DropdownMenu.Trigger asChild>
									<button
										type="button"
										className="px-1 inline-flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
										onClick={(e: React.MouseEvent) => {
											e.stopPropagation()
										}}
									>
										<DotsHorizontalIcon className="text-gray-500 w-4 h-4" />
									</button>
								</DropdownMenu.Trigger>
								{/* @ts-expect-error - Radix UI 尚未完全支持 React 19 类型 */}
								<DropdownMenu.Portal>
									{/* @ts-expect-error - Radix UI 尚未完全支持 React 19 类型 */}
									<DropdownMenu.Content
										className="min-w-[120px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
										sideOffset={5}
									>
										{hiddenItems.map((hiddenItem) => (
											<>
												{/* @ts-expect-error - Radix UI 尚未完全支持 React 19 类型 */}
												<DropdownMenu.Item
													key={hiddenItem.key}
													className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-gray-100 rounded transition-colors"
													onSelect={() => {
														hiddenItem.onClick?.()
														setShowDropdown(false)
													}}
												>
													<span
														className={hiddenItem.className}
														style={{ fontSize }}
													>
														{hiddenItem.title}
													</span>
												</DropdownMenu.Item>
											</>
										))}
									</DropdownMenu.Content>
								</DropdownMenu.Portal>
							</DropdownMenu.Root>
							<Separator separator={separator} />
						</>
					)}
					<span
						ref={setItemRef(index)}
						className={cn(
							"flex items-center truncate max-w-xs",
							item.className,
							visibleItems.length > 1 && index === visibleItems.length - 1
								? "text-notation"
								: "",
						)}
						onClick={item.onClick}
						style={{
							fontSize: fontSize,
						}}
						title={item.title} // 添加title属性以便悬停时显示完整文本
					>
						{item.title}
					</span>
					{index < visibleItems.length - 1 && (
						<Separator separator={separator} />
					)}
				</React.Fragment>
			))}
		</div>
	)
}
