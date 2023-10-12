export interface AxiosErrorLike<T = any> extends Error {
  config:any;
  code?: string;
  request?: any;
  response?: any;
  isAxiosError: boolean;
  toJSON: () => object;
}export class GelfMessage {
  constructor(
    private readonly facility: string,
    private readonly message: Record<string, any>,
    private readonly timestamp: number,
    private location?: string,
  ) {}

  static from(error: AxiosErrorLike, facility = 'unknown') {
    return new GelfMessage(facility, error.response?.data || {}, Date.now() / 1000);
  }

  static fromJSON(facility: string, data: object) {
    return new GelfMessage(facility, data, Date.now() / 1000);
  }

  public setLocation(location: string) {
    this.location = location;
    return this;
  }

  toJSON() {
    return {
      facility: this.facility,
      message: this.message,
      timestamp: this.timestamp,
      location: this.location,
    };
  }
}
