import { TokenType } from "./tokenType";

export class Token {
    readonly tokenType: TokenType;
    readonly lexeme: string;
    readonly literal: object | string | number | undefined;
    readonly line: number;

    constructor(tokenType: TokenType, lexeme: string, line: number, literal?: object | string | number | undefined) {
        this.line = line;
        this.literal = literal;
        this.lexeme = lexeme;
        this.tokenType = tokenType;
    }

    toString() {
        return `${this.tokenType} ${this.lexeme} ${this.literal}`
    }
}
