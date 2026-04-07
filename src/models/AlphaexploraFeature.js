import { BaseModel } from './BaseModel'

export class AlphaexploraFeature extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.icon = data.icon ?? ''
    this.title = data.title ?? ''
    this.description = data.description ?? ''
  }
}
