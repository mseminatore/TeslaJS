# TeslaJS
An unofficial Tesla API for NodeJS.

It is important to acknowledge that there are already several very good Javascript libraries available for the Tesla.  
I created this library for two main reasons:

1. The anticipated need for a few small but important features that existing libraries did not provide
2. I was looking for a personal opportunity to learn more about the Tesla REST API, Node.js and Github

With the introduction of the new OAuth-based owner API, one of the features I wanted was the ability to make API calls
without having to login each time.  This is important if you want to use the library to do server-based data logging.  It
is safer to store an auth token on the server than logon credentials.  Another feature that I wanted was stateless-ness 
(via the **options** parameter) so that it was possible to use the library to make overlapping async calls for different vehicles.

# API Documentation

The REST API encapusulated by this library was documented through the work of many Tesla Model S owners.  The current
REST API documentation can be found at:

    http://docs.timdorr.apiary.io/
	
# Warranty Disclaimer

You may use this library with the understanding that doing so is **AT YOUR OWN RISK**.  No warranty, express or implied, 
is made with regards to the fitness or safety of this code for any purpose.  If you use this library to change settings 
on your car you understand that it is possible to make changes that could inadvertently lower the security of, or 
potentially damage, your vehicle through actions including but not limited to:

* Unlocking the vehicle
* Remotely starting the vehicle
* Opening the sunroof
* Opening the frunk or trunk
* Lowering the battery charge level
* Impacting the health of your battery

# Installation

In order to use the library and/or samples you must first download and install **Node.js** from http://nodejs.org

An installable module for 'npm' will be provided in the future.

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
