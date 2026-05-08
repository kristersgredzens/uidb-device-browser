import { useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Device } from '@/types/device'
import { getDeviceImageUrl, handleImageError } from '@/utils/image'
import { preloadImage } from '@/utils/preload'
import styles from './DeviceTable.module.css'

const ROW_HEIGHT = 37

interface DeviceTableProps {
  devices: Device[]
}

function DeviceTable({ devices }: DeviceTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const filteredIds = useMemo(() => devices.map((device) => device.id), [devices])

  const virtualizer = useVirtualizer({
    count: devices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20, // extra rows rendered off-screen for smooth scrolling
  })

  return (
    <div className={styles.tableWrapper} ref={parentRef} role="table" aria-label="Devices">
      <div className={styles.headerRow} role="row">
        <div className={styles.colImage} role="columnheader" />
        <div className={styles.colLine} role="columnheader">Product Line</div>
        <div className={styles.colName} role="columnheader">Name</div>
      </div>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const device = devices[virtualRow.index]
          return (
            <Link
              key={device.id}
              to={`/devices/${device.id}`}
              state={{ filteredIds, listSearch }}
              className={styles.row}
              role="row"
              onMouseEnter={() => preloadImage(getDeviceImageUrl(device.id, device.images?.default, 256))}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: ROW_HEIGHT,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className={styles.colImage} role="cell">
                <img
                  src={getDeviceImageUrl(device.id, device.images?.default, 64)}
                  alt={device.product?.name ?? 'Device'}
                  className={styles.thumbnail}
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>
              <div className={styles.colLine} role="cell">{device.line?.name ?? '—'}</div>
              <div className={styles.colName} role="cell">{device.product?.name ?? '—'}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default DeviceTable
