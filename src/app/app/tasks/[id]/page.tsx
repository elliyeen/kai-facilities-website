import { TASKS } from '@/lib/app/data'
import TaskDetailContent from './TaskDetailContent'

export function generateStaticParams() {
  return TASKS.map(t => ({ id: t.id }))
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TaskDetailContent id={id} />
}
