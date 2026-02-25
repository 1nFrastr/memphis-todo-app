import { useState } from "react"
import { cn } from "@/lib/utils"
import { colorClassToHex } from "@/lib/colorUtils"
import { 
  Plus, 
  Trash2, 
  Check, 
  Sparkles,
  Star,
  Zap,
  Heart
} from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
  color: string
}

const COLORS = [
  "bg-[#FF6B9D]",
  "bg-[#4ECDC4]",
  "bg-[#FFE66D]",
  "bg-[#FF9F43]",
  "bg-[#A8E6CF]",
  "bg-[#C7CEEA]",
] as const


const DECORATIONS = [
  <Star key="star" className="w-6 h-6 text-[#FFE66D] animate-wobble" />,
  <Zap key="zap" className="w-6 h-6 text-[#FF9F43] animate-float" />,
  <Heart key="heart" className="w-6 h-6 text-[#FF6B9D] animate-pulse" />,
  <Sparkles key="sparkles" className="w-6 h-6 text-[#4ECDC4] animate-float" />,
]

export function TodoInput({ onAdd }: { onAdd: (text: string, color: string) => void }) {
  const [text, setText] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim(), selectedColor)
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="添加新的任务..."
            className="w-full px-6 py-4 text-lg font-bold bg-white rounded-2xl memphis-border memphis-shadow 
                     placeholder:text-gray-400 outline-none focus:outline-none
                     transition-all duration-200"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)]}
          </div>
        </div>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-10 h-10 rounded-xl border-3 transition-all duration-200",
                color,
                selectedColor === color && "ring-4 ring-offset-2 ring-[#2D3436]"
              )}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-8 py-4 text-xl font-bold text-white bg-[#4ECDC4] rounded-2xl memphis-border memphis-shadow
                   hover:bg-[#3DBDB5] hover:memphis-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-0 disabled:hover:memphis-shadow
                   transition-all duration-200"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </form>
  )
}

export function TodoItem({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div 
      className={cn(
        "group relative p-4 rounded-2xl memphis-border memphis-shadow-sm transition-all duration-300",
        "hover:memphis-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px]",
        todo.completed && "opacity-60"
      )}
      style={{ backgroundColor: colorClassToHex(todo.color) }}
    >
      <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="relative">
          <div className="absolute inset-0 bg-[#2D3436] rounded-full" />
          <button
            onClick={() => onDelete(todo.id)}
            className="relative p-2 bg-[#FF6B6B] rounded-full text-white hover:bg-[#E55555] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-xl border-3 border-[#2D3436] transition-all duration-200",
            "hover:scale-110 cursor-pointer",
            todo.completed && "bg-[#4ECDC4]"
          )}
        >
          {todo.completed && (
            <Check className="w-full h-full p-1 text-[#2D3436]" strokeWidth={4} />
          )}
        </button>
        <span 
          className={cn(
            "text-xl font-bold text-[#2D3436] break-all transition-all duration-300",
            todo.completed && "line-through decoration-4 decoration-[#2D3436]/50"
          )}
        >
          {todo.text}
        </span>
      </div>

      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full memphis-border" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#FFE66D] rounded-lg border-2 border-[#2D3436] rotate-12" />
    </div>
  )
}

export function TodoStats({ total, completed }: { total: number; completed: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return (
    <div className="p-6 bg-white rounded-2xl memphis-border memphis-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#2D3436]">进度</h3>
        <span className="text-4xl font-black text-[#4ECDC4]">{percentage}%</span>
      </div>
      <div className="h-6 bg-gray-100 rounded-full memphis-border overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#FF6B9D] to-[#4ECDC4] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-bold text-gray-500">
        {completed} / {total} 任务完成
      </p>
    </div>
  )
}
