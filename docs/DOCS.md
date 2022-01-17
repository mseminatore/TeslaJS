## Members

<dl>
<dt><a href="#streamingPortal">streamingPortal</a></dt>
<dd></dd>
<dt><a href="#portal">portal</a></dt>
<dd></dd>
<dt><a href="#API_LOG_ALWAYS">API_LOG_ALWAYS</a></dt>
<dd></dd>
<dt><a href="#API_ERR_LEVEL">API_ERR_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_CALL_LEVEL">API_CALL_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_RETURN_LEVEL">API_RETURN_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_BODY_LEVEL">API_BODY_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_REQUEST_LEVEL">API_REQUEST_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_RESPONSE_LEVEL">API_RESPONSE_LEVEL</a></dt>
<dd></dd>
<dt><a href="#API_LOG_ALL">API_LOG_ALL</a></dt>
<dd></dd>
<dt><a href="#CHARGE_STORAGE">CHARGE_STORAGE</a></dt>
<dd></dd>
<dt><a href="#CHARGE_DAILY">CHARGE_DAILY</a></dt>
<dd></dd>
<dt><a href="#CHARGE_STANDARD">CHARGE_STANDARD</a></dt>
<dd></dd>
<dt><a href="#CHARGE_RANGE">CHARGE_RANGE</a></dt>
<dd></dd>
<dt><a href="#SUNROOF_VENT">SUNROOF_VENT</a></dt>
<dd></dd>
<dt><a href="#SUNROOF_CLOSED">SUNROOF_CLOSED</a></dt>
<dd></dd>
<dt><a href="#MIN_TEMP">MIN_TEMP</a></dt>
<dd></dd>
<dt><a href="#MAX_TEMP">MAX_TEMP</a></dt>
<dd></dd>
<dt><a href="#FRUNK">FRUNK</a></dt>
<dd></dd>
<dt><a href="#TRUNK">TRUNK</a></dt>
<dd></dd>
<dt><a href="#streamingColumns">streamingColumns</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#setLogLevel">setLogLevel(level)</a></dt>
<dd><p>Set the current logging level</p>
</dd>
<dt><a href="#getLogLevel">getLogLevel()</a> ⇒ <code>int</code></dt>
<dd><p>Get the current logging level</p>
</dd>
<dt><a href="#setPortalBaseURI">setPortalBaseURI(uri)</a></dt>
<dd><p>Set the portal base URI</p>
</dd>
<dt><a href="#getPortalBaseURI">getPortalBaseURI()</a> ⇒ <code>string</code></dt>
<dd><p>Get the portal base URI</p>
</dd>
<dt><a href="#setStreamingBaseURI">setStreamingBaseURI(uri)</a></dt>
<dd><p>Set the streaming base URI</p>
</dd>
<dt><a href="#getStreamingBaseURI">getStreamingBaseURI()</a> ⇒ <code>string</code></dt>
<dd><p>Get the streaming base URI</p>
</dd>
<dt><a href="#getModel">getModel(vehicle)</a> ⇒ <code>string</code></dt>
<dd><p>Return the car model from vehicle JSON information</p>
</dd>
<dt><a href="#vinDecode">vinDecode(vehicle)</a> ⇒ <code>object</code></dt>
<dd><p>Return an object containing properties decoded from the vehicle VIN</p>
</dd>
<dt><a href="#getPaintColor">getPaintColor(vehicle)</a> ⇒ <code>string</code></dt>
<dd><p>Return the paint color from vehicle JSON information</p>
</dd>
<dt><a href="#getVin">getVin(vehicle)</a> ⇒ <code>string</code></dt>
<dd><p>Return the vehicle VIN from vehicle JSON information</p>
</dd>
<dt><a href="#getShortVin">getShortVin(vehicle)</a> ⇒ <code>string</code></dt>
<dd><p>Return the vehicle VIN from vehicle JSON information</p>
</dd>
<dt><a href="#login">login(credentials, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Login to the server and receive OAuth tokens</p>
</dd>
<dt><a href="#loginAsync">loginAsync(credentials)</a> ⇒ <code>Promise</code></dt>
<dd><p>Login to the server and receive OAuth tokens</p>
</dd>
<dt><a href="#refreshToken">refreshToken(refresh_token, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Retrieve new OAuth and refresh tokens using a refresh_token</p>
</dd>
<dt><a href="#refreshTokenAsync">refreshTokenAsync(refresh_token)</a> ⇒ <code>Promise</code></dt>
<dd><p>Async call to retrieve new OAuth and refresh tokens using a refresh_token</p>
</dd>
<dt><a href="#logout">logout(authToken, callback)</a></dt>
<dd><p>Logout and invalidate the current auth token</p>
</dd>
<dt><a href="#logoutAsync">logoutAsync(authToken)</a> ⇒ <code>Promise</code></dt>
<dd><p>Logout and invalidate the current auth token</p>
</dd>
<dt><a href="#vehicle">vehicle(options, callback)</a> ⇒ <code>Vehicle</code></dt>
<dd><p>Return vehicle information on the requested vehicle</p>
</dd>
<dt><a href="#vehicleAsync">vehicleAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Return vehicle information on the requested vehicle</p>
</dd>
<dt><a href="#vehicleById">vehicleById(options, callback)</a> ⇒ <code>Vehicle</code></dt>
<dd><p>Return vehicle information on the requested vehicle. Uses options.vehicleID
to determine which vehicle to fetch data for.</p>
</dd>
<dt><a href="#vehicleByIdAsync">vehicleByIdAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Return vehicle information on the requested vehicle. Uses options.vehicleID
to determine which vehicle to fetch data for.</p>
</dd>
<dt><a href="#vehicles">vehicles(options, callback)</a> ⇒ <code>Array.&lt;Vehicles&gt;</code></dt>
<dd><p>Return vehicle information on ALL vehicles</p>
</dd>
<dt><a href="#vehiclesAsync">vehiclesAsync(options, callback)</a> ⇒ <code>Promise</code></dt>
<dd><p>Return vehicle information on ALL vehicles</p>
</dd>
<dt><a href="#get_command">get_command(options, command, callback)</a></dt>
<dd><p>Generic REST call for GET commands</p>
</dd>
<dt><a href="#get_commandAsync">get_commandAsync(options, command)</a> ⇒ <code>Promise</code></dt>
<dd><p>Generic Async REST call for GET commands</p>
</dd>
<dt><a href="#post_command">post_command(options, command, body, callback)</a></dt>
<dd><p>Generic REST call for POST commands</p>
</dd>
<dt><a href="#post_commandAsync">post_commandAsync(options, command, body)</a> ⇒ <code>Promise</code></dt>
<dd><p>Generic Async REST call for POST commands</p>
</dd>
<dt><a href="#vehicleData">vehicleData(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET all vehicle data in a single call</p>
</dd>
<dt><a href="#vehicleDataAsync">vehicleDataAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Async version to GET all vehicle data in a single call</p>
</dd>
<dt><a href="#vehicleConfig">vehicleConfig(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the vehicle config</p>
</dd>
<dt><a href="#vehicleConfigAsync">vehicleConfigAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Async version to GET the vehicle config</p>
</dd>
<dt><a href="#vehicleState">vehicleState(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the vehicle state</p>
</dd>
<dt><a href="#vehicleStateAsync">vehicleStateAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Async version to GET the vehicle state</p>
</dd>
<dt><a href="#climateState">climateState(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the climate state</p>
</dd>
<dt><a href="#climateStateAsync">climateStateAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>GET the climate state</p>
</dd>
<dt><a href="#nearbyChargers">nearbyChargers(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET nearby charging sites</p>
</dd>
<dt><a href="#nearbyChargersAsync">nearbyChargersAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#driveState">driveState(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the drive state</p>
</dd>
<dt><a href="#driveStateAsync">driveStateAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#chargeState">chargeState(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the charge state</p>
</dd>
<dt><a href="#chargeStateAsync">chargeStateAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#guiSettings">guiSettings(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the GUI settings</p>
</dd>
<dt><a href="#guiSettingsAsync">guiSettingsAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#mobileEnabled">mobileEnabled(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>GET the mobile enabled status</p>
</dd>
<dt><a href="#mobileEnabledAsync">mobileEnabledAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#honkHorn">honkHorn(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Honk the horn</p>
</dd>
<dt><a href="#honkHornAsync">honkHornAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#flashLights">flashLights(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Flash the lights</p>
</dd>
<dt><a href="#flashLightsAsync">flashLightsAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#startCharge">startCharge(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Start charging the car</p>
</dd>
<dt><a href="#startChargeAsync">startChargeAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Start charging the car</p>
</dd>
<dt><a href="#stopCharge">stopCharge(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Stop charging the car</p>
</dd>
<dt><a href="#stopChargeAsync">stopChargeAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Stop charging the car</p>
</dd>
<dt><a href="#openChargePort">openChargePort(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped</p>
</dd>
<dt><a href="#openChargePortAsync">openChargePortAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped</p>
</dd>
<dt><a href="#closeChargePort">closeChargePort(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Close the charge port for appropriately equipped vehicles</p>
</dd>
<dt><a href="#closeChargePortAsync">closeChargePortAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Close the charge port for appropriately equipped vehicles</p>
</dd>
<dt><a href="#scheduleSoftwareUpdate">scheduleSoftwareUpdate(options, offset)</a> ⇒ <code>object</code></dt>
<dd><p>Schedule a firmware update</p>
</dd>
<dt><a href="#scheduleSoftwareUpdateAsync">scheduleSoftwareUpdateAsync(options, offset)</a> ⇒ <code>Promise</code></dt>
<dd><p>Schedule a firmware update</p>
</dd>
<dt><a href="#cancelSoftwareUpdate">cancelSoftwareUpdate(options)</a> ⇒ <code>object</code></dt>
<dd><p>Cancel a scheduled software update</p>
</dd>
<dt><a href="#cancelSoftwareUpdateAsync">cancelSoftwareUpdateAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Cancel a scheduled software update</p>
</dd>
<dt><a href="#navigationRequest">navigationRequest(options, subject, text, locale)</a> ⇒ <code>object</code></dt>
<dd><p>Send a navigation request to the car</p>
</dd>
<dt><a href="#navigationRequestAsync">navigationRequestAsync(options, subject, text, locale)</a> ⇒ <code>Promise</code></dt>
<dd><p>Send a navigation request to the car</p>
</dd>
<dt><a href="#mediaTogglePlayback">mediaTogglePlayback(options)</a> ⇒ <code>object</code></dt>
<dd><p>Toggle media playback</p>
</dd>
<dt><a href="#mediaTogglePlaybackAsync">mediaTogglePlaybackAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Toggle media playback</p>
</dd>
<dt><a href="#mediaPlayNext">mediaPlayNext(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media play next track</p>
</dd>
<dt><a href="#mediaPlayNextAsync">mediaPlayNextAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media play next track</p>
</dd>
<dt><a href="#mediaPlayPrevious">mediaPlayPrevious(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media play previous track</p>
</dd>
<dt><a href="#mediaPlayPreviousAsync">mediaPlayPreviousAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media play previous track</p>
</dd>
<dt><a href="#mediaPlayNextFavorite">mediaPlayNextFavorite(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media play next favorite</p>
</dd>
<dt><a href="#mediaPlayNextFavoriteAsync">mediaPlayNextFavoriteAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media play next favorite</p>
</dd>
<dt><a href="#mediaPlayPreviousFavorite">mediaPlayPreviousFavorite(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media play previous favorite</p>
</dd>
<dt><a href="#mediaPlayPreviousFavoriteAsync">mediaPlayPreviousFavoriteAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media play previous favorite</p>
</dd>
<dt><a href="#mediaVolumeUp">mediaVolumeUp(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media volume up</p>
</dd>
<dt><a href="#mediaVolumeUpAsync">mediaVolumeUpAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media volume up</p>
</dd>
<dt><a href="#mediaVolumeDown">mediaVolumeDown(options)</a> ⇒ <code>object</code></dt>
<dd><p>Media volume down</p>
</dd>
<dt><a href="#mediaVolumeDownAsync">mediaVolumeDownAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Media volume down</p>
</dd>
<dt><a href="#speedLimitActivate">speedLimitActivate(options, pin)</a> ⇒ <code>object</code></dt>
<dd><p>Activate speed limitation</p>
</dd>
<dt><a href="#speedLimitActivateAsync">speedLimitActivateAsync(options, pin)</a> ⇒ <code>Promise</code></dt>
<dd><p>Activate speed limitation</p>
</dd>
<dt><a href="#speedLimitDeactivate">speedLimitDeactivate(options, pin)</a> ⇒ <code>object</code></dt>
<dd><p>Deactivate speed limitation</p>
</dd>
<dt><a href="#speedLimitDeactivateAsync">speedLimitDeactivateAsync(options, pin)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deactivate speed limitation</p>
</dd>
<dt><a href="#speedLimitClearPin">speedLimitClearPin(options, pin)</a> ⇒ <code>object</code></dt>
<dd><p>Clear speed limitation pin</p>
</dd>
<dt><a href="#speedLimitClearPinAsync">speedLimitClearPinAsync(options, pin)</a> ⇒ <code>Promise</code></dt>
<dd><p>Clear speed limitation pin</p>
</dd>
<dt><a href="#speedLimitSetLimit">speedLimitSetLimit(options, limit)</a> ⇒ <code>object</code></dt>
<dd><p>Set speed limit</p>
</dd>
<dt><a href="#speedLimitSetLimitAsync">speedLimitSetLimitAsync(options, limit)</a> ⇒ <code>Promise</code></dt>
<dd><p>Set speed limit</p>
</dd>
<dt><a href="#setSentryMode">setSentryMode(options, onoff)</a> ⇒ <code>object</code></dt>
<dd><p>Enable or disable sentry mode</p>
</dd>
<dt><a href="#setSentryModeAsync">setSentryModeAsync(onoff)</a> ⇒ <code>Promise</code></dt>
<dd><p>Enable or disable sentry mode</p>
</dd>
<dt><a href="#seatHeater">seatHeater(options, heater, level)</a> ⇒ <code>object</code></dt>
<dd><p>Remote seat heater</p>
</dd>
<dt><a href="#seatHeaterAsync">seatHeaterAsync(options, heater, level)</a> ⇒ <code>Promise</code></dt>
<dd><p>Remote seat heater</p>
</dd>
<dt><a href="#steeringHeater">steeringHeater(options, level)</a> ⇒ <code>object</code></dt>
<dd><p>Remote steering heater</p>
</dd>
<dt><a href="#seatHeaterAsync">seatHeaterAsync(options, level)</a> ⇒ <code>Promise</code></dt>
<dd><p>Remote steering heater</p>
</dd>
<dt><a href="#maxDefrost">maxDefrost(options, onoff)</a> ⇒ <code>object</code></dt>
<dd><p>Max Defrost</p>
</dd>
<dt><a href="#maxDefrostAsync">maxDefrostAsync(options, onoff)</a> ⇒ <code>Promise</code></dt>
<dd><p>Remote steering heater</p>
</dd>
<dt><a href="#windowControl">windowControl(options, command, lat, lon)</a> ⇒ <code>object</code></dt>
<dd><p>Window control</p>
</dd>
<dt><a href="#windowControlAsync">windowControlAsync(options, command, lat, lon)</a> ⇒ <code>Promise</code></dt>
<dd><p>Window control</p>
</dd>
<dt><a href="#setChargeLimit">setChargeLimit(options, amt, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the charge limit.
Note: charging to 100% frequently is NOT recommended for long-term battery health!</p>
</dd>
<dt><a href="#setChargeLimitAsync">setChargeLimitAsync(options, amt)</a> ⇒ <code>Promise</code></dt>
<dd><p>Set the charge limit async and return Promise.
Note: charging to 100% frequently is NOT recommended for long-term battery health!</p>
</dd>
<dt><a href="#chargeStandard">chargeStandard(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the charge limit to (standard) 90%</p>
</dd>
<dt><a href="#chargeStandardAsync">chargeStandardAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#chargeMaxRange">chargeMaxRange(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set charge limit to 100%</p>
</dd>
<dt><a href="#chargeMaxRangeAsync">chargeMaxRangeAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#setChargingAmps">setChargingAmps(options, amps, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the charging amps.</p>
</dd>
<dt><a href="#setChargingAmpsAsync">setChargingAmpsAsync(options, amps)</a> ⇒ <code>Promise</code></dt>
<dd><p>Set the charging amps async and return Promise.</p>
</dd>
<dt><a href="#setScheduledCharging">setScheduledCharging(options, enable, time, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the scheduled charging time.</p>
</dd>
<dt><a href="#setScheduledCharging">setScheduledCharging(options, enable, time)</a> ⇒ <code>Promise</code></dt>
<dd><p>Set the scheduled charging time async and return Promise.</p>
</dd>
<dt><a href="#setScheduledDeparture">setScheduledDeparture(options, enable, departure_time, preconditioning_enabled, preconditioning_weekdays_only, off_peak_charging_enabled, off_peak_charging_weekdays_only, end_off_peak_time, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the scheduled departure.</p>
</dd>
<dt><a href="#setScheduledDeparture">setScheduledDeparture(options, enable, departure_time, preconditioning_enabled, preconditioning_weekdays_only, off_peak_charging_enabled, off_peak_charging_weekdays_only, end_off_peak_time)</a> ⇒ <code>Promise</code></dt>
<dd><p>Set the scheduled departure async and return Promise.</p>
</dd>
<dt><a href="#doorLock">doorLock(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Lock the car doors</p>
</dd>
<dt><a href="#doorLockAsync">doorLockAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#doorUnlock">doorUnlock(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Unlock the car doors</p>
</dd>
<dt><a href="#doorUnlockAsync">doorUnlockAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#climateStart">climateStart(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Turn on HVAC system</p>
</dd>
<dt><a href="#climateStartAsync">climateStartAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#climateStop">climateStop(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Turn off HVAC system</p>
</dd>
<dt><a href="#climateStopAsync">climateStopAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#sunRoofControl">sunRoofControl(options, state, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set sun roof mode</p>
</dd>
<dt><a href="#sunRoofControlAsync">sunRoofControlAsync(options, state)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#sunRoofMove">sunRoofMove(options, percent, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set sun roof position</p>
</dd>
<dt><a href="#sunRoofMoveAsync">sunRoofMoveAsync(options, percent)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#setTemps">setTemps(options, driver, pass, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set the driver/passenger climate temperatures</p>
</dd>
<dt><a href="#setTempsAsync">setTempsAsync(options, driver, pass)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#remoteStart">remoteStart(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Remote start the car</p>
</dd>
<dt><a href="#remoteStartAsync">remoteStartAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#openTrunk">openTrunk(options, which, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Open the trunk/frunk</p>
</dd>
<dt><a href="#openTrunkAsync">openTrunkAsync(options, which)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#wakeUp">wakeUp(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Wake up a car that is sleeping</p>
</dd>
<dt><a href="#wakeUpAsync">wakeUpAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#setValetMode">setValetMode(options, onoff, pin, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Turn valet mode on/off</p>
</dd>
<dt><a href="#setValetModeAsync">setValetModeAsync(options, onoff, pin)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#resetValetPin">resetValetPin(options, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Reset the valet pin</p>
</dd>
<dt><a href="#resetValetPinAsync">resetValetPinAsync(options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#calendar">calendar(options, entry, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Set a calendar entry</p>
</dd>
<dt><a href="#calendarAsync">calendarAsync(options, entry)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#makeCalendarEntry">makeCalendarEntry(eventName, location, startTime, endTime, accountName, phoneName)</a> ⇒ <code>object</code></dt>
<dd><p>Create a calendar entry</p>
</dd>
<dt><a href="#homelink">homelink(options, lat, long, string, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Trigger homelink</p>
</dd>
<dt><a href="#homelinkAsync">homelinkAsync(options, lat, long, string)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#products">products(options, callback)</a> ⇒ <code><a href="#products">Array.&lt;products&gt;</a></code></dt>
<dd><p>Return list of products</p>
</dd>
<dt><a href="#productsAsync">productsAsync(options, callback)</a> ⇒ <code>Promise</code></dt>
<dd><p>Return list of products</p>
</dd>
<dt><a href="#solarStatus">solarStatus(options, callback)</a> ⇒ <code><a href="#solarStatus">solarStatus</a></code></dt>
<dd><p>Return live status from solar installation</p>
</dd>
<dt><a href="#solarStatusAsync">solarStatusAsync(options, callback)</a> ⇒ <code>Promise</code></dt>
<dd><p>Return solar status information</p>
</dd>
<dt><a href="#startStreaming">startStreaming(options, callback, onDataCb)</a> ⇒ <code>object</code></dt>
<dd><p>Start streaming car data</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#nodeBack">nodeBack</a> : <code>function</code></dt>
<dd><p>Node-style callback function</p>
</dd>
<dt><a href="#optionsType">optionsType</a> : <code>object</code></dt>
<dd><p>TeslaJS options parameter</p>
</dd>
</dl>

<a name="streamingPortal"></a>

## streamingPortal
**Kind**: global variable  
**Default**: <code>wss://streaming.vn.teslamotors.com/streaming/</code>  
<a name="portal"></a>

## portal
**Kind**: global variable  
**Default**: <code>https://owner-api.teslamotors.com</code>  
<a name="API_LOG_ALWAYS"></a>

## API\_LOG\_ALWAYS
**Kind**: global variable  
**Default**: <code>0</code>  
<a name="API_ERR_LEVEL"></a>

## API\_ERR\_LEVEL
**Kind**: global variable  
**Default**: <code>1</code>  
<a name="API_CALL_LEVEL"></a>

## API\_CALL\_LEVEL
**Kind**: global variable  
**Default**: <code>2</code>  
<a name="API_RETURN_LEVEL"></a>

## API\_RETURN\_LEVEL
**Kind**: global variable  
**Default**: <code>3</code>  
<a name="API_BODY_LEVEL"></a>

## API\_BODY\_LEVEL
**Kind**: global variable  
**Default**: <code>4</code>  
<a name="API_REQUEST_LEVEL"></a>

## API\_REQUEST\_LEVEL
**Kind**: global variable  
**Default**: <code>5</code>  
<a name="API_RESPONSE_LEVEL"></a>

## API\_RESPONSE\_LEVEL
**Kind**: global variable  
**Default**: <code>6</code>  
<a name="API_LOG_ALL"></a>

## API\_LOG\_ALL
**Kind**: global variable  
**Default**: <code>255</code>  
<a name="CHARGE_STORAGE"></a>

## CHARGE\_STORAGE
**Kind**: global variable  
**Default**: <code>50</code>  
<a name="CHARGE_DAILY"></a>

## CHARGE\_DAILY
**Kind**: global variable  
**Default**: <code>70</code>  
<a name="CHARGE_STANDARD"></a>

## CHARGE\_STANDARD
**Kind**: global variable  
**Default**: <code>90</code>  
<a name="CHARGE_RANGE"></a>

## CHARGE\_RANGE
**Kind**: global variable  
**Default**: <code>100</code>  
<a name="SUNROOF_VENT"></a>

## SUNROOF\_VENT
**Kind**: global variable  
**Default**: <code>vent</code>  
<a name="SUNROOF_CLOSED"></a>

## SUNROOF\_CLOSED
**Kind**: global variable  
**Default**: <code>close</code>  
<a name="MIN_TEMP"></a>

## MIN\_TEMP
**Kind**: global variable  
**Default**: <code>15</code>  
<a name="MAX_TEMP"></a>

## MAX\_TEMP
**Kind**: global variable  
**Default**: <code>28</code>  
<a name="FRUNK"></a>

## FRUNK
**Kind**: global variable  
**Default**: <code>front</code>  
<a name="TRUNK"></a>

## TRUNK
**Kind**: global variable  
**Default**: <code>rear</code>  
<a name="streamingColumns"></a>

## streamingColumns
**Kind**: global variable  
**Default**: <code>[&quot;elevation&quot;,&quot;est_heading&quot;,&quot;est_lat&quot;,&quot;est_lng&quot;,&quot;est_range&quot;,&quot;heading&quot;,&quot;odometer&quot;,&quot;power&quot;,&quot;range&quot;,&quot;shift_state&quot;,&quot;speed&quot;,&quot;soc&quot;]</code>  
<a name="setLogLevel"></a>

## setLogLevel(level)
Set the current logging level

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>int</code> | logging level |

<a name="getLogLevel"></a>

## getLogLevel() ⇒ <code>int</code>
Get the current logging level

**Kind**: global function  
**Returns**: <code>int</code> - the current logging level  
<a name="setPortalBaseURI"></a>

## setPortalBaseURI(uri)
Set the portal base URI

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | URI for Tesla servers |

<a name="getPortalBaseURI"></a>

## getPortalBaseURI() ⇒ <code>string</code>
Get the portal base URI

**Kind**: global function  
**Returns**: <code>string</code> - URI for Tesla servers  
<a name="setStreamingBaseURI"></a>

## setStreamingBaseURI(uri)
Set the streaming base URI

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | URI for Tesla streaming servers |

<a name="getStreamingBaseURI"></a>

## getStreamingBaseURI() ⇒ <code>string</code>
Get the streaming base URI

**Kind**: global function  
**Returns**: <code>string</code> - URI for Tesla streaming servers  
<a name="getModel"></a>

## getModel(vehicle) ⇒ <code>string</code>
Return the car model from vehicle JSON information

**Kind**: global function  
**Returns**: <code>string</code> - vehicle model string  

| Param | Type | Description |
| --- | --- | --- |
| vehicle | <code>object</code> | vehicle JSON |

<a name="vinDecode"></a>

## vinDecode(vehicle) ⇒ <code>object</code>
Return an object containing properties decoded from the vehicle VIN

**Kind**: global function  
**Returns**: <code>object</code> - vehicle properties  

| Param | Type | Description |
| --- | --- | --- |
| vehicle | <code>object</code> | vehicle JSON |

<a name="getPaintColor"></a>

## getPaintColor(vehicle) ⇒ <code>string</code>
Return the paint color from vehicle JSON information

**Kind**: global function  
**Returns**: <code>string</code> - the vehicle paint color  

| Param | Type | Description |
| --- | --- | --- |
| vehicle | <code>object</code> | vehicle JSON |

<a name="getVin"></a>

## getVin(vehicle) ⇒ <code>string</code>
Return the vehicle VIN from vehicle JSON information

**Kind**: global function  
**Returns**: <code>string</code> - the vehicle VIN  

| Param | Type | Description |
| --- | --- | --- |
| vehicle | <code>object</code> | vehicle JSON |

<a name="getShortVin"></a>

## getShortVin(vehicle) ⇒ <code>string</code>
Return the vehicle VIN from vehicle JSON information

**Kind**: global function  
**Returns**: <code>string</code> - the short version of the vehicle VIN  

| Param | Type | Description |
| --- | --- | --- |
| vehicle | <code>object</code> | vehicle JSON |

<a name="login"></a>

## login(credentials, callback) ⇒ <code>object</code>
Login to the server and receive OAuth tokens

**Kind**: global function  
**Returns**: <code>object</code> - {response, body, authToken, refreshToken}  

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>Object</code> | object of Tesla credentials |
| credentials.username | <code>string</code> | email address used on Tesla.com |
| credentials.password | <code>string</code> | password used on Tesla.command |
| credentials.mfaPassCode | <code>string</code> | MFA password |
| credentials.mfaDeviceName | <code>string</code> | MFA device name |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="loginAsync"></a>

## loginAsync(credentials) ⇒ <code>Promise</code>
Login to the server and receive OAuth tokens

**Kind**: global function  
**Returns**: <code>Promise</code> - {response, body, authToken, refreshToken}  

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>Object</code> | object of Tesla credentials |
| credentials.username | <code>string</code> | email address used on Tesla.com |
| credentials.password | <code>string</code> | password used on Tesla.command |
| credentials.mfaPassCode | <code>string</code> | MFA password |
| credentials.mfaDeviceName | <code>string</code> | MFA device name |

<a name="refreshToken"></a>

## refreshToken(refresh_token, callback) ⇒ <code>object</code>
Retrieve new OAuth and refresh tokens using a refresh_token

**Kind**: global function  
**Returns**: <code>object</code> - {response, body, authToken, refreshToken}  

| Param | Type | Description |
| --- | --- | --- |
| refresh_token | <code>string</code> | a valid OAuth refresh_token from a previous login |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="refreshTokenAsync"></a>

## refreshTokenAsync(refresh_token) ⇒ <code>Promise</code>
Async call to retrieve new OAuth and refresh tokens using a refresh_token

**Kind**: global function  
**Returns**: <code>Promise</code> - {response, body, authToken, refreshToken}  

| Param | Type | Description |
| --- | --- | --- |
| refresh_token | <code>string</code> | a valid OAuth refresh_token from a previous login |

<a name="logout"></a>

## logout(authToken, callback)
Logout and invalidate the current auth token

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| authToken | <code>string</code> | Tesla provided OAuth token |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="logoutAsync"></a>

## logoutAsync(authToken) ⇒ <code>Promise</code>
Logout and invalidate the current auth token

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| authToken | <code>string</code> | Tesla provided OAuth token |

<a name="vehicle"></a>

## vehicle(options, callback) ⇒ <code>Vehicle</code>
Return vehicle information on the requested vehicle

**Kind**: global function  
**Returns**: <code>Vehicle</code> - vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehicleAsync"></a>

## vehicleAsync(options) ⇒ <code>Promise</code>
Return vehicle information on the requested vehicle

**Kind**: global function  
**Returns**: <code>Promise</code> - vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="vehicleById"></a>

## vehicleById(options, callback) ⇒ <code>Vehicle</code>
Return vehicle information on the requested vehicle. Uses options.vehicleIDto determine which vehicle to fetch data for.

**Kind**: global function  
**Returns**: <code>Vehicle</code> - vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehicleByIdAsync"></a>

## vehicleByIdAsync(options) ⇒ <code>Promise</code>
Return vehicle information on the requested vehicle. Uses options.vehicleIDto determine which vehicle to fetch data for.

**Kind**: global function  
**Returns**: <code>Promise</code> - vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="vehicles"></a>

## vehicles(options, callback) ⇒ <code>Array.&lt;Vehicles&gt;</code>
Return vehicle information on ALL vehicles

**Kind**: global function  
**Returns**: <code>Array.&lt;Vehicles&gt;</code> - array of vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehiclesAsync"></a>

## vehiclesAsync(options, callback) ⇒ <code>Promise</code>
Return vehicle information on ALL vehicles

**Kind**: global function  
**Returns**: <code>Promise</code> - array of vehicle JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="get_command"></a>

## get\_command(options, command, callback)
Generic REST call for GET commands

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | REST command |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="get_commandAsync"></a>

## get\_commandAsync(options, command) ⇒ <code>Promise</code>
Generic Async REST call for GET commands

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | REST command |

<a name="post_command"></a>

## post\_command(options, command, body, callback)
Generic REST call for POST commands

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | REST command |
| body | <code>object</code> | JSON payload |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="post_commandAsync"></a>

## post\_commandAsync(options, command, body) ⇒ <code>Promise</code>
Generic Async REST call for POST commands

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | REST command |
| body | <code>object</code> | JSON payload |

<a name="vehicleData"></a>

## vehicleData(options, callback) ⇒ <code>object</code>
GET all vehicle data in a single call

**Kind**: global function  
**Returns**: <code>object</code> - vehicle_data object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehicleDataAsync"></a>

## vehicleDataAsync(options) ⇒ <code>Promise</code>
Async version to GET all vehicle data in a single call

**Kind**: global function  
**Returns**: <code>Promise</code> - vehicle_data object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="vehicleConfig"></a>

## vehicleConfig(options, callback) ⇒ <code>object</code>
GET the vehicle config

**Kind**: global function  
**Returns**: <code>object</code> - vehicle_config object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehicleConfigAsync"></a>

## vehicleConfigAsync(options) ⇒ <code>Promise</code>
Async version to GET the vehicle config

**Kind**: global function  
**Returns**: <code>Promise</code> - vehicle_config object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="vehicleState"></a>

## vehicleState(options, callback) ⇒ <code>object</code>
GET the vehicle state

**Kind**: global function  
**Returns**: <code>object</code> - vehicle_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="vehicleStateAsync"></a>

## vehicleStateAsync(options) ⇒ <code>Promise</code>
Async version to GET the vehicle state

**Kind**: global function  
**Returns**: <code>Promise</code> - vehicle_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="climateState"></a>

## climateState(options, callback) ⇒ <code>object</code>
GET the climate state

**Kind**: global function  
**Returns**: <code>object</code> - climate_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="climateStateAsync"></a>

## climateStateAsync(options) ⇒ <code>Promise</code>
GET the climate state

**Kind**: global function  
**Returns**: <code>Promise</code> - climate_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="nearbyChargers"></a>

## nearbyChargers(options, callback) ⇒ <code>object</code>
GET nearby charging sites

**Kind**: global function  
**Returns**: <code>object</code> - climate_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="nearbyChargersAsync"></a>

## nearbyChargersAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - climate_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="driveState"></a>

## driveState(options, callback) ⇒ <code>object</code>
GET the drive state

**Kind**: global function  
**Returns**: <code>object</code> - drive_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="driveStateAsync"></a>

## driveStateAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - drive_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="chargeState"></a>

## chargeState(options, callback) ⇒ <code>object</code>
GET the charge state

**Kind**: global function  
**Returns**: <code>object</code> - charge_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="chargeStateAsync"></a>

## chargeStateAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - charge_state object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="guiSettings"></a>

## guiSettings(options, callback) ⇒ <code>object</code>
GET the GUI settings

**Kind**: global function  
**Returns**: <code>object</code> - gui_settings object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="guiSettingsAsync"></a>

## guiSettingsAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - gui_settings object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mobileEnabled"></a>

## mobileEnabled(options, callback) ⇒ <code>object</code>
GET the mobile enabled status

**Kind**: global function  
**Returns**: <code>object</code> - mobile_enabled object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="mobileEnabledAsync"></a>

## mobileEnabledAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - mobile_enabled object  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="honkHorn"></a>

## honkHorn(options, callback) ⇒ <code>object</code>
Honk the horn

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="honkHornAsync"></a>

## honkHornAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="flashLights"></a>

## flashLights(options, callback) ⇒ <code>object</code>
Flash the lights

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="flashLightsAsync"></a>

## flashLightsAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="startCharge"></a>

## startCharge(options, callback) ⇒ <code>object</code>
Start charging the car

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="startChargeAsync"></a>

## startChargeAsync(options) ⇒ <code>Promise</code>
Start charging the car

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="stopCharge"></a>

## stopCharge(options, callback) ⇒ <code>object</code>
Stop charging the car

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="stopChargeAsync"></a>

## stopChargeAsync(options) ⇒ <code>Promise</code>
Stop charging the car

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="openChargePort"></a>

## openChargePort(options, callback) ⇒ <code>object</code>
Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="openChargePortAsync"></a>

## openChargePortAsync(options) ⇒ <code>Promise</code>
Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="closeChargePort"></a>

## closeChargePort(options, callback) ⇒ <code>object</code>
Close the charge port for appropriately equipped vehicles

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="closeChargePortAsync"></a>

## closeChargePortAsync(options) ⇒ <code>Promise</code>
Close the charge port for appropriately equipped vehicles

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="scheduleSoftwareUpdate"></a>

## scheduleSoftwareUpdate(options, offset) ⇒ <code>object</code>
Schedule a firmware update

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| offset | <code>number</code> | delay in ms before installation begins |

<a name="scheduleSoftwareUpdateAsync"></a>

## scheduleSoftwareUpdateAsync(options, offset) ⇒ <code>Promise</code>
Schedule a firmware update

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| offset | <code>number</code> | delay in ms before installation begins |

<a name="cancelSoftwareUpdate"></a>

## cancelSoftwareUpdate(options) ⇒ <code>object</code>
Cancel a scheduled software update

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="cancelSoftwareUpdateAsync"></a>

## cancelSoftwareUpdateAsync(options) ⇒ <code>Promise</code>
Cancel a scheduled software update

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="navigationRequest"></a>

## navigationRequest(options, subject, text, locale) ⇒ <code>object</code>
Send a navigation request to the car

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| subject | <code>string</code> | short-hand name for the destination |
| text | <code>string</code> | address details including things like name, address, map link |
| locale | <code>string</code> | the language locale, for example "en-US" |

<a name="navigationRequestAsync"></a>

## navigationRequestAsync(options, subject, text, locale) ⇒ <code>Promise</code>
Send a navigation request to the car

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| subject | <code>string</code> | short-hand name for the destination |
| text | <code>string</code> | address details including things like name, address, map link |
| locale | <code>string</code> | the language locale, for example "en-US" |

<a name="mediaTogglePlayback"></a>

## mediaTogglePlayback(options) ⇒ <code>object</code>
Toggle media playback

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaTogglePlaybackAsync"></a>

## mediaTogglePlaybackAsync(options) ⇒ <code>Promise</code>
Toggle media playback

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayNext"></a>

## mediaPlayNext(options) ⇒ <code>object</code>
Media play next track

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayNextAsync"></a>

## mediaPlayNextAsync(options) ⇒ <code>Promise</code>
Media play next track

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayPrevious"></a>

## mediaPlayPrevious(options) ⇒ <code>object</code>
Media play previous track

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayPreviousAsync"></a>

## mediaPlayPreviousAsync(options) ⇒ <code>Promise</code>
Media play previous track

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayNextFavorite"></a>

## mediaPlayNextFavorite(options) ⇒ <code>object</code>
Media play next favorite

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayNextFavoriteAsync"></a>

## mediaPlayNextFavoriteAsync(options) ⇒ <code>Promise</code>
Media play next favorite

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayPreviousFavorite"></a>

## mediaPlayPreviousFavorite(options) ⇒ <code>object</code>
Media play previous favorite

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaPlayPreviousFavoriteAsync"></a>

## mediaPlayPreviousFavoriteAsync(options) ⇒ <code>Promise</code>
Media play previous favorite

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaVolumeUp"></a>

## mediaVolumeUp(options) ⇒ <code>object</code>
Media volume up

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaVolumeUpAsync"></a>

## mediaVolumeUpAsync(options) ⇒ <code>Promise</code>
Media volume up

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaVolumeDown"></a>

## mediaVolumeDown(options) ⇒ <code>object</code>
Media volume down

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="mediaVolumeDownAsync"></a>

## mediaVolumeDownAsync(options) ⇒ <code>Promise</code>
Media volume down

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="speedLimitActivate"></a>

## speedLimitActivate(options, pin) ⇒ <code>object</code>
Activate speed limitation

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitActivateAsync"></a>

## speedLimitActivateAsync(options, pin) ⇒ <code>Promise</code>
Activate speed limitation

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitDeactivate"></a>

## speedLimitDeactivate(options, pin) ⇒ <code>object</code>
Deactivate speed limitation

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitDeactivateAsync"></a>

## speedLimitDeactivateAsync(options, pin) ⇒ <code>Promise</code>
Deactivate speed limitation

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitClearPin"></a>

## speedLimitClearPin(options, pin) ⇒ <code>object</code>
Clear speed limitation pin

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitClearPinAsync"></a>

## speedLimitClearPinAsync(options, pin) ⇒ <code>Promise</code>
Clear speed limitation pin

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| pin | <code>number</code> | Activation pin code. Not the same as valet pin |

<a name="speedLimitSetLimit"></a>

## speedLimitSetLimit(options, limit) ⇒ <code>object</code>
Set speed limit

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| limit | <code>number</code> | Speed limit in mph |

<a name="speedLimitSetLimitAsync"></a>

## speedLimitSetLimitAsync(options, limit) ⇒ <code>Promise</code>
Set speed limit

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| limit | <code>number</code> | Speed limit in mph |

<a name="setSentryMode"></a>

## setSentryMode(options, onoff) ⇒ <code>object</code>
Enable or disable sentry mode

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| onoff | <code>boolean</code> | true to turn on sentry mode, false to turn off |

<a name="setSentryModeAsync"></a>

## setSentryModeAsync(onoff) ⇒ <code>Promise</code>
Enable or disable sentry mode

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| onoff | <code>boolean</code> | true to turn on sentry mode, false to turn off |

<a name="seatHeater"></a>

## seatHeater(options, heater, level) ⇒ <code>object</code>
Remote seat heater

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| heater | <code>number</code> | Which heater to adjust (0-5) |
| level | <code>number</code> | Level for the heater (0-3) |

<a name="seatHeaterAsync"></a>

## seatHeaterAsync(options, heater, level) ⇒ <code>Promise</code>
Remote seat heater

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| heater | <code>number</code> | Which heater to adjust (0-5) |
| level | <code>number</code> | Level for the heater (0-3) |

<a name="steeringHeater"></a>

## steeringHeater(options, level) ⇒ <code>object</code>
Remote steering heater

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| level | <code>number</code> | Level for the heater (0-3) |

<a name="seatHeaterAsync"></a>

## seatHeaterAsync(options, level) ⇒ <code>Promise</code>
Remote steering heater

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| level | <code>number</code> | Level for the heater (0-3) |

<a name="maxDefrost"></a>

## maxDefrost(options, onoff) ⇒ <code>object</code>
Max Defrost

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| onoff | <code>boolean</code> | true for on, false for off |

<a name="maxDefrostAsync"></a>

## maxDefrostAsync(options, onoff) ⇒ <code>Promise</code>
Remote steering heater

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| onoff | <code>boolean</code> | true for on, false for off |

<a name="windowControl"></a>

## windowControl(options, command, lat, lon) ⇒ <code>object</code>
Window control

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | Allowable values are 'vent' and 'close' |
| lat | <code>number</code> | User latitude (can be 0 if not 'close' command) |
| lon | <code>number</code> | User longitude (can be 0 if not 'close' command) |

<a name="windowControlAsync"></a>

## windowControlAsync(options, command, lat, lon) ⇒ <code>Promise</code>
Window control

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| command | <code>string</code> | Allowable values are 'vent' and 'close' |
| lat | <code>number</code> | User latitude (can be 0 if not 'close' command) |
| lon | <code>number</code> | User longitude (can be 0 if not 'close' command) |

<a name="setChargeLimit"></a>

## setChargeLimit(options, amt, callback) ⇒ <code>object</code>
Set the charge limit.Note: charging to 100% frequently is NOT recommended for long-term battery health!

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| amt | <code>int</code> | charge limit in percent |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setChargeLimitAsync"></a>

## setChargeLimitAsync(options, amt) ⇒ <code>Promise</code>
Set the charge limit async and return Promise.Note: charging to 100% frequently is NOT recommended for long-term battery health!

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| amt | <code>int</code> | charge limit in percent |

<a name="chargeStandard"></a>

## chargeStandard(options, callback) ⇒ <code>object</code>
Set the charge limit to (standard) 90%

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="chargeStandardAsync"></a>

## chargeStandardAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="chargeMaxRange"></a>

## chargeMaxRange(options, callback) ⇒ <code>object</code>
Set charge limit to 100%

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="chargeMaxRangeAsync"></a>

## chargeMaxRangeAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="setChargingAmps"></a>

## setChargingAmps(options, amps, callback) ⇒ <code>object</code>
Set the charging amps.

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| amps | <code>int</code> | charging amps |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setChargingAmpsAsync"></a>

## setChargingAmpsAsync(options, amps) ⇒ <code>Promise</code>
Set the charging amps async and return Promise.

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| amps | <code>int</code> | charging amps |

<a name="setScheduledCharging"></a>

## setScheduledCharging(options, enable, time, callback) ⇒ <code>object</code>
Set the scheduled charging time.

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| enable | <code>boolean</code> | true for on, false for off |
| time | <code>int</code> | time in minutes since midnight, 15min step |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setScheduledCharging"></a>

## setScheduledCharging(options, enable, time) ⇒ <code>Promise</code>
Set the scheduled charging time async and return Promise.

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| enable | <code>boolean</code> | true for on, false for off |
| time | <code>int</code> | time in minutes since midnight, 15min step |

<a name="setScheduledDeparture"></a>

## setScheduledDeparture(options, enable, departure_time, preconditioning_enabled, preconditioning_weekdays_only, off_peak_charging_enabled, off_peak_charging_weekdays_only, end_off_peak_time, callback) ⇒ <code>object</code>
Set the scheduled departure.

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| enable | <code>boolean</code> | true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future) |
| departure_time | <code>int</code> | time in minutes since midnight, 15min step |
| preconditioning_enabled | <code>boolean</code> | true for on, false for off |
| preconditioning_weekdays_only | <code>boolean</code> | true for on, false for off |
| off_peak_charging_enabled | <code>boolean</code> | true for on, false for off |
| off_peak_charging_weekdays_only | <code>boolean</code> | true for on, false for off |
| end_off_peak_time | <code>int</code> | time in minutes since midnight, 15min step |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setScheduledDeparture"></a>

## setScheduledDeparture(options, enable, departure_time, preconditioning_enabled, preconditioning_weekdays_only, off_peak_charging_enabled, off_peak_charging_weekdays_only, end_off_peak_time) ⇒ <code>Promise</code>
Set the scheduled departure async and return Promise.

**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| enable | <code>boolean</code> | true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future) |
| departure_time | <code>int</code> | time in minutes since midnight, 15min step |
| preconditioning_enabled | <code>boolean</code> | true for on, false for off |
| preconditioning_weekdays_only | <code>boolean</code> | true for on, false for off |
| off_peak_charging_enabled | <code>boolean</code> | true for on, false for off |
| off_peak_charging_weekdays_only | <code>boolean</code> | true for on, false for off |
| end_off_peak_time | <code>int</code> | time in minutes since midnight, 15min step |

<a name="doorLock"></a>

## doorLock(options, callback) ⇒ <code>object</code>
Lock the car doors

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="doorLockAsync"></a>

## doorLockAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="doorUnlock"></a>

## doorUnlock(options, callback) ⇒ <code>object</code>
Unlock the car doors

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="doorUnlockAsync"></a>

## doorUnlockAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="climateStart"></a>

## climateStart(options, callback) ⇒ <code>object</code>
Turn on HVAC system

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="climateStartAsync"></a>

## climateStartAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="climateStop"></a>

## climateStop(options, callback) ⇒ <code>object</code>
Turn off HVAC system

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="climateStopAsync"></a>

## climateStopAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="sunRoofControl"></a>

## sunRoofControl(options, state, callback) ⇒ <code>object</code>
Set sun roof mode

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| state | <code>string</code> | one of "vent", "close" |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="sunRoofControlAsync"></a>

## sunRoofControlAsync(options, state) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| state | <code>string</code> | one of "vent", "close" |

<a name="sunRoofMove"></a>

## sunRoofMove(options, percent, callback) ⇒ <code>object</code>
Set sun roof position

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| percent | <code>int</code> | position in percent |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="sunRoofMoveAsync"></a>

## sunRoofMoveAsync(options, percent) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| percent | <code>int</code> | position in percent |

<a name="setTemps"></a>

## setTemps(options, driver, pass, callback) ⇒ <code>object</code>
Set the driver/passenger climate temperatures

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| driver | <code>number</code> | driver temp in Deg.C |
| pass | <code>number</code> | passenger temp in Deg.C |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setTempsAsync"></a>

## setTempsAsync(options, driver, pass) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| driver | <code>number</code> | driver temp in Deg.C |
| pass | <code>number</code> | passenger temp in Deg.C |

<a name="remoteStart"></a>

## remoteStart(options, callback) ⇒ <code>object</code>
Remote start the car

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="remoteStartAsync"></a>

## remoteStartAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="openTrunk"></a>

## openTrunk(options, which, callback) ⇒ <code>object</code>
Open the trunk/frunk

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| which | <code>string</code> | FRUNK or TRUNK constant |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="openTrunkAsync"></a>

## openTrunkAsync(options, which) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| which | <code>string</code> | one of "trunk", "frunk" |

<a name="wakeUp"></a>

## wakeUp(options, callback) ⇒ <code>object</code>
Wake up a car that is sleeping

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="wakeUpAsync"></a>

## wakeUpAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="setValetMode"></a>

## setValetMode(options, onoff, pin, callback) ⇒ <code>object</code>
Turn valet mode on/off

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| onoff | <code>boolean</code> | true for on, false for off |
| pin | <code>int</code> | pin code |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="setValetModeAsync"></a>

## setValetModeAsync(options, onoff, pin) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| onoff | <code>boolean</code> | true for on, false for off |
| pin | <code>int</code> | pin code |

<a name="resetValetPin"></a>

## resetValetPin(options, callback) ⇒ <code>object</code>
Reset the valet pin

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="resetValetPinAsync"></a>

## resetValetPinAsync(options) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |

<a name="calendar"></a>

## calendar(options, entry, callback) ⇒ <code>object</code>
Set a calendar entry

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| entry | <code>object</code> | calendar entry object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="calendarAsync"></a>

## calendarAsync(options, entry) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| entry | <code>object</code> | calendar entry object |

<a name="makeCalendarEntry"></a>

## makeCalendarEntry(eventName, location, startTime, endTime, accountName, phoneName) ⇒ <code>object</code>
Create a calendar entry

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of the event |
| location | <code>string</code> | location of the event |
| startTime | <code>number</code> | Javascript timestamp for start of event |
| endTime | <code>number</code> | Javascript timestamp for end of event |
| accountName | <code>string</code> | name of the calendar account |
| phoneName | <code>string</code> | phone bluetooth name |

<a name="homelink"></a>

## homelink(options, lat, long, string, callback) ⇒ <code>object</code>
Trigger homelink

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| lat | <code>number</code> | vehicle GPS latitude |
| long | <code>number</code> | vehicle GPS longitude |
| string | <code>string</code> | one of the tokens from vehicle JSON |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="homelinkAsync"></a>

## homelinkAsync(options, lat, long, string) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| lat | <code>number</code> | vehicle GPS latitude |
| long | <code>number</code> | vehicle GPS longitude |
| string | <code>string</code> | one of the tokens from vehicle JSON |

<a name="products"></a>

## products(options, callback) ⇒ [<code>Array.&lt;products&gt;</code>](#products)
Return list of products

**Kind**: global function  
**Returns**: [<code>Array.&lt;products&gt;</code>](#products) - array of products JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="productsAsync"></a>

## productsAsync(options, callback) ⇒ <code>Promise</code>
Return list of products

**Kind**: global function  
**Returns**: <code>Promise</code> - array of products JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="solarStatus"></a>

## solarStatus(options, callback) ⇒ [<code>solarStatus</code>](#solarStatus)
Return live status from solar installation

**Kind**: global function  
**Returns**: [<code>solarStatus</code>](#solarStatus) - solarStatus JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="solarStatusAsync"></a>

## solarStatusAsync(options, callback) ⇒ <code>Promise</code>
Return solar status information

**Kind**: global function  
**Returns**: <code>Promise</code> - solar JSON data  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>optionsType</code>](#optionsType) | options object |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="startStreaming"></a>

## startStreaming(options, callback, onDataCb) ⇒ <code>object</code>
Start streaming car data

**Kind**: global function  
**Returns**: <code>object</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | {username, token, vehicle_id, columns[]} |
| callback | [<code>nodeBack</code>](#nodeBack) | Node-style callback |
| onDataCb | [<code>nodeBack</code>](#nodeBack) | Node-style callback |

<a name="nodeBack"></a>

## nodeBack : <code>function</code>
Node-style callback function

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>function</code> | function which receives the error result |
| data | <code>function</code> | function which receives the data result |

<a name="optionsType"></a>

## optionsType : <code>object</code>
TeslaJS options parameter

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authToken | <code>string</code> | Tesla provided OAuth token |
| vehicleID | <code>string</code> | Tesla provided long vehicle id |
| [carIndex] | <code>int</code> | index of vehicle within vehicles JSON |

