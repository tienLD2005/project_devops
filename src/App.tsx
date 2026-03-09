import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  updatedAt: string
}

const getSampleTodos = (): Todo[] => [
  {
    id: '1',
    text: 'HÊHHEHEHEHEHEHEE',
    completed: false,
    priority: 'high',
    dueDate: '2026-03-15',
    createdAt: new Date().toLocaleString('vi-VN'),
    updatedAt: new Date().toLocaleString('vi-VN'),
  },
  {
    id: '2',
    text: 'Họp với nhóm phát triển sản phẩm',
    completed: true,
    priority: 'medium',
    dueDate: '2026-03-12',
    createdAt: new Date().toLocaleString('vi-VN'),
    updatedAt: new Date().toLocaleString('vi-VN'),
  },
]

const initializeTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    try {
      return JSON.parse(savedTodos)
    } catch (error) {
      console.error('Failed to load todos:', error)
      return getSampleTodos()
    }
  }
  return getSampleTodos()
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(initializeTodos)
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim() === '') return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toLocaleString('vi-VN'),
      updatedAt: new Date().toLocaleString('vi-VN'),
    }

    setTodos([newTodo, ...todos])
    setInput('')
    setDueDate('')
    setPriority('medium')
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toLocaleString('vi-VN') }
        : todo
    ))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim() === '') return

    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text: editText.trim(), updatedAt: new Date().toLocaleString('vi-VN') }
        : todo
    ))
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingId) {
        saveEdit(editingId)
      } else {
        addTodo()
      }
    } else if (e.key === 'Escape' && editingId) {
      cancelEdit()
    }
  }

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#eab308'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return ''
    }
  }

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed))
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">✨ TaskFlow</h1>
          <p className="app-subtitle">Quản lý công việc thông minh</p>
        </div>

        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-text">Tất cả</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.active}</span>
            <span className="stat-text">Đang làm</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.completed}</span>
            <span className="stat-text">Hoàn thành</span>
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-title">Bộ lọc</h3>
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            <span className="dot all"></span> Tất cả
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            <span className="dot active"></span> Đang làm
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            <span className="dot completed"></span> Hoàn thành
          </button>
        </div>

        {todos.filter(t => !t.completed).length > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            🗑️ Xóa hoàn thành
          </button>
        )}
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Danh sách công việc</h2>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="add-todo-section">
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập công việc mới..."
              className="todo-input"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="priority-select"
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>
            <button onClick={addTodo} className="add-btn">
              + Thêm
            </button>
          </div>
        </div>

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-title">
                {todos.length === 0 ? 'Không có công việc nào' : 'Không tìm thấy công việc'}
              </p>
              <p className="empty-desc">
                {todos.length === 0
                  ? 'Hãy bắt đầu bằng cách thêm công việc đầu tiên'
                  : 'Thử thay đổi bộ lọc hoặc tìm kiếm khác'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                </div>

                <div className="todo-content">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoFocus
                      className="edit-input"
                    />
                  ) : (
                    <>
                      <p className="todo-text">{todo.text}</p>
                      <div className="todo-meta">
                        <span className="priority-badge" style={{ borderColor: getPriorityColor(todo.priority) }}>
                          {getPriorityLabel(todo.priority)}
                        </span>
                        <span className="due-date">📅 {todo.dueDate}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <>
                      <button onClick={() => saveEdit(todo.id)} className="action-btn save" title="Lưu">
                        ✓
                      </button>
                      <button onClick={cancelEdit} className="action-btn cancel" title="Hủy">
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        className="action-btn edit"
                        title="Chỉnh sửa"
                        disabled={todo.completed}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="action-btn delete"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
