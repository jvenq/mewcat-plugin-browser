import { useEffect, useRef, useState } from "react"
import { useWindowSize } from "react-use"

interface Position {
    x: number
    y: number
}

interface UseDragOptions {
    onDragStart?: () => void
    onDragEnd?: () => void
    clickThreshold?: number
}

interface UseDragReturn {
    position: Position
    isDragging: boolean
    isDragged: React.MutableRefObject<boolean>
    ref: React.MutableRefObject<HTMLDivElement>
    windowRect: { width: number; height: number }
}

export const useDrag = (options: UseDragOptions = {}): UseDragReturn => {
    const { onDragStart, onDragEnd } = options

    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [windowRect, setWindowRect] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef<Position>({ x: 0, y: 0 })
    const dragOffset = useRef<Position>({ x: 0, y: 0 })
    const ref = useRef<HTMLDivElement>(null)
    const isDragged = useRef(false)

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            setIsDragging(isDragging => {
                if (!isDragging) {
                    return isDragging
                }
                return false
            })
            const rect = ref.current.getBoundingClientRect()

            setPosition({ x: rect.x, y: rect.y })
            dragOffset.current = { x: 0, y: 0 }
            ref.current.style.removeProperty("transform")
            onDragEnd?.()
        }
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [onDragEnd])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            requestAnimationFrame(() => {
                setIsDragging(isDragging => {
                    if (!isDragging) {
                        return isDragging
                    }
                    const newX = e.pageX - dragStart.current.x
                    const newY = e.pageY - dragStart.current.y
                    isDragged.current =
                        Math.abs(newX) > 10 || Math.abs(newY) > 10
                    dragOffset.current = { x: newX, y: newY }
                    ref.current.style.transform = `translate(${newX}px, ${newY}px)`
                    return isDragging
                })
            })
        }
        document.addEventListener("mousemove", handleMouseMove)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            isDragged.current = false
            setIsDragging(true)
            dragStart.current = {
                x: e.pageX,
                y: e.pageY
            }
            onDragStart?.()
        }

        ref.current.addEventListener("mousedown", handleMouseDown)
        return () => {
            ref?.current?.removeEventListener?.("mousedown", handleMouseDown)
        }
    }, [onDragStart])

    const { height, width } = useWindowSize()

    useEffect(() => {
        setWindowRect(rect => {
            setPosition(({ x, y }) => {
                const ratioX = width / rect.width
                const ratioY = height / rect.height
                return { x: ratioX * x, y: ratioY * y }
            })
            return { width, height }
        })
    }, [height, width])

    return {
        position,
        isDragging,
        windowRect,
        isDragged: isDragged,
        ref
    }
}
