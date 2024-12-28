import fs from "node:fs";
import path from "node:path";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Scanner } from "./scanner";
import { Token } from "./token";

export let HAD_ERROR = false;
export let HAD_RUNTIME_ERROR = false;




const runFile = (scriptName: string) => {
    const filePath = path.join(__dirname, scriptName);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8'); // Read file and store contents in a string
        console.log("Executing: " + scriptName);
        run(fileContents)
    } catch (err) {
        console.error('An error occurred:', err.message);
    }

    // TODO
}

async function runPrompt() {
    console.log("Lox: \n > ");
    while (true) {
        for await (const line of console) {
            HAD_ERROR = false;
            HAD_RUNTIME_ERROR = false;
            run(line)
        }
    }
}

const run = (input: string) => {
    let scanner = new Scanner(input);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let interpreter = new Interpreter();
    let expr = parser.parse();
    if (HAD_ERROR || HAD_RUNTIME_ERROR)
        return;
    if (expr)
        interpreter.interpret(expr)

}

const report = (line: number, where: string, message: string) => {
    console.log(`[line ${line}] Error${where}: ${message}`)
}

export const error = (token: Token, message: string) => {
    report(token.line, "", message);
    HAD_ERROR = true;
}

const main = () => {
    if (Bun.argv.length > 3) {
        console.log("Usage: lox [script]");
    } else if (Bun.argv.length == 3) {
        runFile(Bun.argv[2]);
    } else {
        runPrompt();
    }
}


main();

