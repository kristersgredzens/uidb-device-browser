import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useDevices } from '@/hooks/useDevices'
import { getDeviceImageUrl, handleImageError } from '@/utils/image'
import { getMaxPower, getSpeed, getNumberOfPorts } from '@/utils/device'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons'
import styles from './DeviceDetail.module.css'

interface LocationState {
  filteredIds?: string[]
  listSearch?: string
}

function DeviceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: devices = [], isLoading, error } = useDevices()
  const locationState = location.state as LocationState | undefined
  const filteredIds = locationState?.filteredIds
  const listSearch = locationState?.listSearch

  const [jsonOpen, setJsonOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleCopy = useCallback((json: string) => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [])

  const device = devices.find((dev) => dev.id === id)

  const navIds = filteredIds ?? devices.map((dev) => dev.id)
  const navIndex = navIds.indexOf(id ?? '')
  const prevId = navIndex > 0 ? navIds[navIndex - 1] : null
  const nextId = navIndex >= 0 && navIndex < navIds.length - 1 ? navIds[navIndex + 1] : null

  const deviceJson = device ? JSON.stringify(device, null, 2) : ''

  const pageTitle = device?.product?.name ?? 'Device'
  useEffect(() => {
    document.title = pageTitle
    return () => { document.title = 'UIDB Devices' }
  }, [pageTitle])

  if (isLoading) return <div className={styles.status}>Loading...</div>
  if (error) return <div className={styles.status}>Failed to load device.</div>
  if (!device) return <div className={styles.status}>Device not found.</div>

  const details: [string, string | undefined][] = [
    ['Product Line', device.line?.name],
    ['ID', device.id],
    ['Name', device.product?.name],
    ['Short Name', device.shortnames?.join(', ')],
    ['Max. Power', getMaxPower(device)],
    ['Speed', getSpeed(device)],
    ['Number of Ports', getNumberOfPorts(device)],
  ]

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={styles.navBtn} onClick={() => navigate(listSearch ? `/${listSearch}` : '/')}>
          <ChevronLeftIcon />
          Back
        </button>
        <div className={styles.navArrows}>
          {prevId ? (
            <Link to={`/devices/${prevId}`} state={{ filteredIds, listSearch }} className={styles.navBtn} aria-label="Previous device">
              <ChevronLeftIcon />
            </Link>
          ) : (
            <span className={`${styles.navBtn} ${styles.navBtnDisabled}`}>
              <ChevronLeftIcon />
            </span>
          )}
          {nextId ? (
            <Link to={`/devices/${nextId}`} state={{ filteredIds, listSearch }} className={styles.navBtn} aria-label="Next device">
              <ChevronRightIcon />
            </Link>
          ) : (
            <span className={`${styles.navBtn} ${styles.navBtnDisabled}`}>
              <ChevronRightIcon />
            </span>
          )}
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img
            src={getDeviceImageUrl(device.id, device.images?.default, 256)}
            alt={device.product?.name ?? 'Device'}
            className={styles.image}
            onError={handleImageError}
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.productName}>{device.product?.name ?? '—'}</h1>
          <p className={styles.lineName}>{device.line?.name ?? ''}</p>

          <table className={styles.detailsTable}>
            <tbody>
              {details.map(([label, value]) =>
                value ? (
                  <tr key={label} className={styles.detailRow}>
                    <td className={styles.detailLabel}>{label}</td>
                    <td className={styles.detailValue}>{value}</td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>

          <button
            className={styles.jsonLink}
            onClick={() => setJsonOpen(!jsonOpen)}
          >
            {jsonOpen ? 'Hide JSON' : 'See All Details as JSON'}
          </button>
          {jsonOpen && (
            <div className={styles.jsonWrapper}>
              <button
                className={styles.copyBtn}
                onClick={() => handleCopy(deviceJson)}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <pre className={styles.jsonBlock}>
                {deviceJson}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeviceDetail
