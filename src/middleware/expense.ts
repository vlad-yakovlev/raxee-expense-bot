import { PrismaClient } from '@prisma/client'
import { NextFunction } from 'grammy'
import { Expense } from '../classes/Expense'
import { CustomContext } from '../types'

export const expenseMiddleware = () => {
  return async (ctx: CustomContext, next: NextFunction) => {
    const prisma = new PrismaClient()
    ctx.expense = new Expense(prisma)
    await next()
    await prisma.$disconnect()
  }
}
