"use client"

import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
  const test = async () => {
    const { data, error } = await supabase.from('test').select('*')
    console.log(data, error)
  }
  test()
}, [])

  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  );
}
