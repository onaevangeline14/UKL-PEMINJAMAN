import { NextFunction, Request, Response } from "express";
import Joi, { optional } from "joi";
import { start } from "repl";

const createBarang = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().required()
})

const updateBarang = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    quantity: Joi.number().optional()
})

 export const createValidation = (
    request: Request,
    response: Response,
    next: NextFunction
): any => {
    const validate = createBarang.validate(request.body)
    if (validate.error) {
        return response.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message)
            .join()
        })
    }
    return next()
}

export const updateValidation = (
    request: Request,
    response: Response,
    next: NextFunction
): any => {
    const validate = updateBarang.validate(request.body)
    if (validate.error) {
        return response.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message)
            .join()
        })
    }
    return next()
}

const analisisSchema = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required().greater(Joi.ref("start_date")),
    group_by: Joi.string().valid("category", "location").required(),
    user: Joi.optional(),
  });
  
  export const validateAnalis = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = analisisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        massage: error.details.map((it) => it.message).join(),
      });
    }
    next();
  };
  
  const analisisBorrowSchema = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required().greater(Joi.ref("start_date")),
    user: Joi.optional(),
  });
  
  export const validateBorrowAnalis = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = analisisBorrowSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        massage: error.details.map((it) => it.message).join(),
      });
    }
    next();
  };