import { WORK_ORDERS } from '@/lib/app/data'
import WorkOrderDetailContent from './WorkOrderDetailContent'

export function generateStaticParams() {
  return WORK_ORDERS.map(wo => ({ id: wo.id }))
}

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WorkOrderDetailContent id={id} />
}
