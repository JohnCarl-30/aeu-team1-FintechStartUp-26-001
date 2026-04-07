import { BaseModel } from './BaseModel'

export class AlphaexploraPlan extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.name = data.name ?? ''
    this.description = data.description ?? ''
    this.monthly = data.monthly ?? 0
    this.annual = data.annual ?? 0
    this.annualNote = data.annualNote ?? ''
    this.buttonLabel = data.buttonLabel ?? ''
    this.featured = Boolean(data.featured)
    this.custom = Boolean(data.custom)
    this.features = Array.isArray(data.features) ? data.features : []
  }

  getPrice(mode = 'monthly') {
    if (this.custom) {
      return null
    }

    return mode === 'annual' ? this.annual : this.monthly
  }

  getAnnualNote(mode = 'monthly') {
    if (typeof this.annualNote === 'string') {
      return this.annualNote
    }

    return this.annualNote?.[mode] ?? ''
  }
}
