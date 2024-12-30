import { expect, test } from "bun:test";
import {run} from "./main";

test("2 + 2", () => {
    expect(run("2 + 2")).toBe(4);
});

test("2 + 5*8", () => {
    expect(run("2 + 5*8")).toBe(42);
});

test("append strings", () => {
    expect(run("true ? 1 : 0")).toBe(1);
});