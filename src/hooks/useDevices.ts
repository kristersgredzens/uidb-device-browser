import { useQuery } from '@tanstack/react-query'
import type { Device, UidbResponse } from '@/types/device'

const UIDB_URL = 'https://static.ui.com/fingerprint/ui/public.json'

async function fetchDevices(): Promise<Device[]> {
  const response = await fetch(UIDB_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch devices: ${response.status}`)
  }
  const data: unknown = await response.json()
  const devices = (data as UidbResponse)?.devices
  if (!Array.isArray(devices)) {
    throw new Error('Unexpected API response: missing devices array')
  }
  return devices
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })
}
