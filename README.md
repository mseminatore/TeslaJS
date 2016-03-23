# TeslaJS
An unofficial Tesla API for NodeJS.

It is important to acknowledge that there are already several very good Javascript libraries available for the Tesla.  So 
why create another one?  I created this library for two main reasons:

1. The anticipated need for a few small but important features that existing libraries did not provide
2. I was looking for a personal opportunity to learn more about the Tesla REST API, Node.js and Github

## Notable Features

With the introduction of the new OAuth-based owner API, one of the features I wanted was the ability to make API calls
without having to login each time.  Once an auth token is retrieved it can be used to make other REST API calls.  This 
is important for moderating load on the Tesla login servers.  This is also important if you want to use the library 
to do server-based data logging.  It is safer to store an auth token on the server than logon credentials.  

Another feature that I wanted was stateless-ness (achieved via an **options** parameter to API calls) so that it was 
possible to use the library to make multiple overlapping async calls for different vehicles for data-logging.

# API Documentation

The REST API encapusulated by this library was documented through the work of many Tesla Model S owners.  The current
REST API documentation can be found at:

    http://docs.timdorr.apiary.io/
	
# Warranty Disclaimer

You may use this library with the understanding that doing so is **AT YOUR OWN RISK**.  No warranty, express or implied, 
is made with regards to the fitness or safety of this code for any purpose.  If you use this library to query or change 
settings of your vehicle you understand that it is possible to make changes that could inadvertently lower the security 
of your vehicle, or cause damage, through actions including but not limited to:

* Unlocking the vehicle
* Remotely starting the vehicle
* Opening the sunroof
* Opening the frunk or trunk
* Lowering the battery charge level
* Impacting the health of your battery

# Installation

In order to use the library and/or samples you must first download and install **Node.js** from http://nodejs.org

An installable module for 'npm' is now available.  To download and install the library and its dependencies globally:

    npm install -g teslajs
	
Or if you want to install only to a local project directory:

    npm install teslajs

You may also install directly from the github source.  Either download and unzip the source, or clone the repository.  
Then from the root level of the library directory:

    npm install

# Interfaces

The TeslaJS library provides the following methods:

**General API calls**

    setLogLevel() - sets the level of debug logging
	getLogLevel() - gets the level of debug logging
	login() 	  - authenticate with Tesla servers and retrieve the OAuth token
	logout() 	  - invalidate the OAuth tokens for the given credentials
	vehicles() 	  - retrieve a list of the vehicles and option data associated with the OAuth token
	
**API calls for a given vehicle id**
	
	vehicleState()     - retrieve the vehicle_state data
	climateState()     - retrieve the climate_state data
	driveState()       - retrieve the drive_state data
	chargeState()      - retrieve the charge_state data
	guiSettings()      - retrieves the GUI settings
	mobileEnabled()    - returns whether mobile access is enabled
	honkHorn() 		   - honks the horn
	flashLights()      - flashes the headlights
	startCharge()      - initiates a charging session
	stopCharge()       - terminates a charging session
	openChargePort()   - opens the charge port
	setChargeLimit()   - sets the charge limit to a specific amount
	chargeStandard()   - set the charge limit to 90%
	chargeMaxRange()   - sets the charge limit to 100%
	doorLock() 		   - locks the doors
	doorUnlock() 	   - unlocks the doors
	climateStart()     - turn on the HVAC system
	climateStop()      - turn off the HVAC system
	sunRoofControl()   - put the sunroof into a specific state
	sunRoofMove()      - open the sunroof to a specific percent
	setTemps() 		   - set the driver and passenger temperature set points
	remoteStartDrive() - enables remote starting of the car
	openTrunk() 	   - open the trunk or frunk
	wakeUp() 		   - attempt to wake a sleeping vehicle
	setValetMode() 	   - set/reset valet mode
	startStreaming()   - initiate a streaming data session

The library also exports the following constants:

	streamingPortal  - the URI for the streaming API portal
	portal 			 - the URI for the OAuth-based API portal
	API_CALL_LEVEL 	 - log all API calls
	API_RETURN_LEVEL - log all API calls and completions
	API_BODY_LEVEL   - log calls and completions as well as the body of POST commands
	API_LOG_ALL 	 - the highest level of logging
	streamingColumns - an array of the available streaming columns

Most of the APIs take both an **options** parameter and an optional **callback** function.  The **options** parameter must always
contain a member called **authToken** that contains the OAuth token returned from a successfull **login()**.  For all APIs that 
act on a specific vehicle the **options** parameter must also contain a **vehicleID** member that contains the long vehicle ID value returned
from a successful call to **vehicles()**.

By default the **vehicles()** API returns information on the first vehicle returned.  By providing a **carIndex** member in the
**options** parameter information on a specific vehicle can be queried.
	
# Samples

Several samples are provided in the Examples directory.  These demonstrate some basic usage scenarios for 
the library.  To use the samples first:

    cd Examples
	
## login.js

This sample demonstrates the basic login process which returns the Auth token required for other API calls.  The sample
writes out a file called **.token** which stores the Auth token.  Other samples will use this token if present to avoid the need
to enter the **username** and **password**.  If you prefer not to have your Auth token stored locally you can run the samples and provide
the **username** and **password** on the command line.

Usage:

    node login.js <username> <password>

## logout.js

This sample deletes the **.token** file if present and signs the given account out on the server.

Usage:

    node logout.js <username> <password>

## climate_start.js

This sample demonstrates turning on the HVAC system of the vehicle.

Usage:

    node climate_start.js <username> <password>


## climate_state.js

This sample retrieves and displays data on the HVAC system of the vehicle.

Usage:

    node climate_state.js <username> <password>

## climate_stop.js

This sample demonstrates turning off the HVAC system of the vehicle.

Usage:

    node climate_stop.js <username> <password>

## flash_lights.js

This sample demonstrates flashing the headlights of the vehicle.

Usage:

    node flash_lights.js <username> <password>

## honk_horn.js

This sample demonstrates honking the horn of the vehicle.

Usage:

    node honk_horn.js <username> <password>

## odometer.js

This sample retrieves and displays the current vehicle odometer value.

Usage:

    node odometer.js <username> <password>

## soc.js

This sample retrieves and displays the charge limit, the current vehicle charge level, and the ideal, rated and projected range.

Usage:

    node soc.js <username> <password>

## start_charge.js

This sample demonstrates how to initiate a charging session.

Usage:

    node start_charge.js <username> <password>

## stop_charge.js

This sample demonstrates how to terminate a charging session.

Usage:

    node stop_charge.js <username> <password>

## vehicle_state.js

This sample retrives and displays several elements of data returned from the **vehicle_state** REST API. 

Usage:

    node vehicle_state.js <username> <password>

## valet.js

This sample enables or disables valet mode. 

Usage:

    node valet.js <username> <password> ON|OFF pincode
