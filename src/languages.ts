import type { Language, LanguageConfig } from "./types";

export const LANGUAGE_ORDER: Language[] = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "c",
  "cpp",
  "zig",
];

export const LANGUAGES: Record<Language, LanguageConfig> = {
  javascript: {
    label: "JS",
    execution: "js",
    sampleCode: `// JavaScript\nconsole.log('Hello, world!');\n\nconst fib = n => n <= 1 ? n : fib(n - 1) + fib(n - 2);\nconsole.log([...Array(8).keys()].map(fib));`,
  },

  typescript: {
    label: "TS",
    execution: "piston",
    pistonId: "typescript",
    filename: "main.ts",
    sampleCode: `// TypeScript\ninterface Point { x: number; y: number }\n\nconst dist = (a: Point, b: Point): number =>\n  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);\n\nconsole.log(dist({ x: 0, y: 0 }, { x: 3, y: 4 }));`,
  },

  python: {
    label: "Py",
    execution: "piston",
    pistonId: "python",
    filename: "main.py",
    sampleCode: `# Python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint([fib(i) for i in range(10)])`,
  },

  rust: {
    label: "RS",
    execution: "piston",
    pistonId: "rust",
    filename: "main.rs",
    sampleCode: `fn main() {\n    let nums: Vec<i32> = (1..=5).collect();\n    let sum: i32 = nums.iter().sum();\n    println!("Sum 1–5: {sum}");\n\n    for n in &nums {\n        println!("{n}");\n    }\n}`,
  },

  c: {
    label: "C",
    execution: "piston",
    pistonId: "c",
    filename: "main.c",
    sampleCode: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}`,
  },

  cpp: {
    label: "C++",
    execution: "piston",
    pistonId: "c++",
    filename: "main.cpp",
    sampleCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {5, 3, 1, 4, 2};\n    std::sort(v.begin(), v.end());\n    for (int n : v) std::cout << n << " ";\n    std::cout << "\\n";\n}`,
  },

  zig: {
    label: "Zig",
    execution: "piston",
    pistonId: "zig",
    filename: "main.zig",
    sampleCode: `const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("Hello, World!\\n", .{});\n\n    var i: u32 = 1;\n    while (i <= 5) : (i += 1) {\n        try stdout.print("{d}\\n", .{i});\n    }\n}`,
  },
};
