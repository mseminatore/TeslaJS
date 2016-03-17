# TeslaJS
An unofficial Tesla API for NodeJS.

It is important to acknowledge that there are already several very good Javascript libraries available for the Tesla.  
I created this library for two main reasons:

* First, because I needed some small but important features that existing libraries did not provide
* And second, as a personal opportunity to learn more about the Tesla REST API, Node.js and Github

The REST API encapusulated by this library was documented through the work of many Tesla Model S owners.  The current
REST API documentation can be found at:

    http://docs.timdorr.apiary.io/
	
# Warranty Disclaimer

You may use this library with the understanding that doing so is **AT YOUR OWN RISK**.  No warranty, express or implied, 
is made with regards to the fitness or safety of this code for any purpose.  If you use this library to change settings 
on your car you understand that it is possible to make changes that could inadvertently lower the security of, or 
potentially damage, your vehicle through actions including but not limited to:

* unlocking the vehicle
* remotely starting the vehicle
* opening the sunroof
* opening the frunk or trunk
* affecting the battery charge level
* impacting the battery health of your vehicle

# Installation

In order to use the library and/or samples you must first download and install **Node.js** from http://nodejs.org

An installable module for 'npm' will be provided in the future.

# Samples

Several samples are provided in the Examples directory.  These demonstrate some basic usage scenarios for 
the library.  To use the samples first:

    cd Examples
	
## Login.js

This sample demonstrates the basic login process which returns the Auth token required for other API calls.

Usage:

    node login.js <username> <password>

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

This sample retrieves and displays the current vehicle charge level and rated miles.

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
