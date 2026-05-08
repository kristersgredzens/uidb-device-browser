import type { Device } from '@/types/device'

export function deviceMatchesQuery(device: Device, query: string): boolean {
  const name = device.product?.name?.toLowerCase() ?? ''
  if (name.includes(query)) return true
  return device.shortnames?.some((shortname) => shortname.toLowerCase().includes(query)) ?? false
}

export function getMaxPower(device: Device): string | undefined {
  const radios = device.unifi?.network?.radios
  if (!radios) return undefined
  const powers = Object.values(radios)
    .map((radio) => radio.maxPower)
    .filter((power): power is number => power != null)
  if (powers.length === 0) return undefined
  return `${Math.max(...powers)} W`
}

export function getSpeed(device: Device): string | undefined {
  const speed = device.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond
  if (speed == null) return undefined
  return speed >= 1000 ? `${speed / 1000} Gbps` : `${speed} Mbps`
}

export function getNumberOfPorts(device: Device): string | undefined {
  const ports = device.unifi?.network?.numberOfPorts
  if (ports == null) return undefined
  return String(ports)
}
