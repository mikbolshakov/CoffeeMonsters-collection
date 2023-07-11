import { body } from "express-validator";

export const mintValidation = [body("email", "Invalid email format").isEmail()];

