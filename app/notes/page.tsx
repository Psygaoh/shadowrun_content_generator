import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()


  return (
    <div>
      <div>hello world</div>
      <pre>{JSON.stringify(notes)}</pre>
    </div>
  )
}
