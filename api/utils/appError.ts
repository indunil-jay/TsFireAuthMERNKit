class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    //this=current obj  this.contructor =app error class it self
    //purpose=> when a new object is created and contructir function is called that function call is not appear in stack trace.
    Error.captureStackTrace(this, this.constructor);
    return this;
  }
}

export default AppError;
