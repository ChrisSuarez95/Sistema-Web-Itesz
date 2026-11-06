import { useState, useEffect } from 'react'
import { loadData, saveData } from '../models/store'
export function useAppViewModel(){
  const [data, setData] = useState(loadData)
  useEffect(()=>saveData(data),[data])
  const [view, setView] = useState("Tickets")
  return { data, setData, view, setView }
}