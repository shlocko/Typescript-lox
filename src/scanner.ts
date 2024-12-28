import { error } from "./main";
import { Token } from "./token";
import { TokenType } from "./tokenType";

export class Scanner {
    source: string;
    tokens: Token[] = [];
    start: number = 0;
    current: number = 0;
    line: number = 1;

    static keywords = new Map();

    constructor(source: string) {
        this.source = source;
        Scanner.keywords.set('and', TokenType.AND);
        Scanner.keywords.set('class', TokenType.CLASS);
        Scanner.keywords.set('else', TokenType.ELSE);
        Scanner.keywords.set('false', TokenType.FALSE);
        Scanner.keywords.set('for', TokenType.FOR);
        Scanner.keywords.set('fun', TokenType.FUN);
        Scanner.keywords.set('if', TokenType.IF);
        Scanner.keywords.set('nil', TokenType.NIL);
        Scanner.keywords.set('or', TokenType.OR);
        Scanner.keywords.set('print', TokenType.PRINT);
        Scanner.keywords.set('return', TokenType.RETURN);
        Scanner.keywords.set('super', TokenType.SUPER);
        Scanner.keywords.set('this', TokenType.THIS);
        Scanner.keywords.set('true', TokenType.TRUE);
        Scanner.keywords.set('var', TokenType.VAR);
        Scanner.keywords.set('while', TokenType.WHILE);
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "EOF", this.line, {}))
        return this.tokens;
    }

    scanToken() {
        let c = this.advance();
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '\n': this.line++; break;
            case ' ':
            case '\r':
            case '\t': break;

            // Two-char
            case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
            case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
            case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
            case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                } else {
                    this.addToken(TokenType.SLASH)
                }
                break;
            case '"': this.string(); break;

            default:
                if (this.isCharNumber(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    error(this.line, "", `Unexpected character: ${c}`);
                }

                break;
        }
    }

    advance() {
        return this.source[this.current++]
    }

    match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source[this.current] !== expected) return false;

        this.current++;
        return true;
    }

    peek() {
        return this.source[this.current];
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source[this.current + 1]
    }

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            error(this.line, "");
        }

        this.advance();
        let value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    number() {
        while (!this.isAtEnd() && this.isCharNumber(this.peek())) this.advance();

        if (this.peek() === '.' && this.isCharNumber(this.peekNext())) {
            this.advance();
            while (!this.isAtEnd() && this.isCharNumber(this.peek())) this.advance();
        }

        let value = parseFloat(this.source.substring(this.start, this.current));

        this.addToken(TokenType.NUMBER, value);
    }

    identifier() {
        while (!this.isAtEnd() && this.isAlphaNumeric(this.peek())) this.advance();

        let value = this.source.substring(this.start, this.current);
        let type = Scanner.keywords.get(value);
        if (type == undefined) type = TokenType.IDENTIFIER;

        this.addToken(type);
    }


    isCharNumber(c: string) {
        return c.length === 1 && c >= '0' && c <= '9';
    }

    isAlpha(c: string) {
        return (c.length === 1 &&
            (
                (c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z') ||
                (c === '_')
            ))

    }

    isAlphaNumeric(c: string) {
        return this.isAlpha(c) || this.isCharNumber(c);
    }

    addToken(type: TokenType, literal?: object) {
        let text: string = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, this.line, literal))
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }
}
