import { NextFunction, Request, Response } from "express";
import Joi, { optional } from "joi";


// PEMINJAMAN DAN PENGEMBALIAN BARANG
const borrowSchema = Joi.object({
    user_id: Joi.number().required(),
    barang_id: Joi.number().required(),
    borrow_date: Joi.date().iso().required(),
    return_date: Joi.date().iso().greater(Joi.ref('borrow_date')).required(),
    user: Joi.optional(),
});

export const validateBorrow = (req: Request, res: Response, next: NextFunction) => {
    const { error } = borrowSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            massage: error.details.map(it => it.message).join(),
        });
    }
    next();
};

const returnSchema = Joi.object({
    borrow_id: Joi.number().required(), //integer
    return_date: Joi.date().iso().required(),
    user: Joi.optional(),
});

export const validateReturn = (req: Request, res: Response, next: NextFunction) => {
    const { error } = returnSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            massage: error.details.map(it => it.message).join(),
        });
    }
    next();
};
