import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/dexie'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Calendar as CalendarIcon, 
  Search,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'

const getMonthName = (month: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[month]
}

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const todos = useLiveQuery(() => db.todos.toArray())
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Derived state
  const filteredTodos = todos
    ?.filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter(todo => 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.id - a.id)

  const stats = {
    total: todos?.length || 0,
    active: todos?.filter(t => !t.completed).length || 0,
    completed: todos?.filter(t => t.completed).length || 0
  }

  const progress = stats.total === 0 ? 0 : (stats.completed / stats.total) * 100

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    await db.todos.update(id, { completed: !currentStatus })
    if (!currentStatus) {
      toast.success('Task completed!')
    }
  }

  const deleteTodo = async (id: number) => {
    await db.todos.delete(id)
    toast.success('Task deleted')
  }

  return (
    <div className="min-h-screen bg-(--color-base-100) text-(--color-base-content) p-8 font-mono transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-5xl font-light mb-2 tracking-tight">Tasks</h1>
              <p className="text-(--color-base-content) opacity-60 text-lg">
                Manage your professional life
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-3xl font-bold">{stats.active}</div>
              <div className="text-sm opacity-50 uppercase tracking-wider">Pending</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-(--color-neutral) rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-(--color-primary)"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        </header>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center sticky top-4 z-10 bg-(--color-base-100)/80 backdrop-blur-md p-4 rounded-2xl border border-(--color-neutral) shadow-sm">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-base-content) opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-(--color-base-200) border border-(--color-neutral) rounded-xl py-2 pl-10 pr-4 outline-none focus:border-(--color-primary) transition-all placeholder:opacity-40"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f 
                    ? 'bg-(--color-base-content) text-(--color-base-100) shadow-md' 
                    : 'hover:bg-(--color-base-200) text-(--color-base-content) opacity-60 hover:opacity-100'
                }`}
              >
                {f}
              </button>
            ))}
            <button 
              onClick={() => setIsAdding(true)}
              className="ml-auto md:ml-4 bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-(--color-primary)/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <AddTaskForm onClose={() => setIsAdding(false)} />
            )}
            
            {filteredTodos?.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-(--color-base-200) border border-(--color-neutral) hover:border-(--color-neutral-content) rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-(--color-base-content)/5"
              >
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="mt-1 text-(--color-base-content) opacity-40 hover:opacity-100 hover:text-(--color-primary) transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-(--color-primary)" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-lg font-medium truncate pr-8 transition-all ${
                        todo.completed ? 'opacity-40 line-through decoration-(--color-base-content)/40' : ''
                      }`}>
                        {todo.title}
                      </h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 hover:bg-(--color-error)/10 text-(--color-error) rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {todo.description && (
                      <p className={`mt-1 text-sm opacity-60 line-clamp-2 ${
                        todo.completed ? 'line-through opacity-30' : ''
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex items-center gap-4 text-xs opacity-40">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Day {todo.date} {getMonthName(todo.month)} {todo.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTodos?.length === 0 && !isAdding && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 opacity-40"
            >
              <div className="mb-4 flex justify-center">
                <Filter className="w-12 h-12" />
              </div>
              <p className="text-lg">No tasks found</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddTaskForm({ onClose }: { onClose: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    
    if (!title?.trim()) {
      toast.error('Title is required')
      return
    }

    await db.todos.add({
      title,
      description,
      date: new Date().getDate(), // Default to today's day number
      completed: false,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    })
    
    toast.success('Task created')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="overflow-hidden"
    >
      <form 
        onSubmit={handleSubmit}
        className="bg-(--color-base-200) border border-(--color-primary) rounded-2xl p-6 shadow-xl shadow-(--color-primary)/5"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">New Task</h3>
          <button type="button" onClick={onClose} className="text-sm opacity-50 hover:opacity-100">Cancel</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <input 
              name="title"
              autoFocus
              placeholder="What needs to be done?"
              className="w-full bg-transparent text-xl font-light outline-none placeholder:opacity-30"
            />
          </div>
          <div>
            <textarea 
              name="description"
              rows={2}
              placeholder="Add details..."
              className="w-full bg-transparent text-sm outline-none resize-none placeholder:opacity-30"
            />
          </div>
          <div className="flex justify-end pt-2 border-t border-(--color-neutral)">
            <button 
              type="submit"
              className="bg-(--color-primary) text-(--color-primary-content) px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create Task
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
