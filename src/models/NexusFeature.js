import { BaseModel } from './BaseModel'

export class NexusFeature extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.icon = data.icon ?? ''
    this.title = data.title ?? ''
    this.description = data.description ?? ''
  }
}
