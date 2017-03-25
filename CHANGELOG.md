# TeslaJS Change log

## v2.1.26
* small sample tweaks

## v2.1.25
* added `refresh_token` property to obj return from `login()` and `refreshToken()`

## v2.1.24
* added `refreshToken()` and test cases
* updated samples to save/use full token payload

## v2.1.23
* added `getVin()` and `getShortVin()`
* added test cases

## v2.1.22
* addressed #71 enhancing error handling

## v2.1.21
* more test coverage
* added global consts to docs

## v2.1.20
* expanded docs

## v2.1.19
* added header advertising of gzip #69

## v2.1.18
* moved commander to devDependency, still used by samples
* added more jsdocs tagging

## v2.1.17
* removed old model id code from sampleFramework now using `getModel()`

## v2.1.16
* added test case for `startStreaming()`
* fixed incorrect login failure test case

## v2.1.15
* added dependency checking badge to README
* updated depdendencies
* added login param checking
* added test case for login failure

## v2.1.14
* added jsdoc generation
* fixed #66 crash in sampleFramework.js

## v2.1.13
* added Code of Conduct

## Up through v2.1.11
* addressed #60 issue with **simpleStreaming** sample
* a number of documentation fixes and updates

## v2.1.6
* address issue #58 Fixed **valet** sample failure with missing cmd line parm
* address issue #57 Fixed **settemps** sample failure with missing cmd line parm
* addresed issue #56 clamping error in **settemps** sample

## Up through v2.1.5
* clarified paint color names to address #55

## Up through v2.1.3
* updated docs for #53 and #54
* addressed #53 and #54 by adding `getModel()` and `getPaintColor()` to return vehicle model and color
* added more test cases and updated docs

## v2.1.0
* addressed #47 by adding `vehicle()` and `allVehicles()` interfaces

## Up through v2.0.21
* addressed #49 by removing `colors` dependency
* samples still use `colors`

## v2.0.19
* clamp charge level and temp inputs and expose new consts

## v2.0.15
* added new samples **lock** and **unlock**

## v2.0.14
* fixed jshint errors

## v2.0.12
* `vehicles()` now updates options with vehicleID

## v2.0.10
* added error checking to sunroof

## v2.0.9
* switched to strict mode

## v2.0.8
* updated documenation for removal of testla

## v2.0.7
* added references to new **testla** sample location
* removed **testla** and its depenencies
* streamlined logic in request calls

## v2.0.6
* removed err() and improved error handling
* fixed contribution guidelines
* added Project Principles and Contribution guidelines

## v2.0.4
* fix missing tjs parameter to sampleMain
* finish moving samples to new framework
* revised more samples for new framework
* added logo
* sample factoring

## v2.0.3
* fixed login example

## v2.0.2
* removed github badges, too noisy
* added samples to jshint coverage

## v2.0.1
* fix badges
* added github badges

## v2.0.0
* revised documentation for 2.x
* Finished fixing samples for Async changes
* Finished Promise based *Async APIs

## v1.0.54
* update tests and fix log level check
* cleanup samples for jshint
* enabling windows jshint testing
* added new *always* log level

## v1.0.53
* additional test cases
* switched code coverage plan
* updated to ignore coverage files

## v1.0.52
* added jshint and fixed errors
* start exploring code coverage

## v1.0.51
* commented out sepia for now
* added more test cases

## v1.0.50
* added first test cases
* Fixed `car_version` typo
* fixed case and path issue in `require`
* Removed relative pathing
* updated node version for test coverage

## v1.0.49
* started adding mocha test support

## v1.0.48
* added build status badge
* make tests succeed for now
* started travis-ci integration

## v1.0.47
* attempt to fix vehicle response parse issue

## v1.0.46
* fixed sample bug #29 login fails due to missing email param

## v1.0.44
* added Model X support

## v1.0.42
* started to explore multi-car

## v1.0.41
* checked in and documentaed non-working calendar sample

## v1.0.38
* streaming works!
* first working streaming version
* fixed **login** sample error

## v1.0.37
* fixed **login** and **soc** samples, updated readme

## v1.0.36
* progress on calendar, not yet working

## v1.0.35
* added start of jquery support to **testla** sample
* added homelink support

## v1.0.32
* added charging simulation to **testla**

## v1.0.30
* updated web views for **testla**

## v1.0.28
* all web views can update server state in **testla**
* drivestate updated by webview in **testla**

## v1.0.27
* updated for ENV variables and colors
* updated sample cmd line help

## v1.0.26
* big updates to **testla**

## v1.0.25
* added error handlers
* added start of new apis, added logging
* renamed **mockla** to **testla**

## v1.0.24
* updated time remaining for charging

## v1.0.22
* added state change tracking to **mockla**
* added **guiSettings** and **mobileEnabled** samples

## v1.0.21
* updates for **mockla** sample
* updated more samples for **mockla**

## v1.0.19
* added beginnings of **mockla** sample and support
* add ability to change baseURI

## v1.0.18
* updated description for npm
* added multi-vehicle support to samples

## v1.0.17
* updated for new samples
* added multi-vehicle suppport
* updated all samples for new cmd line
* added new cmd line processing

## v1.0.16
* added **sunroof** sample, fixed bugs in **setTemps** and **vehicle** samples

## v1.0.15
* fixed issue with setTemps sample

## v1.0.14
* added **setTemps** sample, updated **setChargeLimit** sample

## v1.0.13
* added **setChargeLimit** sample

## v1.0.12
* added **remoteStart** sample

## v1.0.11
* added `colors` support

## v1.0.9
* add **geoloc** sample

## v1.0.8
* add `reset_valet_pin()` and `close_charge_port()` APIs

## v1.0.7
* added **openChargePort** sample
* added **wakup** sample

## v1.0.5
* renamed samples to match APIs
* update samples, add **valet** sample

## v1.0.4
* add POST body logging

## v1.0.3
* renamed npm package

## v1.0.0
* publish 1.0.0 via npm
