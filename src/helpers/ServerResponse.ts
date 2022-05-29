import { Response } from "express";

class ServerResponse {
  constructor() {}

  // Responder exitosamente
  public success(
    name: string,
    statusCode: number,
    data: any,
    res: Response,
    description?: string
  ): any {
    return res.status(statusCode).json({
      name: name,
      description: description ?? "",
      status: "success",
      statusCode: statusCode,
      dataCount: data.length,
      data: data.length === 1 ? data.pop() : data,
    });
  }

  // Responder con error
  public error(
    name: string,
    statusCode: number,
    error: any,
    res: Response,
    description?: string
  ): any {
    return res.status(statusCode).json({
      name: name,
      description: description ?? "",
      status: "error",
      statusCode: statusCode,
      error: error,
    });
  }
}

export default new ServerResponse();
