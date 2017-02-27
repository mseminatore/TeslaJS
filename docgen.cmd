@echo off

echo========================== Generating Docs ================================
cmd /c ".\node_modules\.bin\jsdoc2md" TeslaJS.js > DOCS.md
echo.
echo===========================================================================
