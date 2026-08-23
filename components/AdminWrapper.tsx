'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import { Menu } from 'lucide-react'

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(localStorage.getItem('adminTheme') === 'dark')
    setCollapsed(localStorage.getItem('adminSidebar') === 'collapsed')
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem('adminTheme', !isDark ? 'dark' : 'light')
  }
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
    localStorage.setItem('adminSidebar', !collapsed ? 'collapsed' : 'expanded')
  }

  if (!mounted) return null

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${isDark ? 'dark-admin bg-f-dark' : 'bg-f-soft'}`}>
      <AdminSidebar collapsed={collapsed} isDark={isDark} onToggleTheme={toggleTheme} onToggleSidebar={toggleSidebar} />
      <main className="flex-1 h-full overflow-y-auto transition-all duration-300 relative">
        {children}
      </main>
    </div>
  )
}
