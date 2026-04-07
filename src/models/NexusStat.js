import { BaseModel } from './BaseModel'

export class NexusStat extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.value = data.value ?? ''
    this.label = data.label ?? ''
  }
}
