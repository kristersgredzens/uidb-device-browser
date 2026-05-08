export interface DeviceLine {
  id: string
  name: string
}

export interface DeviceProduct {
  abbrev?: string
  name?: string
}

export interface DeviceImages {
  default?: string
  nopadding?: string
  topology?: string
}

export interface DeviceIcon {
  id: string
  resolutions?: number[][]
}

export interface DeviceRadio {
  gain?: number
  maxPower?: number
  maxSpeedMegabitsPerSecond?: number
}

export interface DeviceNetwork {
  ethernetMaxSpeedMegabitsPerSecond?: number
  numberOfPorts?: number
  ports?: Record<string, string | number[]>
  networkGroups?: Record<string, string>
  radios?: Record<string, DeviceRadio>
  features?: Record<string, boolean>
  deviceCapabilities?: string[]
}

export interface DeviceUnifi {
  adoptability?: string
  network?: DeviceNetwork
}

export interface DeviceCompliance {
  fcc?: string
  ic?: string
  modelName?: string
  rcm?: boolean
  jrf?: string[]
  jpa?: string[]
}

export interface Device {
  id: string
  line?: DeviceLine
  product?: DeviceProduct
  shortnames?: string[]
  images?: DeviceImages
  icon?: DeviceIcon
  deviceType?: string
  deviceTypes?: string[]
  sku?: string
  sysid?: string
  sysids?: string[]
  triplets?: Record<string, string>[]
  guids?: string[]
  uisp?: Record<string, unknown>
  unifi?: DeviceUnifi
  compliance?: DeviceCompliance
  videos?: Record<string, unknown>
}

export interface UidbResponse {
  devices: Device[]
}

export type ViewMode = 'list' | 'grid'
