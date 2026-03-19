import { Project } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

// 1. Move everything in src to src/main
const srcFiles = project.getSourceFiles("src/**/*.ts");
for (const sourceFile of srcFiles) {
    const oldPath = sourceFile.getFilePath();
    // Exclude anything already in main or test just in case
    if (!oldPath.includes("/src/main/") && !oldPath.includes("/src/test/")) {
        const newPath = oldPath.replace("/src/", "/src/main/");
        console.log(`Moving ${oldPath} to ${newPath}`);
        sourceFile.move(newPath);
    }
}

// 2. Move everything in tests to src/test
const testFiles = project.getSourceFiles("tests/**/*.ts");
for (const sourceFile of testFiles) {
    const oldPath = sourceFile.getFilePath();
    const newPath = oldPath.replace("/tests/", "/src/test/");
    console.log(`Moving ${oldPath} to ${newPath}`);
    sourceFile.move(newPath);
}

project.saveSync();
console.log("TypeScript AST transformation complete.");
