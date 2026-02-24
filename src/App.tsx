import { useState } from "react"
import { TodoInput, TodoItem, TodoStats } from "@/components/todo/TodoComponents"
import { Sparkles, ListTodo, PartyPopper } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
  color: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "学习孟菲斯设计风格", completed: false, color: "bg-[#FF6B9D]" },
    { id: 2, text: "创建一个酷炫的 Todo App", completed: true, color: "bg-[#4ECDC4]" },
    { id: 3, text: "享受设计的乐趣", completed: false, color: "bg-[#FFE66D]" },
  ])

  const addTodo = (text: string, color: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      color,
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const completedCount = todos.filter(t => t.completed).length
  const isAllCompleted = todos.length > 0 && completedCount === todos.length

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 memphis-pattern opacity-5 pointer-events-none" />
      
      {/* Floating Decorations */}
      <div className="fixed top-20 left-10 w-24 h-24 bg-[#FFE66D] rounded-2xl memphis-border memphis-shadow animate-float opacity-80" />
      <div className="fixed top-40 right-20 w-16 h-16 bg-[#FF6B9D] rounded-full memphis-border memphis-shadow animate-wobble opacity-80" />
      <div className="fixed bottom-40 left-20 w-20 h-20 bg-[#4ECDC4] rounded-xl memphis-border memphis-shadow animate-float opacity-80" style={{ animationDelay: "0.5s" }} />
      <div className="fixed bottom-20 right-10 w-12 h-12 bg-[#C7CEEA] rounded-full memphis-border memphis-shadow animate-wobble opacity-80" style={{ animationDelay: "1s" }} />
      
      {/* Decorative Dots */}
      <div className="fixed top-1/3 left-5 flex flex-col gap-3 opacity-60">
        <div className="w-4 h-4 bg-[#FF9F43] rounded-full memphis-border" />
        <div className="w-3 h-3 bg-[#4ECDC4] rounded-full memphis-border ml-4" />
        <div className="w-5 h-5 bg-[#FF6B9D] rounded-full memphis-border" />
        <div className="w-3 h-3 bg-[#FFE66D] rounded-full memphis-border ml-6" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl memphis-border memphis-shadow mb-6">
            <Sparkles className="w-10 h-10 text-[#FF6B9D] animate-wobble" />
            <h1 className="text-5xl font-black text-[#2D3436] tracking-tight">
              MEMPHIS
            </h1>
            <Sparkles className="w-10 h-10 text-[#4ECDC4] animate-wobble" />
          </div>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#FFE66D] rounded-xl memphis-border memphis-shadow-sm">
            <ListTodo className="w-6 h-6 text-[#2D3436]" />
            <span className="text-xl font-bold text-[#2D3436]">待办事项清单</span>
          </div>

          {isAllCompleted && todos.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#4ECDC4] rounded-xl memphis-border memphis-shadow animate-bounce">
              <PartyPopper className="w-6 h-6 text-white" />
              <span className="text-xl font-bold text-white">太棒了！所有任务都完成啦！</span>
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Todo Input */}
        <div className="mb-8">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TodoStats total={todos.length} completed={completedCount} />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl memphis-border memphis-shadow">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#F8F9FA] rounded-full memphis-border mb-4">
                <ListTodo className="w-12 h-12 text-[#4ECDC4]" />
              </div>
              <p className="text-2xl font-bold text-[#2D3436] mb-2">还没有任务</p>
              <p className="text-gray-500 font-medium">添加你的第一个待办事项吧！</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            Made with ❤️ in Memphis Style
          </p>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 memphis-wave opacity-30 pointer-events-none" />
    </div>
  )
}

export default App
