import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr, Visitor } from "./ast"
import { Token } from "./token"
import { TokenType } from "./tokenType"

export class AstPrinter implements Visitor {
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

let exp: BinaryExpr = new BinaryExpr(
    new LiteralExpr(123),
    new Token(TokenType.STAR, "*", 1),
    new LiteralExpr(124)
)

let exp2: BinaryExpr = new BinaryExpr(
    exp,
    new Token(TokenType.PLUS, "+", 1),
    new LiteralExpr(12.568)
)

let exp3: BinaryExpr = new BinaryExpr(
    exp2,
    new Token(TokenType.MINUS, "-", 1),
    new GroupingExpr(
        exp
    )
)

let printer = new AstPrinter();

//console.log("test")
//console.log(exp)
//console.log(printer.visitExpr(exp3))
