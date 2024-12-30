import {BinaryExpr, Expr, GroupingExpr, LiteralExpr, TernaryExpr, UnaryExpr} from "./ast";
import {error} from "./main";
import {Token} from "./token";
import {TokenType} from "./tokenType";

export class Parser {
    readonly tokens: Token[];
    current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Expr | null {
        try {
            return this.expression();
        } catch {
            return null;
        }
    }

    private expression(): Expr {
        return this.ternary();
    }
    
    private ternary(): Expr {
        let expr: Expr = this.equality();
        let left;
        let right;
        if(this.match(TokenType.QUESTION)){
            left = this.ternary();
            if(this.consume(TokenType.COLON, "Expect : in ternary.")){
                right = this.ternary();
                expr = new TernaryExpr(expr, left, right);
            }
        }
        return expr;
    }

    private equality(): Expr {
        let expr: Expr = this.comparison()

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            let operator: Token = this.previous();
            let right: Expr = this.comparison();
            expr = new BinaryExpr(expr, operator, right);
        }

        return expr

    }

    private comparison(): Expr {
        let expr: Expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator: Token = this.previous();
            let right: Expr = this.term();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private term(): Expr {
        let expr: Expr = this.factor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.factor();
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr;
    }

    private factor(): Expr {
        let expr: Expr = this.unary();
        while (this.match(TokenType.STAR, TokenType.SLASH)) {
            let operator: Token = this.previous();
            let right: Expr = this.unary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.unary();
            return new UnaryExpr(operator, right);
        }
        return this.primary();
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE))
            return new LiteralExpr(false);
        if (this.match(TokenType.TRUE))
            return new LiteralExpr(true);
        if (this.match(TokenType.NIL))
            return new LiteralExpr(null);
        if (this.match(TokenType.STRING, TokenType.NUMBER)) {
            return new LiteralExpr(this.previous().literal);
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expresion");
            return new GroupingExpr(expr);
        }

        throw this.error(this.peek(), "Expect expression.");
    }



    private match(...types: TokenType[]): boolean {
        for (var type of types) {
            if (this.check(type)) {
                //console.log("true in match")
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd())
            return false;
        return this.peek().tokenType === type;
    }

    private advance(): Token {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().tokenType === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current]
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private error(token: Token, message: string): ParseError {
        error(token, message);
        return new ParseError();
    }

    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().tokenType === TokenType.SEMICOLON)
                return;
            switch (this.peek().tokenType) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }
            this.advance();
        }
    }
}

class ParseError extends Error {
}


// expression ? expression : (expression ? expression : expression)

/*
expression     → ternary ;
ternary        → equality ? equality : equality;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
 */