# Karma CSV Error Reporter

This reporter is intended to keep a log of errors across test runs. It will append a new row to the CSV for each error encountered, it should handle both spec failures and browser errors like `PhantomJS has crashed`. by default it writes to 'tmp/failures.csv'.  This behavior can be modified by adding 
``` javascript
module.exports = function (config) {
  config.set({
    csvReporter: {
      output: 'path/to/failures.csv'
    },
    ...
  })
};
```
