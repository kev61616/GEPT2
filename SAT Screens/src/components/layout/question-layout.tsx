'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuestion } from '@/contexts/QuestionContext'
import { ToolWindow } from '@/components/ui/tool-window'

const Sidebar = dynamic(
  () => import('./sidebar').then(mod => mod.Sidebar),
  { ssr: false, loading: () => <div className="w-16 bg-white border-r" /> }
)

const Breadcrumb = dynamic(
  () => import('../features/breadcrumb').then(mod => mod.Breadcrumb),
  { ssr: false, loading: () => <Skeleton className="h-14" /> }
)

const QuestionHeader = dynamic(
  () => import('../features/question-header').then(mod => mod.QuestionHeader),
  { ssr: false, loading: () => <Skeleton className="h-16" /> }
)

const QuestionContent = dynamic(
  () => import('../features/question-content').then(mod => mod.QuestionContent),
  { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
)

export function QuestionLayout() {
  const { windows, closeWindow, updateWindowPosition } = useQuestion();

  return (
    <main className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16">
        <Breadcrumb />
        <div className="flex-1 pt-[1%] pb-[1%]">
          <div className="w-[95%] mx-auto">
            <QuestionContent />
          </div>
        </div>
      </div>
      {windows.map(window => window.isOpen && (
        <ToolWindow
          key={window.id}
          id={window.id}
          title={window.title}
          url={window.url}
          position={window.position}
          onClose={() => closeWindow(window.id)}
          onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
        />
      ))}
    </main>
  )
}