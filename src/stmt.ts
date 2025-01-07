import { Expr } from "./ast";

export interface Stmt {
    accept(v: StmtVisitor);
}

export class Expression implements Stmt {
    readonly expr: Expr
    constructor(expr: Expr) {
        this.expr = expr
    }
    accept(v: StmtVisitor) {
        return v.visitExpression(this)
    }

}

export class Print implements Stmt {
    expr: Expr
    constructor(expr: Expr) {
        this.expr = expr
    }
    accept(v: StmtVisitor) {
        return v.visitPrint(this)
    }
}


export interface StmtVisitor {
    visitExpression(stmt: Expression)
    visitPrint(stmt: Print)
}
