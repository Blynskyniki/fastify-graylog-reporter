export interface AxiosErrorLike<T = any> extends Error {
  config:any;
  code?: string;
  request?: any;
  response?: any;
  isAxiosError: boolean;
  toJSON: () => object;
}

export class GelfMessage {
  constructor(
    private readonly facility: string,
    private readonly headers: any,
    private readonly message: string,
    private readonly timestamp: number,
    private location?: string,
  ) {}

  static from(error: AxiosErrorLike) {
    return new GelfMessage(
      process.env.SERVICE_NAME || 'unknown',
      error.config?.headers,
      JSON.stringify(error.response?.data),
      Date.now() / 1000,
    );
  }

  static fromJSON(facility: string, data: object) {
    return new GelfMessage(facility, {}, JSON.stringify(data), Date.now() / 1000);
  }

  public setLocation(location: string) {
    this.location = location;
    return this;
  }

  toJSON() {
    return {
      facility: this.facility,
      headers: this.headers,
      message: this.message,
      timestamp: this.timestamp,
      location: this.location,
    };
  }
}
