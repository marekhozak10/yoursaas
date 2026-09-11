import { type NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params
  const { requests } = await getStore().read()
  const request = requests.find(r => r.id === id)
  if (!request) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json(request)
}
