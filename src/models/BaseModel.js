export class BaseModel {
  constructor(data = {}) {
    Object.assign(this, data)
  }

  static fromJSON(json = {}) {
    return new this(json)
  }

  static fromJSONArray(array = []) {
    return array.map((item) => this.fromJSON(item))
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this).map(([key, value]) => [
        key,
        value instanceof Date ? value.toISOString() : value,
      ]),
    )
  }
}
