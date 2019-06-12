# TeslaJS 
[![Version](http://img.shields.io/npm/v/teslajs.png)](https://www.npmjs.org/package/teslajs)
[![License](https://img.shields.io/npm/l/teslajs.svg)](https://github.com/mseminatore/TeslaJS/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dt/teslajs.svg)](https://www.npmjs.org/package/teslajs)
[![Build Status](https://travis-ci.org/mseminatore/TeslaJS.svg?branch=master)](https://travis-ci.org/mseminatore/TeslaJS)
[![Coverage Status](https://coveralls.io/repos/github/mseminatore/TeslaJS/badge.svg?branch=master)](https://coveralls.io/github/mseminatore/TeslaJS?branch=master)
[![Dependencies](https://david-dm.org/mseminatore/TeslaJS.svg)](https://david-dm.org/mseminatore/TeslaJS)

An unofficial NodeJS library that encapsulates the Tesla RESTful API. This 
library currently supports all existing Tesla vehicles.

[![NPM](https://nodei.co/npm/teslajs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/teslajs/)
[![NPM](https://nodei.co/npm-dl/teslajs.png)](https://nodei.co/npm/teslajs/)

First, it is important to acknowledge that there are already several very 
good Javascript libraries available for the Tesla. So why create another 
one? Rather than contribute to or modify one or more of the existing 
libraries, this library was created for two main reasons:

1. The anticipated need for a few small but important features that existing 
libraries did not provide
2. I was looking for a personal opportunity to learn more about the Tesla REST 
API, NodeJS, Express and Git/GitHub

## Notable Features

With the introduction of the new OAuth-based owner API, one of the features I 
wanted was the ability to make API calls without having to login each time a 
new process was invoked. Many existing libraries require a login transaction 
with each initiation of the library. With the TeslaJS library, once an auth 
token is retrieved it can be cached and used to make other Tesla REST API 
calls. For certain use cases, notably server logging of multiple vehicles, 
this can be important for moderating load on the Tesla login servers. 

This is also important if you want to use the library to do server-based data 
logging. It is generally safer to store an OAuth token on the server rather 
than logon credentials. If the server is compromised only the OAuth token is 
at risk and all existing tokens can be invalidated by changing the password on 
the account.

Another feature that I wanted was API stateless-ness (achieved via an **options** 
parameter to API calls) so that it was possible to use the library to make 
multiple overlapping async calls for different vehicles for data-logging.

## What's New!

You can read the complete history of changes in the 
[CHANGELOG](https://github.com/mseminatore/TeslaJS/blob/master/CHANGELOG.md).

Here are some of the more recent features and fixes:

1. In **4.3.1** updated minified version
2. In **4.3.0** added `setSentryMode()`
3. In **4.2.1** updated teslajs.min.js
4. In **4.2.0** added `nearbyChargers()` interface
5. In **4.1.0** added `seatHeater()` and `steeringHeater()` interfaces

## Migrating Major Version Changes

You can find instructions on how to migrate across major version changes by reading
the [MIGRATION](https://github.com/mseminatore/TeslaJS/blob/master/MIGRATION.md) guide.

## Known Issues

1. The homelink API appears to require Autopilot hardware. Can someone with 
AP test and report back?
2. Calendar support not yet functional. If someone can share the JSON for a 
valid calendar request that would help!

## Library Users

A growing number of projects use the library or are based on its code, examples:

- [Tesla Control](https://www.teslacontrol.app) app in the Windows Store. This 
Universal Windows App runs on Windows desktop, Windows Phone and Xbox.
-  [Nikola](https://github.com/geraldoramos/nikola) app on Github. This is a cross-platform app built with [Electron](https://github.com/electron/electron), currently available for macOS and Windows.


## Project Principles

This project has a few principles that have and will continue to guide its 
development.

1. **Dependency lean**. Try to keep the required dependencies to a minimum.
2. **Comprehensive**. Attempt to expose the full Tesla REST API surface area.
3. **Simple**. Using the library should be simple and straightforward 
following common conventions.
4. **Server friendly**. Provide for use based on auth tokens and avoid 
requiring access to passwords.

## Documentation

We've recently added auto-generated documentation via jsdocs. See the
 [DOCS](https://github.com/mseminatore/TeslaJS/blob/master/docs/DOCS.md)
for a mostly complete reference. Please let us know if you see something 
missing and we will continue to expand.

## Contributing

Contributions are welcome, particularly bug fixes and enhancements!
Refer to our [Contribution Guidelines](https://github.com/mseminatore/TeslaJS/blob/master/CONTRIBUTING.md) for details.

> Please note that Project owners reserve the right to accept or reject any PR
> for any reason.

## Code of Conduct

Before contributing or participating in the TeslaJS community please be sure to 
familiarize yourself with our project 
[CODE OF CONDUCT](https://github.com/mseminatore/TeslaJS/blob/master/CODE_OF_CONDUCT.md). 
These guidelines are intended to govern interactions with and within the TeslaJS 
community.

# Tesla API Documentation

The Tesla REST API encapusulated by this library was documented through the 
collaboration of many Tesla owners. Please thank and support them for their 
continued efforts! The latest REST API documentation can be found [here](https://tesla-api.timdorr.com/)
	
# Warranty Disclaimer

You may use this library with the understanding that doing so is 
**AT YOUR OWN RISK**. No warranty, express or implied, is made with regards 
to the fitness or safety of this code for any purpose. If you use this 
library to query or change settings of your vehicle you understand that it 
is possible to make changes that could inadvertently lower the security of 
your vehicle, or cause damage, through actions including but not limited to:

* Unlocking the vehicle
* Remotely starting the vehicle
* Opening the sunroof
* Opening the frunk or trunk
* Lowering the battery charge level
* Impacting the long-term health of your battery

> Please be careful not to use this code in a way that loads the Tesla servers
> with too many concurrent requests. Calling the Tesla REST APIs at a very high 
> frequency will stress the Tesla servers and could get your IP or favorite
> cloud service blocked by Tesla. Or in the worst case it could cause Tesla 
> to revoke the key that enables access via this and many other libraries.

# Installation

In order to use the library and/or samples you must first download and install
[NodeJS](http://nodejs.org). An installable TeslaJS module for [npm](http://npmjs.org) 
is now available.

To download and install the library and all of its dependencies to a local 
project directory use the following:

    npm install teslajs

If you are building an npm package that depends upon this library then you 
will want to use the **--save** parameter in order to update the 
**package.json** file for your project. For example:

    npm install teslajs --save
    
If you prefer to download and install the library globally for all future 
node projects you may use:

    npm install -g teslajs

You may also install directly from the GitHub 
[source](https://github.com/mseminatore/TeslaJS). Either download and unzip 
the source, or clone the repository.

> Remember, whether you install via ZIP source or Git clone you must install 
> the dependencies before using TeslaJS.

To install dependencies via npm, from the root level of the library directory 
type:

    npm install

This library and its accomanying samples are under active development. New 
features, samples and bug fixes are being added regularly.  To ensure that 
you have the very latest version of TeslaJS and it's dependencies be sure to 
update frequently.

To do so, from your project directory type:

    npm update

# Library Usage Examples

## Login Example

As you can see below, it is very simple to login and acquire an OAuth token.

```javascript
    var tjs = require('teslajs');

    var username = "<your MyTesla email>";
    var password = "<your MyTesla password>";

    tjs.login(username, password, function(err, result) {
        if (result.error) {
          console.log(JSON.stringify(result.error));
          process.exit(1);
        }

        var token = JSON.stringify(result.authToken);

        if (token)
            console.log("Login Succesful!");
    });
```

> Note: Currently the only way to invalidate an issued token is to change your 
> MyTesla account password.  Therefore, you must take care to properly secure 
> tokens.  Do not share them over an unsecure connection, or store them on a 
> public machine.

## Vehicle Example

With the OAuth token from a successful `login()` API call you can query the 
vehicle for the account:

```javascript
    var options = { authToken: result.authToken };
    tjs.vehicle(options, function (err, vehicle) {
        console.log("Vehicle " + vehicle.vin + " is: " + vehicle.state);
    });
```

Or using the Async Promise-based calls:

```javascript
    tjs.vehicleAsync(options).done(function(vehicle) {
        console.log("Vehicle " + vehicle.vin + " is: " + vehicle.state);
    });
```

## Charge State Example

Adding the vehicle ID from a successful `vehicle()` API call to options you can 
make other Tesla REST calls:

```javascript
    var options = { authToken: result.authToken, vehicleID: vehicle.id_s };
    tjs.chargeState(options, function (err, chargeState) {
        console.log("Current charge level: " + chargeState.battery_level + '%');
    });
```

And using the Async Promise-based calls:

```javascript
    tjs.chargeStateAsync(options).done(function(chargeState) {
        console.log("Current charge level: " + chargeState.battery_level + '%');
    });
```

Or using the `vehicleData()` API call:

```javascript
    tjs.vehicleData(options).done(function(vehicleData) {
        var chargeState = vehicleData.charge_state;
        console.log("Current charge level: " + chargeState.battery_level + '%');
    });

```

# Library Interfaces

The TeslaJS library exports a number of methods and constants.  The library 
also responds to some environment variables.

## Environment Variables

ENV variable | Description
------------ | -----------
TESLAJS_LOG | if set defines the value of the default logging level ([See constants](#library-exported-constants))
TESLAJS_SERVER | if set defines the URI for the Tesla servers (e.g. set to http://127.0.0.1:3000)
TESLAJS_STREAMING | if set defines the URI for the Tesla streaming servers (e.g. set to http://127.0.0.1:3000)

## General API Calls

These methods all require an `options` parameter with at least `options.authToken` defined.

Function | Description
-------- | -----------
getLogLevel() | gets the level of debug logging
setLogLevel() | sets the level of debug logging
getVin() | return the VIN from the vehicle object
getShortVin() | return short form VIN from the vehicle object
getPortalBaseURI() | gets the server URI
setPortalBaseURI() | sets the server for testing, pass null to reset
login() | authenticate with Tesla servers and retrieve the OAuth token
logout() | delete the current OAuth token
vehicle() | return information on the requested vehicle
vehicles() | return information and option data for all vehicles
getModel(vehicle) | returns the Tesla model as a string from vehicle object
getPaintColor(vehicle) | returns the paint color as a string from vehicle object

## Vehicle-specific API calls

These methods all require an `options` parameter with at least `options.authToken` and `options.vehicleID` defined.

> **Note**: Vehicle objects from the API contain *three* different strings that look like potential candidates for `vehicleID`. The correct one is `id_s`, and __**not**__ `id` or `vehicle_id`. Using the wrong ID will result in 404 errors!

> **Note**: The promise-based versions of the APIs have the suffix **Async** appended.  
> For example `vehicle()` and `vehicleAsync()`.

Function | Description
-------- | -----------
cancelSoftwareUpdate() | cancels a previously scheduled software update
chargeState() | retrieve the charge_state data
chargeStandard() | set the charge limit to 90%
chargeMaxRange() | sets the charge limit to 100%
climateState() | retrieve the climate_state data
climateStart() | turn on the HVAC system
climateStop() | turn off the HVAC system
closeChargePort() | close the charge port on appropriately equipped vehicles
doorLock() | locks the doors
doorUnlock() | unlocks the doors
driveState() | retrieve the drive_state data
flashLights() | flashes the headlights
guiSettings() | retrieves the GUI settings
homelink() | Triggers homelink from the vehicle
honkHorn() | honks the horn
mediaTogglePlayback() | toggles media playback
mediaPlayNext() | plays the next track
mediaPlayPrevious() | plays the previous track
mediaPlayNextFavorite() | plays the next favorite
mediaPlayPreviousFavorite() | plays the previous favorite
mediaVolumeUp() | increase the volume
mediaVolumeDown() | decrease the volume
mobileEnabled() | returns whether mobile access is enabled
navigationRequest() | send a navigation request to the vehicle
nearbyChargers() | returns a list of nearby destination and superchargers
openChargePort() | opens the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped
openTrunk() | open the trunk or frunk
refreshToken() | retrieve new OAuth token from refresh token
remoteStart() | enables remote starting of the car
resetValetPin() | reset the valet pin
scheduleSoftwareUpdate() | schedule a firmware update
seatHeater() | adjust seat heating level
setChargeLimit() | sets the charge limit to a specific amount
setSentryMode() | enables or disables sentry mode
setTemps() | set driver/passenger temp set points (in Deg.C)
setValetMode() | set/reset valet mode
speedLimitActivate() | activate the speed limit
speedLimitDeactivate() | deactivate the speed limit
speedLimitClearPin() | clear the speed limit pin
speedLimitSetLimit() | set the speed limit
startCharge() | initiates a charging session
startStreaming() | initiate a streaming data session
steeringHeater() | adjust the steering wheel heater
stopCharge() | terminates a charging session
sunRoofControl() | put the sunroof into a specific state
sunRoofMove() | open the sunroof to a specific percent
vehicleData() | retrieve **all** vehicle state data in a single call
vehicleConfig() | retrieve the vehicle_config data
vehicleState() | retrieve the vehicle_state data
wakeUp() | attempt to wake a sleeping vehicle

## Library Exported Constants

Constant | Description
-------- | -----------
streamingPortal | the URI for the streaming API portal
portal | the base URI for the OAuth-based API portal
API_LOG_ALWAYS | log this message always
API_CALL_LEVEL | log all API calls
API_RETURN_LEVEL | log all API calls and completions
API_REQUEST_LEVEL | log all API requests
API_RESPONSE_LEVEL | log all API responses
API_BODY_LEVEL | log calls and completions as well as the body of POST commands
API_LOG_ALL | the highest level of logging
CHARGE_STORAGE | charge to 50%
CHARGE_STANDARD | charge to 90%
CHARGE_RANGE | charge to 100%.  Tesla recommends against frequent usage!
MAX_TEMP | maximum temperature for climate system
MIN_TEMP | minimum temperature for climate system
SUNROOF_CLOSED | closes the sunroof
SUNROOF_VENT | open the sunroof to the vent position
streamingColumns | an array of the available streaming columns
FRUNK | constant for openTrunk API
TRUNK | constant for openTrunk API

Most of the APIs take both an **options** parameter and an optional 
**callback** function.  The **options** parameter must always contain a 
property called **authToken** that contains the OAuth token returned 
from a successfull `login()`.  For all APIs that act on a specific 
vehicle the **options** parameter must also contain a **vehicleID** 
member that contains the long vehicle ID value (ie. `id_s`) returned from a successful 
call to `vehicle()`.

By default the `vehicle()` API returns information on the first vehicle 
returned.  By providing a **carIndex** member in the **options** parameter 
information on a specific vehicle can be queried.
	
# Samples

A collection of samples are provided in the `samples` directory.  These demonstrate 
some basic usage scenarios for the library.  To use the samples first:

    cd samples
    node sampleName

After running the [login](#loginjs) sample an auth token will be cached locally.

If you prefer to avoid keeping an auth token on your machine, provide login 
credentials on the command line for each sample.  This will perform a login 
request and keep the token only for the duration of the sample.  The 
difference lies in whether you are more comfortable with the security of a 
file associated with an account in your file system vs. the visibility of 
your login credentials in the process table for the lifetime of the sample.

## List of Samples

Sample | Description
------ | -----------
[login](#loginjs) | Login and acquire an OAuth token.  Cached to the local directory
[logout](#logoutjs) | Delete the locally cached OAuth token if present
[cancelUpdate](#cancelupdatejs) | Cancels a previously scheduled software update
[climate](#climatejs) | Display the current state of the HVAC system
[climateStart](#climatestartjs) | Turn on the HVAC system
[climateStop](#climatestopjs) | Turn off the HVAC system
[flashLights](#flashlightsjs) | Flash the headlights
[geoloc](#geolocjs) | Display the current GPS location of the vehicle
[guiSettings](#guisettingsjs) | Display the current unit format settings
[homelink](#homelinkjs) | Trigger homelink (note appears to require AP hardware)
[honkHorn](#honkhornjs) | Honk the horn
[lock](#lockjs) | Lock the car doors
[media](#mediajs) | Sends commands to the vehicle media system
[mobileEnabled](#mobileenabledjs) | Display whether remote access is enabled
[navRequest](#navrequestjs) | Send an address to the vehicle
[odometer](#odometerjs) | Displays the current odometer value
[openChargePort](#openchargeportjs) | Opens the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped
[openTrunk](#opentrunkjs) | Opens the FRUNK or opens/closes the trunk
[resetValetPin](#resetvaletpinjs) | Resets the valet mode pin
[remoteStart](#remotestartjs) | Enables driving without the key fob present
[scheduleUpdate](#scheduleupdatejs) | Schedules a software update for installation
[setChargeLimit](#setchargelimitjs) | Set the battery charge limit to the given value
[setSpeed](#setspeedjs) | Sets the speed limit
[setTemps](#settempsjs) | Set the driver and passenger temperatures to the given value
[simpleStreaming](#simplestreamingjs) | Demonstrates basic use of the streaming API
[soc](#socjs) | Displays the current battery State of Charge (SOC) for the vehicle
[startCharge](#startchargejs) | Initiate a charging session
[stopCharge](#stopchargejs) | Terminate a charging session
[sunroof](#sunroofjs) | Control the sunroof.  Be careful!
[unlock](#unlockjs) | Unlock the car doors
[valet](#valetjs) | Enable or disable valet mode
[vehicle](#vehiclejs) | Retrieve and display information on the current vehicle state
[vehicleConfig](#vehicleConfigjs) | Retrieve and display information on the current vehicle configuration
[wakeup](#wakeupjs) | Send a wakeup command to the vehicle
	
## login.js

This sample demonstrates the basic login process which returns the OAuth token required for other API calls.  The sample
writes out a file called **.token** which stores the OAuth token.  Other samples will use this cached token, if present, 
to avoid the need to request the **username** and **password** and login redundantly via the Tesla servers.

> If you prefer not to have your OAuth token stored locally do not run this sample.  Instead you may run the samples and provide 
> the **username** and **password** each time on the command line.

Usage:

    node login.js [options] username password
	
	Options:
	
    -h, --help               output usage information
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## logout.js

This sample deletes the locally cached **.token** file if present.

Usage:

    node logout.js

([top](#teslajs))
	
## cancelUpdate.js

This sample cancels a previously scheduled software update for the vehicle.

Usage:

    node cancelUpdate.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## climate.js

This sample retrieves and displays the **climate_state** data on the HVAC system of the vehicle.

Usage:

    node climate.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## climateStart.js

This sample demonstrates turning on the HVAC system of the vehicle.

Usage:

    node climateStart.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## climateStop.js

This sample demonstrates turning off the HVAC system of the vehicle.

Usage:

    node climateStop.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## flashLights.js

This sample demonstrates flashing the headlights of the vehicle.

Usage:

    node flashLights.js [options]
		
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## geoloc.js

This sample retrieves and displays information on the location and driving state of the car using the **drive_state** query.

Usage:

    node geoloc.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
	-g, --geocode            geocode (reverse geocode to nearest address)
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## guiSettings.js

This sample retrieves and displays the current display formats for the user interface.

Usage:

    node guiSettings.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## homelink.js

This sample demonstrates triggering homelink via the vehicle.

>Note: This feature appears to be tied to the presence of Autopilot hardware and software.  Looking for validation
>on both AP and pre-AP vehicles. 

Usage:

    node homelink.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## honkHorn.js

This sample demonstrates honking the horn of the vehicle.

Usage:

    node honkHorn.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## lock.js

This sample demonstrates locking the doors of the vehicle.

Usage:

    node lock.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## media.js

This sample sends a command to the vehicle media system.

Usage:

    node media.js [options] toggle|next|prev|next_fav|prev_fav|up|down

	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## mobileEnabled.js

This sample retrieves and displays whether mobile access is enabled.

Usage:

    node mobileEnabled.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## navRequest.js

This sample sends an address to the vehicle navigation system.

Usage:

    node navRequest.js [options] subject text [locale]
	
    subject - the short-version of the destination name
    text - the name and address of the destination
    locale - the locale, if not present defaults to en-US

	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## odometer.js

This sample retrieves and displays the current vehicle odometer value.

Usage:

    node odometer.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## openChargePort.js

This sample sends the command to open the charge port, or to release the latch if
the charge port is open, a cable is plugged in, and charging is stopped.

Usage:

    node openChargePort.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## openTrunk.js

This sample sends the command to open or close the trunk or frunk.  On current
model vehicles only the trunk can currently be closed.

Usage:

    node openTrunk.js [options] trunk|frunk
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## remoteStart.js

This sample enables remotely starting the vehicle without a key fob present.  

>Note that the **password** parameter is **required** in this sample.

Usage:

    node remoteStart.js [options] password
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## resetValetPin.js

This sample attempts to reset the current valet pin.

Usage:

    node resetValetPin.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## scheduleUpdate.js

This sample schedules a pending software update for installation.

Usage:

    node scheduleUpdate.js [options] delay
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## setChargeLimit.js

This sample sets the current battery charge limit to the given value.

Usage:

    node setChargeLimit.js [options] number|standard|storage|range
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## setSpeed.js

This sample sets the speed limit to the given value.

Usage:

    node setTemps.js [options] speed
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## setTemps.js

This sample sets the driver and passenger temperature to the given value.

Usage:

    node setTemps.js [options] temperature
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## simpleStreaming.js

This sample demonstrates basic use of the streaming API to retrieve real-time vehicle data.

Usage:

    node simpleStreaming.js [options] username
	
	Options:
	
    -h, --help               output usage information
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## soc.js

This sample retrieves the **charge_state** information and displays the charge limit, the current 
vehicle charge level, and the ideal, rated and projected range.

Usage:

    node soc.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## startCharge.js

This sample demonstrates how to initiate a charging session.

Usage:

    node startCharge.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## stopCharge.js

This sample demonstrates how to terminate a charging session.

Usage:

    node stopCharge.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## sunroof.js

This sample demonstrates controlling the panoramic sunroof if present.

Usage:

    node sunroof.js [options] close|vent
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))
	
## unlock.js

This sample demonstrates unlocking the doors of the vehicle.

Usage:

    node unlock.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## vehicle.js

This sample retrives and displays several elements of data returned from the **vehicle_state** REST API. 

Usage:

    node vehicle.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)
	-i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## vehicleConfig.js

This sample retrives and displays several elements of data returned from the **vehicle_config** REST API.

Usage:

    node vehicleConfig.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)
	-i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## valet.js

This sample enables or disables valet mode. 

Usage:

    node valet.js [options] ON|OFF pincode
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)

([top](#teslajs))

## wakeup.js

This sample sends a wakeup signal to wake a vehicle in sleep mode.

Usage:

    node wakeup.js [options]
	
	Options:
	
    -h, --help               output usage information
	-u, --username [string]  username (needed only if token not cached)
	-p, --password [string]  password (needed only if token not cached)	
    -i, --index <n>          vehicle index (first car by default)
    -U, --uri [string]       URI of test server (e.g. http://127.0.0.1:3000)
	
[Back to Top](#teslajs)
