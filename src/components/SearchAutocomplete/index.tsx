import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Device } from '@/types/device'
import { SearchIcon } from '@/components/Icons'
import styles from './SearchAutocomplete.module.css'

interface SearchAutocompleteProps {
  devices: Device[]
  search: string
  onSearchChange: (value: string) => void
}

interface SearchResult {
  device: Device
  matchField: 'name' | 'shortname'
  matchedShortname?: string
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className={styles.highlight}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchAutocomplete({ devices, search, onSearchChange }: SearchAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const results = useMemo(() => {
    if (!search.trim()) return []
    const query = search.toLowerCase()
    const matches: SearchResult[] = []

    for (const device of devices) {
      if (matches.length >= 10) break
      const name = device.product?.name ?? ''
      if (name.toLowerCase().includes(query)) {
        matches.push({ device, matchField: 'name' })
        continue
      }
      const matchedSn = device.shortnames?.find((shortname) => shortname.toLowerCase().includes(query))
      if (matchedSn) {
        matches.push({ device, matchField: 'shortname', matchedShortname: matchedSn })
      }
    }
    return matches
  }, [devices, search])

  const handleSearchChange = useCallback((value: string) => {
    onSearchChange(value)
    setFocusIndex(-1)
  }, [onSearchChange])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!open || results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setFocusIndex((index) => (index < results.length - 1 ? index + 1 : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setFocusIndex((index) => (index > 0 ? index - 1 : results.length - 1))
    } else if (event.key === 'Enter' && focusIndex >= 0) {
      event.preventDefault()
      navigateToDevice(results[focusIndex].device.id)
    } else if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  function navigateToDevice(id: string) {
    setOpen(false)
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    const listSearch = params.toString() ? `?${params.toString()}` : ''
    const filteredIds = devices.map((device) => device.id)
    onSearchChange('')
    navigate(`/devices/${id}`, { state: { filteredIds, listSearch } })
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          value={search}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-autocomplete="list"
          aria-controls={open && results.length > 0 ? 'search-listbox' : undefined}
          aria-activedescendant={focusIndex >= 0 ? `search-option-${focusIndex}` : undefined}
          onChange={(event) => {
            handleSearchChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {open && results.length > 0 && (
        <div className={styles.dropdown} id="search-listbox" role="listbox">
          {results.map((result, index) => (
            <button
              key={result.device.id}
              id={`search-option-${index}`}
              role="option"
              aria-selected={index === focusIndex}
              className={`${styles.resultItem} ${index === focusIndex ? styles.resultItemFocused : ''}`}
              onClick={() => navigateToDevice(result.device.id)}
              onMouseEnter={() => setFocusIndex(index)}
            >
              <span className={styles.resultName}>
                {result.matchField === 'name'
                  ? highlightMatch(result.device.product?.name ?? '', search)
                  : result.device.product?.name ?? ''}
              </span>
              <span className={styles.resultShortname}>
                {result.matchField === 'shortname'
                  ? highlightMatch(result.matchedShortname ?? '', search)
                  : result.device.shortnames?.[0] ?? ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete
