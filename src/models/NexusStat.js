import { BaseModel } from './BaseModel'

export class AlphaexploraStat extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.value = data.value ?? ''
    this.label = data.label ?? ''
  }
}
