import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, TernaryExpr, UnaryExpr, ExprVisitor } from "./ast";
import { RuntimeError } from "./runTimeError";
import { Expression, Print, Stmt, StmtVisitor } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./tokenType";

export class Interpreter implements ExprVisitor, StmtVisitor {
    visitPrint(stmt: Print) {
        console.log(this.stringify(this.evaluate(stmt.expr)))
        return null;
    }
    visitExpression(stmt: Expression) {
        this.evaluate(stmt.expr);
        return null;
    }
    visitLiteral(e: LiteralExpr) {
        return e.value;
    }
    visitGrouping(e: GroupingExpr) {
        return this.evaluate(e.expression);
    }
    visitUnary(e: UnaryExpr) {
        let right: object = this.evaluate(e.right);
        switch (e.operator.tokenType) {
            case TokenType.MINUS:
                this.checkNumberOperand(e.operator, right)
                return -Number(right);
            case TokenType.BANG:
                return !this.isTruthy(right);
        }

        return null;
    }
    visitBinary(e: BinaryExpr) {
        let left: object = this.evaluate(e.left);
        let right: object = this.evaluate(e.right);

        switch (e.operator.tokenType) {
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case TokenType.GREATER:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) <= Number(right);
            case TokenType.MINUS:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.SLASH:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) / Number(right);
            case TokenType.STAR:
                this.checkNumberOperands(e.operator, left, right);
                return Number(left) * Number(right);
            case TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number") {
                    return Number(left) + Number(right);
                }
                if (typeof left === "string" || typeof right === "string") {
                    return String(left) + String(right);
                }
                throw new RuntimeError(e.operator, "Operands must be two numbers, or two strings.");
        }

        return null;
    }
    visitTernary(e: TernaryExpr) {
        let condition = this.isTruthy(this.evaluate(e.condition));
        let left = e.left;
        let right = e.right;
        if (condition) {
            return this.evaluate(left)
        } else {
            return this.evaluate(right)
        }
        return null;
    }


    evaluate(e: Expr) {
        return e.accept(this);
    }
    isTruthy(o: object): boolean {
        if (o === null)
            return false;
        if (typeof o === "boolean")
            return Boolean(o)
        return true;
    }
    isEqual(left: object, right: object) {
        if (left === null && right === null)
            return true;
        if (left === null)
            return false;
        return left === right;
    }
    checkNumberOperand(operator: Token, operand: object) {
        if (typeof operand === "number")
            return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }
    checkNumberOperands(operator: Token, left: object, right: object) {
        if (typeof left === "number" && typeof right === "number")
            return;
        throw new RuntimeError(operator, "Operands must be numbers.");
    }
    stringify(o: object) {
        if (o === null)
            return "nil";
        if (typeof o === "number")
            return o
        return o
    }

    interpret(stmts: Stmt[]) {
        try {
            for (const stmt of stmts) {
                this.execute(stmt);
            }
        } catch (err) {
            console.log(err)
        }
    }

    execute(stmt: Stmt) {
        stmt.accept(this);
    }
}

// 1+2+3
