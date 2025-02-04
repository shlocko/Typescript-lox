import { Token } from './token'

export interface Expr {
    accept(v: ExprVisitor);
}

export class BinaryExpr {
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    left: Expr;
    operator: Token;
    right: Expr;
    accept(v: ExprVisitor) {
        return v.visitBinary(this)
    }
}

export class UnaryExpr {
    constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }
    operator: Token;
    right: Expr;
    accept(v: ExprVisitor) {
        return v.visitUnary(this)
    }
}

export class LiteralExpr {
    constructor(value: any) {
        this.value = value
    }
    value: any;
    accept(v: ExprVisitor) {
        return v.visitLiteral(this)
    }
}

export class GroupingExpr {
    constructor(expression: Expr) {
        this.expression = expression;
    }
    expression: Expr;
    accept(v: ExprVisitor) {
        return v.visitGrouping(this)
    }
}

export class TernaryExpr {
    constructor(condition: Expr, left: Expr, right: Expr) {
        this.condition = condition;
        this.left = left;
        this.right = right;
    }
    condition: Expr;
    left: Expr;
    right: Expr;
    accept(v: ExprVisitor) {
        return v.visitTernary(this);
    }
}



export interface ExprVisitor {
    //visitExpr(e: Expr);
    visitBinary(e: BinaryExpr);
    visitUnary(e: UnaryExpr);
    visitLiteral(e: LiteralExpr);
    visitGrouping(e: GroupingExpr);
    visitTernary(e: TernaryExpr);
}
