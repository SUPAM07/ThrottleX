import { Project } from "ts-morph";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const mappings: Record<string, string> = {
  "../../src/adaptive": "@/services/adaptive",
  "../../src/ratelimit": "@/services/ratelimit",
  "../../src/geo": "@/services/geo",
  "../../src/schedule": "@/services/schedule",
  "../../src/cache": "@/services/cache",
  "../../src/security": "@/services/security",
  "../../src/observability": "@/utils/observability",
  "../../src/resilience": "@/utils/resilience",
  "../../src/benchmark": "@/benchmark",
  "../../src/config": "@/config",
  "../../src/models": "@/models",
  "../../src/utils": "@/utils",
  "../src/utils": "@/utils",
  "../../src": "@"
};

const testFiles = project.getSourceFiles("src/test/**/*.ts");
for (const sourceFile of testFiles) {
    for (const importDecl of sourceFile.getImportDeclarations()) {
        const val = importDecl.getModuleSpecifierValue();
        // apply the most specific mapping first
        for (const oldPath of Object.keys(mappings).sort((a,b) => b.length - a.length)) {
            if (val.startsWith(oldPath)) {
                const newPath = mappings[oldPath];
                const updated = val.replace(oldPath, newPath);
                console.log(`Updating ${val} to ${updated} in ${sourceFile.getBaseName()}`);
                importDecl.setModuleSpecifier(updated);
                break;
            }
        }
    }
}
project.saveSync();
console.log("TypeScript AST import transformation complete.");
