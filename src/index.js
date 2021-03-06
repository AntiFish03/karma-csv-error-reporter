var fs = require('fs');

var CSVReporter = function (baseReporterDecorator, config, logger, formatError) {
  var reporter = this;
  reporter.log = logger.create('reporter.csvReporter');
  reporter.defaults = {
    csvReporter: {
      output: 'tmp/failures.csv'
    }
  };
  reporter.formatError = formatError;

  reporter.config = Object.assign({}, reporter.defaults, config);
  baseReporterDecorator(reporter);

  reporter.specFailure = function (browser, result) {
    result.log.forEach(function (log) {
      let formattedMessage = reporter.formatError(log).split('\n'),
        message = formattedMessage[0],
        path = formattedMessage.length > 2 ? formattedMessage[2].match(/(webpack:.+?)\s/)[1].replace(/\(\)/, '') : '';

      reporter.writeToCSV(
        process.env.BUILD_NUMBER,
        'Karma',
        `${result.suite.join(' ')} ${result.description}`,
        path,
        null,
        message
      );
    });
  };

  reporter.onBrowserFailure = function (browser, error) {
    reporter.writeToCSV(
      process.env.BUILD_NUMBER,
      'Karma',
      null,
      null,
      `${browser.fullName} has encountered an error.`,
      reporter.formatError(error, ' ')
    );
  };

  reporter.writeToCSV = function (buildNumber, runner, scenario, path, exceptionName, message) {
    fs.open(reporter.config.csvReporter.output, 'a+', function (err, fd) {
      if (err) {
        reporter.log.warn('An issue occurred while writing to' + reporter.config.output + ':\n\t' + err);
        return;
      }

      if (fs.fstatSync(fd).size == 0) {
        fs.writeSync(
          fd,
          'BUILD_NUMBER, runner, scenario, path, exception name, message\n'
        );
      }

      fs.writeSync(
        fd,
        `"${buildNumber}", "${runner}", "${scenario}", "${path}", "${exceptionName}","${message}"\n`
      );

      fs.close(fd);
    });
  };
};

CSVReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'formatError'];

module.exports = {
  'reporter:csvReporter': ['type', CSVReporter]
};
