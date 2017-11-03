# universal-logger

Used https://github.com/DxCx/ts-library-starter repository as a start point for the library

##Requirements

* Should be able to send single logs and bundles of them
* Should support different log sending strategies:
  1. interval
  2. on request
  3. mixed (interval + on request)
  4. on bundle size
  5. instant (received 1 log -> sent 1 log)
* Should be able to group duplicated logs in certain time interval**
* Should support different remote logger endpoints