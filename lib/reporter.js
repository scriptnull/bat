'use strict';

var async = require('async'),
    nconf = require('nconf'),
    fs = require('fs'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'reporter' }),
    GithubApi = require('github');

nconf.argv().env();

var github = new GithubApi({
      version: '3.0.0',
      debug: nconf.get('debug') || false,
      protocol: 'https',
      headers: {
        'user-agent': 'Shippable FT Issue Reporter v1.0'
      }
    });

var mochaJsonReportFileName = process.argv[2],
    githubUser = nconf.get('githubUser'),
    githubRepo = nconf.get('githubRepo'),
    githubToken = nconf.get('githubToken');

if (!mochaJsonReportFileName || !githubUser || !githubRepo || !githubToken) {
  return printUsage();
}

logger.info('Loading', mochaJsonReportFileName);
var reportText = fs.readFileSync(mochaJsonReportFileName, 'utf8');

logger.info('Parsing report file');
var reportJson = JSON.parse(reportText);

logger.info('Parsed test reports');

github.authenticate({
  type: 'token',
  token: githubToken
});

async.each(reportJson.failures, createIssueForFailure);

function createIssueForFailure(failure) {
  logger.info('Creating github issue for failed test:', failure.title);

  var issueDescription = createFailureDescription(failure);

  var issueSettings = {
    user: githubUser,
    repo: githubRepo,
    title: 'FT failed: ' + failure.fullTitle,
    body: issueDescription,
    labels: ['bug', 'CQD']
  };

  github.issues.create(issueSettings, function(err, result) {
    if (err) {
      return logger.error('Error creating Github issue for', failure.title,
        err);
    }

    logger.info('Created Github issue', githubUser, '/', githubRepo, '#',
      result.number, 'for failed test:', failure.title);
  });
}

function createFailureDescription(failure) {
  var message = 'No message was logged',
      stack = 'No stacktrace was logged';

  if (failure && failure.err) {
    if (failure.err.message) message = failure.err.message;
    if (failure.err.stack) stack = failure.err.stack;
  }

  return message + '\n\n````\n' + stack + '\n````';
}


function printUsage() {
  console.log('Usage: githubUser="user" githubRepo="repo" githubToken="token"' +
      ' node reporter.js filename');
}
