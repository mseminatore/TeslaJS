@echo off

call winlint.cmd
echo.
echo================================ Testing ========================================
call "./node_modules/.bin/istanbul" cover "./node_modules/mocha/bin/_mocha" --report lcovonly -- -R spec
echo.
echo================================= Coverage ======================================
type ".\coverage\lcov.info" | node ".\node_modules\coveralls\bin\coveralls.js" --verbose
echo=================================================================================
echo.
echo=================================================================================
echo                             *** All Done! ***
echo=================================================================================
