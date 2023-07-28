class CustomHttpError extends Error {
  status: number;
  name: string;

  constructor(status: number, name: string, message: string) {
    super(message);
    this.status = status;
    this.name = name;
    this.message = message;
  }
}

export default CustomHttpError;
