import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionLayout } from '@/components/layout/question-layout'

// Mark page as static to avoid hydration issues
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  return (
    <Suspense fallback={<Skeleton className="h-screen" />}>
      <QuestionLayout />
    </Suspense>
  )
}