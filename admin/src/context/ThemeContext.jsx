import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

  const [dark, setDark] = useState(() => {
    return localStorage.getItem('adminTheme') === 'dark'
  })

  useEffect(() => {
    localStorage.setItem('adminTheme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark(prev => !prev)

  const theme = {
    bg:          dark ? 'bg-gray-950'            : 'bg-white',
    bg2:         dark ? 'bg-gray-900'            : 'bg-gray-50',
    bg3:         dark ? 'bg-gray-800'            : 'bg-white',
    bgCard:      dark ? 'bg-gray-900'            : 'bg-white',
    bgInput:     dark ? 'bg-gray-800'            : 'bg-gray-50',
    bgHover:     dark ? 'hover:bg-gray-800'      : 'hover:bg-gray-50',
    border:      dark ? 'border-gray-800'        : 'border-gray-100',
    borderInput: dark ? 'border-gray-700'        : 'border-gray-200',
    text:        dark ? 'text-white'             : 'text-gray-900',
    text2:       dark ? 'text-gray-400'          : 'text-gray-500',
    text3:       dark ? 'text-gray-600'          : 'text-gray-400',
    textInput:   dark ? 'text-white'             : 'text-gray-900',
    placeholder: dark ? 'placeholder-gray-600'   : 'placeholder-gray-400',
    navBg:       dark ? 'bg-gray-950/90'         : 'bg-white/90',
    divider:     dark ? 'bg-gray-800'            : 'bg-gray-100',
    gridGap:     dark ? 'bg-gray-800'            : 'bg-gray-100',
    ring:        dark ? 'focus:ring-blue-500/20' : 'focus:ring-blue-100',
    focusBorder: 'focus:border-blue-500',
    footer:      dark ? 'bg-gray-900'            : 'bg-gray-950',
    tableHead:   dark ? 'bg-gray-800'            : 'bg-gray-50',
    tableRow:    dark ? 'hover:bg-gray-800'      : 'hover:bg-gray-50',
    tableBorder: dark ? 'border-gray-800'        : 'border-gray-100',
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)