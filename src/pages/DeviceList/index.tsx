import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDevices } from '@/hooks/useDevices'
import { deviceMatchesQuery } from '@/utils/device'
import Toolbar from '@/components/Toolbar'
import DeviceTable from '@/components/DeviceTable'
import DeviceGrid from '@/components/DeviceGrid'
import type { ViewMode } from '@/types/device'
import styles from './DeviceList.module.css'

function DeviceList() {
  const { data: devices = [], isLoading, error, refetch } = useDevices()
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const viewParam = searchParams.get('view')
  const view: ViewMode = viewParam === 'grid' ? 'grid' : 'list'

  const search = searchParams.get('search') ?? ''
  const filterParam = searchParams.get('filter') ?? ''
  const selectedLines = useMemo(() => {
    return filterParam ? filterParam.split(',') : []
  }, [filterParam])

  const setSearch = useCallback((value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      return params
    }, { replace: true })
  }, [setSearchParams])

  const setSelectedLines = useCallback((lines: string[]) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (lines.length > 0) {
        params.set('filter', lines.join(','))
      } else {
        params.delete('filter')
      }
      return params
    }, { replace: true })
  }, [setSearchParams])

  const handleViewChange = useCallback((v: ViewMode) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      params.set('view', v)
      return params
    })
  }, [setSearchParams])

  const handleFilterClose = useCallback(() => setFilterOpen(false), [])
  const handleFilterToggle = useCallback(() => setFilterOpen((prev) => !prev), [])

  const filtered = useMemo(() => {
    let result = devices

    if (selectedLines.length > 0) {
      result = result.filter((device) => selectedLines.includes(device.line?.id ?? ''))
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((device) => deviceMatchesQuery(device, query))
    }

    return result
  }, [devices, selectedLines, search])

  if (isLoading) return <div className={styles.status}>Loading devices...</div>
  if (error) return (
    <div className={styles.status}>
      Failed to load devices.
      <br />
      <button className={styles.retryBtn} onClick={() => refetch()}>Retry</button>
    </div>
  )

  return (
    <div className={styles.page}>
      <Toolbar
        devices={devices}
        deviceCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
        filterOpen={filterOpen}
        onFilterToggle={handleFilterToggle}
        onFilterClose={handleFilterClose}
        filterActive={selectedLines.length > 0}
        selectedLines={selectedLines}
        onSelectedLinesChange={setSelectedLines}
        view={view}
        onViewChange={handleViewChange}
      />
      {filtered.length === 0 ? (
        <div className={styles.empty}>No devices found.</div>
      ) : view === 'list' ? (
        <DeviceTable devices={filtered} />
      ) : (
        <DeviceGrid devices={filtered} />
      )}
    </div>
  )
}

export default DeviceList
