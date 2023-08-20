import { validationResult } from 'express-validator'

export function Validate (req: any, res: any, next: any) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let error: any = {}
    errors.array().map((err: any) => (error[err.param] = err.msg))
    return res.status(422).json({ error })
  }
  next()
}