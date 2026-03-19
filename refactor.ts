import { Project } from "ts-morph";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const mappings: Record<string, string> = {
  "src/adaptive": "src/services/adaptive",
  "src/ratelimit": "src/services/ratelimit",
  "src/geo": "src/services/geo",
  "src/schedule": "src/services/schedule",
  "src/cache": "src/services/cache",
  "src/security": "src/services/security",
  "src/observability": "src/utils/observability",
  "src/resilience": "src/utils/resilience",
};

for (const sourceFile of project.getSourceFiles()) {
    const oldPath = sourceFile.getFilePath();
    
    for (const [oldPrefix, newPrefix] of Object.entries(mappings)) {
        if (oldPath.includes("/" + oldPrefix + "/")) {
            const newPath = oldPath.replace("/" + oldPrefix + "/", "/" + newPrefix + "/");
            console.log(`Moving ${oldPath.split('/src/')[1]} to ${newPath.split('/src/')[1]}`);
            sourceFile.move(newPath);
            break;
        }
    }
}

project.saveSync();
console.log("TypeScript AST transformation complete.");
