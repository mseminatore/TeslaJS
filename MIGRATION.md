# TeslaJS Migration Buid

## V3.x to V4.x

Unfortunately we learned recently that npm does not respect case-sensitive file systems.
As a result on Mac and Linux if you:

    npm install teslajs

as the library documentation suggests, npm will install the library under node_modules 
into a directory called `teslajs`.  This will break calls to `require("TeslaJS")`. 
However, if you instead:

    npm install TeslaJS

npm will install the library under node_modules into a directory called `TeslaJS`.
This will work correctly with `require("TelsaJS")`.  It seems the right solution is
to attempt to remove case issues from the equation.

Unfortunately the rules of `semver` say this is a breaking change, thus the bump
from 3.x to 4.x.  So the **big** change from 3.x to 4.x is simply to update all `require` 
statements to use all lower-case as in:

    npm install teslajs
    ...
    require('teslajs');

Since I was removing case from the equation I also renamed the `Examples` dir to
be `samples` instead.

Apologies for the churn!

## V2.x to V3.x

The primary breaking change in V3.x compared to 2.x is the API renaming change of
`allVehicles()` to `vehicles()` and `vehicles()` to `vehicle()`.