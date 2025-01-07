import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr, ExprVisitor, TernaryExpr } from "./ast"
import { Token } from "./token"
import { TokenType } from "./tokenType"

export class AstPrinter implements ExprVisitor {
    visitExpr(e: Expr) {
        return e.accept(this)
    }
    visitBinary(e: BinaryExpr) {
        return this.parenthesize(e.operator.lexeme, e.left, e.right)
    }
    visitGrouping(e: GroupingExpr) {
        return this.parenthesize("group", e.expression)
    }
    visitLiteral(e: LiteralExpr) {
        return e.value.value
    }
    visitUnary(e: UnaryExpr) {
        return this.parenthesize(e.operator.lexeme, e.right)
    }
    visitTernary(e: TernaryExpr) {
        return this.parenthesize("ternary", e.condition, e.left, e.right)
    }
    parenthesize(name: string, ...exprs: Expr[]) {
        let str = ""
        str = str.concat("(", name)
        exprs.forEach((e: Expr) => {
            str = str.concat(" ", e.accept(this))
        })
        str = str.concat(")")
        return str
    }
}

