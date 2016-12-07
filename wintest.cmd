@echo off

echo Running JShint...
cmd /c node_modules\.bin\jshint src\TeslaJS.js
echo ...JShint complete

echo
echo Running tests...
cmd /c node_modules\.bin\mocha
echo ...tests complete

echo
echo Running JSCover...
cmd /c "node_modules\.bin\jscover" src lib-cov
echo ...JSCover complete

echo
echo Running Coveralls...
set TESLAJS_COV=1
cmd/c node_modules\.bin\mocha --reporter mocha-lcov-reporter | node node_modules/coveralls/bin/coveralls.js --verbose 
set TESLAJS_COV=
echo ...Coveralls complete

echo Done!
