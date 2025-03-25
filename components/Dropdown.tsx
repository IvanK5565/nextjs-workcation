import { useState, useEffect, ReactNode } from "react"

export default function Dropdown({ className, content, trigger }: { className:string, content: ReactNode, trigger: ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Escape' || !isOpen) setOpen(false);
    }
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return <div className={className}>
        <div className="relative">
            <button onClick={() => { setOpen(!isOpen) }} type="button" className="block focus:outline-none" >
                {trigger}
            </button>
            <div className={isOpen ? "block" : "hidden"}>
                <button onClick={() => { setOpen(false) }} type="button" className="z-30 block fixed inset-0 w-full h-full cursor-default"></button>
                <div className="absolute z-40 right-0">
                    {content}
                </div>
            </div>
        </div>
    </div>
}