@echo off

echo========================== Generating Docs ================================
cmd /c ".\node_modules\.bin\jsdoc2md" TeslaJS.js > docs\DOCS.md
echo                      ..Documentation generated..
echo===========================================================================
