import { BaseModel } from './BaseModel'

export class AlphaexploraTestimonial extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.initials = data.initials ?? ''
    this.name = data.name ?? ''
    this.role = data.role ?? ''
    this.quote = data.quote ?? ''
  }
}
