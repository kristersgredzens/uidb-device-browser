import { useRef, useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Device } from '@/types/device'
import { getDeviceImageUrl, handleImageError } from '@/utils/image'
import { preloadImage } from '@/utils/preload'
import styles from './DeviceGrid.module.css'

interface DeviceGridProps {
  devices: Device[]
}

const ROW_HEIGHT = 192
const GAP = 16

function getColumns() {
  const width = window.innerWidth
  if (width <= 480) return 1
  if (width <= 768) return 2
  if (width <= 1200) return 4
  return 6
}

function VirtualizedGrid({ devices, columns }: { devices: Device[]; columns: number }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const filteredIds = useMemo(() => devices.map((device) => device.id), [devices])
  const rowCount = Math.ceil(devices.length / columns)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 5, // extra rows rendered off-screen for smooth scrolling
  })

  return (
    <div className={styles.scrollWrapper} ref={parentRef}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const rowDevices = devices.slice(startIndex, startIndex + columns)

          return (
            <div
              key={virtualRow.index}
              className={styles.grid}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            >
              {rowDevices.map((device) => (
                <Link
                  to={`/devices/${device.id}`}
                  state={{ filteredIds, listSearch }}
                  key={device.id}
                  className={styles.card}
                  onMouseEnter={() => preloadImage(getDeviceImageUrl(device.id, device.images?.default, 256))}
                >
                  <div className={styles.imageArea}>
                    <img
                      src={getDeviceImageUrl(device.id, device.images?.default, 256)}
                      alt={device.product?.name ?? 'Device'}
                      className={styles.image}
                      loading="lazy"
                      onError={handleImageError}
                    />
                    {device.line?.name && (
                      <span className={styles.badge}>{device.line.name}</span>
                    )}
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{device.product?.name ?? '—'}</p>
                    <p className={styles.shortname}>{device.shortnames?.[0] ?? ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DeviceGrid({ devices }: DeviceGridProps) {
  const [columns, setColumns] = useState(getColumns)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(timeout)
      timeout = setTimeout(() => setColumns(getColumns()), 150)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  return <VirtualizedGrid key={columns} devices={devices} columns={columns} />
}

export default DeviceGrid
