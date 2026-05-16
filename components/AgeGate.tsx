'use client'
import { useState, useEffect } from 'react'

export default function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem('ft_age_verified')
    if (!verified) setShow(true)
  }, [])

  const confirm = () => {
    localStorage.setItem('ft_age_verified', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-f-dark/95 backdrop-blur-sm px-4">
      <div className="bg-[#2D2773] border border-[#4C1D95] rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">

        <div className="font-display text-4xl text-f-accent mb-1">✦</div>
        <h1 className="font-display text-4xl text-f-light tracking-widest mb-1">FUNTROO</h1>
        <p className="text-[10px] text-f-mid tracking-[3px] uppercase mb-6">Pleasure · Wellness · You</p>

        <p className="text-sm text-f-muted leading-relaxed mb-6">
          This website contains products intended for{' '}
          <strong className="text-f-light">adults aged 18 and above</strong>.
          Please confirm your age to continue.
        </p>

        <button
          onClick={confirm}
          className="w-full py-3 bg-f-purple text-white rounded-lg text-sm font-medium tracking-wide hover:bg-f-mid transition mb-3"
        >
          Yes, I am 18 or older →
        </button>
        <button
          onClick={() => window.location.href = 'https://google.com'}
          className="w-full py-3 bg-transparent text-f-mid border border-[#4C1D95] rounded-lg text-xs hover:border-f-muted transition"
        >
          No, take me back
        </button>

        <p className="text-[10px] text-[#4C1D95] mt-5 leading-relaxed">
          🔒 Your visit is 100% private. Discreet billing &amp; plain brown box delivery guaranteed.
        </p>
      </div>
    </div>
  )
}
