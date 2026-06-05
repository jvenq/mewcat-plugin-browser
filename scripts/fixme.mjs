#!/usr/bin/env zx

const fixme = require("fixme")

fixme({
    path: process.cwd(),
    ignored_directories: ["node_modules/**", ".git/**", ".yarn/**", "cache/**", "dist/**", "static/**", "doc-theme/**"],
    file_patterns: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx", "src/**/*.scss"],
    file_encoding: "utf8",
    line_length_limit: 2000,
    skip: []
})
