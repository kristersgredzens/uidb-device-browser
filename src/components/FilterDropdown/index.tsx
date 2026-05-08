import { useRef, useEffect, useMemo } from 'react'
import type { RefObject } from 'react'
import type { Device } from '@/types/device'
import { CheckmarkIcon } from '@/components/Icons'
import styles from './FilterDropdown.module.css'

interface FilterDropdownProps {
  devices: Device[]
  selectedLines: string[]
  onSelectedLinesChange: (lines: string[]) => void
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

function FilterDropdown({ devices, selectedLines, onSelectedLinesChange, open, onClose, triggerRef }: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  const productLines = useMemo(() => {
    const lineMap = new Map<string, string>()
    for (const device of devices) {
      if (device.line?.id && device.line.name) {
        lineMap.set(device.line.id, device.line.name)
      }
    }
    return Array.from(lineMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((first, second) => first.name.localeCompare(second.name))
  }, [devices])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        ref.current && !ref.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, triggerRef])

  if (!open) return null

  function toggleLine(lineId: string) {
    if (selectedLines.includes(lineId)) {
      onSelectedLinesChange(selectedLines.filter((selectedId) => selectedId !== lineId))
    } else {
      onSelectedLinesChange([...selectedLines, lineId])
    }
  }

  const hasSelection = selectedLines.length > 0

  return (
    <div className={styles.dropdown} ref={ref}>
      <p className={styles.title}>Product line</p>
      <div className={styles.list}>
        {productLines.map((line) => {
          const checked = selectedLines.includes(line.id)
          return (
            <label key={line.id} className={styles.item}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleLine(line.id)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}>
                {checked && <CheckmarkIcon />}
              </span>
              <span className={styles.label}>{line.name}</span>
            </label>
          )
        })}
      </div>
      <button
        className={`${styles.reset} ${hasSelection ? styles.resetActive : ''}`}
        onClick={() => onSelectedLinesChange([])}
        disabled={!hasSelection}
      >
        Reset
      </button>
    </div>
  )
}

export default FilterDropdown
