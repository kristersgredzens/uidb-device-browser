import { useRef } from 'react'
import type { Device, ViewMode } from '@/types/device'
import SearchAutocomplete from '@/components/SearchAutocomplete'
import FilterDropdown from '@/components/FilterDropdown'
import { ListViewIcon, GridViewIcon } from '@/components/Icons'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  devices: Device[]
  deviceCount: number
  search: string
  onSearchChange: (value: string) => void
  filterOpen: boolean
  onFilterToggle: () => void
  onFilterClose: () => void
  filterActive: boolean
  selectedLines: string[]
  onSelectedLinesChange: (lines: string[]) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

function Toolbar({
  devices,
  deviceCount,
  search,
  onSearchChange,
  filterOpen,
  onFilterToggle,
  onFilterClose,
  filterActive,
  selectedLines,
  onSelectedLinesChange,
  view,
  onViewChange,
}: ToolbarProps) {
  const filterBtnRef = useRef<HTMLButtonElement>(null)

  return (
    <div className={styles.toolbar}>
      <SearchAutocomplete
        devices={devices}
        search={search}
        onSearchChange={onSearchChange}
      />

      <div className={styles.controls}>
        <span className={styles.count}>{deviceCount} Devices</span>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => onViewChange('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
          >
            <ListViewIcon />
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
          >
            <GridViewIcon />
          </button>
        </div>

        <div className={styles.filterWrapper}>
          <button
            ref={filterBtnRef}
            className={`${styles.filterBtn} ${filterActive ? styles.filterBtnActive : ''}`}
            onClick={onFilterToggle}
            aria-expanded={filterOpen}
            aria-haspopup="true"
          >
            Filter
          </button>
          <FilterDropdown
            devices={devices}
            selectedLines={selectedLines}
            onSelectedLinesChange={onSelectedLinesChange}
            open={filterOpen}
            onClose={onFilterClose}
            triggerRef={filterBtnRef}
          />
        </div>
      </div>
    </div>
  )
}

export default Toolbar
