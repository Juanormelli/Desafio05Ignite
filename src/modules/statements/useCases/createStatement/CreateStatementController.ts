import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const {user_id} = request.params;

    if (user_id=== undefined) {
      const { id: user_id } = request.user;
      const { amount, description } = request.body;

      const splittedPath = request.originalUrl.split("/");
      const type = splittedPath[splittedPath.length - 1] as OperationType;

      const createStatement = container.resolve(CreateStatementUseCase);
      const statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description,
        sender_id: user_id,
      });
      return response.status(201).json(statement);
    }
    
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    console.log(user_id);

    const splittedPath = request.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);
    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });
    return response.status(201).json(statement);
  }
}
