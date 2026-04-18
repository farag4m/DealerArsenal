import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TabNav from './components/TabNav'
import LoadingSpinner from './components/LoadingSpinner'

const MyDay = lazy(() => import('./pages/MyDay'))
const Board = lazy(() => import('./pages/Board'))
const Team = lazy(() => import('./pages/Team'))
const TasksPhotos = lazy(() => import('./pages/TasksPhotos'))

const TABS = [
  { to: '/my-day', label: 'My Day' },
  { to: '/board', label: 'Board' },
  { to: '/team', label: 'Team' },
  { to: '/tasks-photos', label: 'Tasks & Photos' },
]

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-14 items-center gap-4">
              <span className="text-base font-semibold text-gray-900">Operations</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl">
          <TabNav tabs={TABS} />

          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/my-day" replace />} />

                {/* Main tabs */}
                <Route path="/my-day" element={<MyDay />} />
                <Route path="/board" element={<Board />} />
                <Route path="/team" element={<Team />} />
                <Route path="/tasks-photos" element={<TasksPhotos />} />

                {/* Tasks redirect — /tasks → Tasks & Photos tab */}
                <Route path="/tasks" element={<Navigate to="/tasks-photos" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/my-day" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
