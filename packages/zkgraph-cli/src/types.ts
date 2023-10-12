export interface Destination {
  address: string
}

export interface DataDestination {
  destination: Destination
  kind: string
  network: string
}

export interface EventHandler {
  event: string
  handler: string
}

export interface Mapping {
  apiVersion: string
  eventHandlers: EventHandler[]
  file: string
  kind: string
  language: string
}

export interface Source {
  address: string
}

export interface DataSource {
  kind: string
  mapping: Mapping
  network: string
  source: Source
}

export interface ZkGraphYaml {
  dataDestinations: DataDestination[]
  dataSources: DataSource[]
  description: string
  name: string
  repository: string
  specVersion: string
}
