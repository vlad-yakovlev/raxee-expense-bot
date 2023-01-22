import { PrismaClient } from '@prisma/client'
import { NextFunction } from 'grammy'
import { Expense } from '../classes/Expense'
import { CustomContext } from '../types'

export const expenseMiddleware = () => {
  return async (ctx: CustomContext, next: NextFunction) => {
    ctx.expense = new Expense(new PrismaClient())
    await next()
  }
}
