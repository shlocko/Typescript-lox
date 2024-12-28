const fs = require('fs');
const path = require('path');
const readline = require('readline')

export let HAD_ERROR = false;
export let HAD_RUNTIME_ERROR = false;

import { AstPrinter } from "./astPrinter";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Scanner } from "./scanner";
import { Token } from "./token";



const runFile = (scriptName: string) => {
    const filePath = path.join(__dirname, scriptName);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8'); // Read file and store contents in a string
        //console.log(fileContents);
        console.log("Executing: " + scriptName);
        //console.log(fileContents.length)
        run(fileContents)
    } catch (err) {
        console.error('An error occurred:', err.message);
    }

    // TODO
}

async function runPrompt() {
    /*const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });*/
    console.log("Lox: \n > ");
    while (true) {
        for await (const line of console) {
            HAD_ERROR = false;
            HAD_RUNTIME_ERROR = false;
            run(line)
        }
    }
    // TODO
}

const run = (input: string) => {
    let scanner = new Scanner(input);
    //console.log(scanner.scanTokens())
    let tokens = scanner.scanTokens();
    //console.log(tokens)
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

