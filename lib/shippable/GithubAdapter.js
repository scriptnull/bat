/*global config*/
'use strict';

var request = require('request'),
    querystring = require('querystring'),
    parseLinks = require('parse-links'),
    _ = require('underscore'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'GithubAdapter' });

module.exports = GithubAdapter;

function GithubAdapter(token) {
  this.token = token;
}

var baseUrl = 'https://api.github.com';

GithubAdapter.prototype.get = function (relativeUrl, callback, acceptHeader) {
  logger.debug('Github GET data ', relativeUrl);
  var opts = {
    method: 'GET',
    url: relativeUrl.indexOf('http') === 0 ? relativeUrl :
                                             baseUrl + relativeUrl,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'token ' + this.token,
      'User-Agent': 'kanthchandra'
    }
  };

  if (acceptHeader === true) { //v3
    opts.headers.Accept = 'application/vnd.GithubProvider.v3';
  } else if (acceptHeader) {
    opts.headers.Accept = acceptHeader;
  }

  var startedAt = Date.now();
  request(opts,
    handleGithubTokenResponse.bind(null, startedAt, callback,
        relativeUrl, opts));
};

function handleGithubTokenResponse(startedAt, callback, relativeUrl, opts,
                                   err, res, body) {
  logger.debug('handleGithubTokenResponse');
  var interval = Date.now() - startedAt;
  logger.info('Github request ' +
    relativeUrl + ' took ' + interval + ' ms and returned HTTP status ' +
    (res && res.statusCode));
  if (res && res.statusCode > 299) err = err || res.statusCode;
  if (err) {
    logger.error('Github returned status', err, 'for request', relativeUrl,
        'using token', opts.headers.Authorization);
  }
  var links = null;
  if (res && res.headers.link) {
    links = parseLinks(res.headers.link);
  }
  var parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    err = e;
  }
  callback(err, parsedBody, links, res);
}

GithubAdapter.prototype.post = function (relativeUrl, json, callback) {
  logger.info('Github POST data', json);
  logger.debug('stringified data: ', JSON.stringify(json));
  var opts = {
    method: 'POST',
    url: baseUrl + relativeUrl,
    headers: {
      'Authorization': 'token ' + this.token,
      'User-Agent': 'Shippable v3'
    },
    json: json
  };
  var startedAt = Date.now();
  request(opts, function (err, res, body) {
    var interval = Date.now() - startedAt;
    logger.info('Github request POST ' + relativeUrl +
                ' took ' + interval + 'ms and returned HTTP status ' +
                res.statusCode);
    logger.info('Github POST body', body);
    if (err) {
      logger.error('Github reported error', err, body);
    } else if (res.statusCode > 299) {
      err = res.statusCode;
      logger.error('Github reported error', err, body);
    }
    if (_.isFunction(callback)) {
      var links = null;
      if (res.headers.link) {
        links = parseLinks(res.headers.link);
      }
      callback(err, body, links, res);
    }
  });
};

GithubAdapter.prototype.put = function (relativeUrl, json, callback) {
  logger.info('Github PUT data', json);
  logger.debug('stringified data: ', JSON.stringify(json));
  var opts = {
    method: 'PUT',
    url: baseUrl + relativeUrl,
    headers: {
      'Authorization': 'token ' + this.token,
      'User-Agent': 'Shippable v3',
      'Accept': 'application/vnd.GithubProvider.v3+json'
    },
    json: json
  };
  var startedAt = Date.now();
  request(opts, function (err, res, body) {
    var interval = Date.now() - startedAt;
    logger.info('Github request PUT ' + relativeUrl +
                ' took ' + interval + 'ms and returned HTTP status ' +
                res.statusCode);
    logger.info('Github PUT body', body);
    if (err) {
      logger.error('Github reported error', err, body);
    } else if (res.statusCode > 299) {
      err = res.statusCode;
      logger.error('Github reported error', err, body);
    }
    if (_.isFunction(callback)) {
      var links = null;
      if (res.headers.link) {
        links = parseLinks(res.headers.link);
      }
      callback(err, body, links, res);
    }
  });
};

GithubAdapter.prototype.del = function (relativeUrl, callback, v3) {
  var opts = {
    method: 'DELETE',
    url: relativeUrl.indexOf('http') === 0 ? relativeUrl :
                                             baseUrl + relativeUrl,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'token ' + this.token,
      'User-Agent': 'Shipable v3'
    }
  };
  if (v3 === true) {
    opts.headers.Accept = 'application/vnd.github.v3';
  }
  var startedAt = Date.now();
  request(opts, function (err, res, body) {
    var interval = Date.now() - startedAt;
    logger.info('Github delete request ' + relativeUrl +
                ' took ' + interval + ' ms and returned HTTP status ' +
                res.statusCode);
    if (!err) {
      if (res.statusCode > 299) {
        err = res.statusCode;
      }
    }
    if (_.isFunction(callback)) {
      var links = null;
      if (res.headers.link) {
        links = parseLinks(res.headers.link);
      }
      if (body && body.length > 0 &&
          res.headers['content-type'].indexOf('application/json') >= 0) {
        body = JSON.parse(body);
      }
      callback(err, body, links, res);
    }
  });
};

GithubAdapter.prototype.getRateLimit = function (callback) {
  this.get('/rate_limit', callback);
};

GithubAdapter.prototype.getUser = function (login, callback) {
  var url = '/user'; // Gets the currently authenticated user

  if (login) {
    url = '/users/' + login; // Gets the specified user
  }

  this.get(url, callback);
};

GithubAdapter.prototype.getUserEmails = function (callback) {
  this.get('/user/emails', callback, true);
};

GithubAdapter.prototype.getUserOrganizations = function (callback) {
  this.get('/user/orgs', callback, true);
};

GithubAdapter.prototype.getOrganizationsFor = function (user, callback) {
  this.get('/users/' + user + '/orgs', callback, true);
};


GithubAdapter.prototype.getOrganization = function (org, callback) {
  this.get('/orgs/' + org, callback, true);
};

GithubAdapter.prototype.getOrganizationTeams = function (org, callback) {
  this.get('/orgs/' + org + '/teams', callback, true);
};

GithubAdapter.prototype.getOrganizationMembership =
  function(org, username, callback) {
    var acceptHeader = 'application/vnd.github.moondragon+json';

    this.get('/orgs/' + org + '/memberships/' + username,
      callback, acceptHeader);
};

GithubAdapter.prototype.getOrganizationOwners = function(org, callback) {
    var acceptHeader = 'application/vnd.github.moondragon+json';

    this.get('/orgs/' + org + '/members?role=admin',
      callback, acceptHeader);
};

GithubAdapter.prototype.getOrganizationMembers = function(org, callback) {
    var acceptHeader = 'application/vnd.github.moondragon+json';

    this.get('/orgs/' + org + '/members',
      callback, acceptHeader);
};

GithubAdapter.prototype.getMemberships = function(callback) {
    this.get('/user/memberships/orgs', callback);
};

GithubAdapter.prototype.getTeam = function (teamId, callback) {
  this.get('/teams/' + teamId, callback);
};

GithubAdapter.prototype.checkTeamMember = function (teamId, user, callback) {
  this.get('/teams/' + teamId + '/members/' + user, callback, true);
};

GithubAdapter.prototype.getTeamMembers = function (teamId, callback) {
  this.get('/teams/' + teamId + '/members', callback, true);
};

GithubAdapter.prototype.getUserTeams = function (callback) {
  this.get('/user/teams', callback, true);
};

GithubAdapter.prototype.getUserRepositories = function (user, callback) {
  var allRepos = [],
      self = this;

  function onResponse(err, repos, links) {
    allRepos = allRepos.concat(repos);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allRepos);
    }
  }
  this.get('/users/' + user + '/repos?per_page=100', onResponse, true);
};

GithubAdapter.prototype.getRepositories = function (callback) {
  var allRepos = [],
      self = this;

  function onResponse(err, repos, links) {
    allRepos = allRepos.concat(repos);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allRepos);
    }
  }
  this.get('/user/repos?type=owner', onResponse);
};

GithubAdapter.prototype.getAllRepositories = function (callback) {
  var allRepos = [],
      self = this;

  function onResponse(err, repos, links) {
    allRepos = allRepos.concat(repos);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allRepos);
    }
  }
  this.get('/user/repos?per_page=100', onResponse);
};

GithubAdapter.prototype.getAllRepositoriesForUser = function (callback) {
  var acceptHeader = 'application/vnd.github.moondragon+json',
      allRepos = [],
      self = this;

  function onResponse(err, repos, links) {
    allRepos = allRepos.concat(repos);
    if (links && links.next) {
      self.get(links.next, onResponse, acceptHeader);
    } else {
      callback(err, allRepos);
    }
  }
  this.get('/user/repos?per_page=100', onResponse, acceptHeader);
};

GithubAdapter.prototype.getOrgRepositories = function (org, callback) {
  var allRepos = [],
      self = this;

  function onResponse(err, repos, links) {
    allRepos = allRepos.concat(repos);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allRepos);
    }
  }
  this.get('/orgs/' + org + '/repos', onResponse);
};

GithubAdapter.prototype.getRepository = function (fullRepoName, callback) {
  this.get('/repos/' + fullRepoName, callback, true);
};

GithubAdapter.prototype.getRepositoryTeams = function (fullRepoName, callback) {
  this.get('/repos/' + fullRepoName + '/teams', callback, true);
};

GithubAdapter.prototype.getRepositoryBranches = function (fullRepoName,
                                                         callback) {
  var allBranches = [],
    self = this;

  function onResponse(err, branches, links) {
    allBranches = allBranches.concat(branches);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allBranches);
    }
  }
  this.get('/repos/' + fullRepoName + '/branches', onResponse);
};

GithubAdapter.prototype.getRepositoryCollaborators = function (fullRepoName,
                                                              callback) {

  var allCollaborators = [],
    self = this;

  function onResponse(err, collaborators, links) {
    allCollaborators = allCollaborators.concat(collaborators);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allCollaborators);
    }
  }
  this.get('/repos/' + fullRepoName + '/collaborators', onResponse, true);
};

GithubAdapter.prototype.getIssues = function (query, callback) {
  //All issues the user may view (and scope will allow).
  /* Query object options:
  *  filter: 'assigned', 'created', 'mentioned', 'subscribed', 'all'
  *    Default: 'assigned'
  *    Filter is relative to the authenicated user, e.g. 'assigned' to user.
  *  state: 'open', 'closed', or 'all' Default: 'open'
  *  assignee: username, 'none', or '*' Default: '*'
  *  labels: comma-separated label names
  *  sort: 'created', 'updated', or 'comments' Default: 'created'
  *  direction (of sort): 'asc' or 'desc' Default: 'desc'
  *  since: updated since ISO 8601 format timestamp: YYYY-MM-DDTHH:MM:SSZ
  */
  this.get('/issues?' + querystring.stringify(query), callback, true);
};

GithubAdapter.prototype.getUserIssues = function (query, callback) {
  //Issues from owned and member repositories
  /* See GithubAdapter.prototype.getVisibleIssues for query */
  this.get('/user/issues?' + querystring.stringify(query), callback, true);
};

GithubAdapter.prototype.getOrganizationIssues = function (org, query,
                                                          callback) {
  //Issues for an organization
  /* See GithubAdapter.prototype.getVisibleIssues for query */
  this.get('/orgs/' + org + '/issues?' + querystring.stringify(query),
    callback, true);
};

GithubAdapter.prototype.getRepositoryIssues = function (owner, repo, query,
                                                        callback) {
  //Issues from a repository
  /* Query object options:
  *  milestone: integer milestone number, '*' (all), or 'none' (no milestone)
  *    Default: '*''
  *  state: 'open', 'closed', or 'all' Default: 'open'
  *  assignee: username, 'none', or '*' Default: '*'
  *  creator: user
  *  mentioned: user
  *  labels: comma-separated label names
  *  sort: 'created', 'updated', or 'comments' Default: 'created'
  *  direction (of sort): 'asc' or 'desc' Default: 'desc'
  *  since: updated since ISO 8601 format timestamp: YYYY-MM-DDTHH:MM:SSZ
  */
  this.get('/repos/' + owner + '/' + repo + '/issues?' +
    querystring.stringify(query), callback, true);
};

GithubAdapter.prototype.searchRepositoryIssues = function (query, callback) {
  //Search issues on Github
  /* query object options:
  *  repo: repository to limit search to in form of ownerName/repoName
  *  type:
  */
  logger.debug('/search/issues?q=' + querystring.stringify(query, '+', ':'));
  this.get('/search/issues?q=' + querystring.stringify(query, '+', ':') +
    '&per_page=100', callback, true);
};

GithubAdapter.prototype.pushRespositoryIssue = function (owner, repo, json,
                                                         callback) {
  //Create new issue in respository - user must have pull access to repo
  /*  json object properties:
  *   title: string - *required*
  *   body: string - contents of the issue
  *   assignee: username - user must have push access or this is ignored
  *   milestone: integer, milestone id - user must have push access
  *   labels: [strings] - array of label titles - user must have push access
  */
  logger.debug('pushRepositoryIssues');
  this.post('/repos/' + owner + '/' + repo + '/issues', json, callback);
};

GithubAdapter.prototype.getPullRequests = function (fullName, query, callback) {
  /* Query object options:
  *  state: 'open', 'closed', or 'all' Default: 'open'
  *  head: user:branch name


  *  base: branch name
  *  sort: created, updated, popularity (comment count)
  *         or long-running (age, filtering by pulls updated in the last month)
  *  direction (of sort): 'asc' or 'desc'
  *                        Default: 'desc' for 'created', otherwise 'asc'
  */
  var allPullRequests = [],
      self = this;

  function onResponse(err, pullRequests, links) {
    allPullRequests = allPullRequests.concat(pullRequests);
    if (links && links.next) {
      self.get(links.next, onResponse);
    } else {
      callback(err, allPullRequests);
    }
  }
  this.get('/repos/' + fullName + '/pulls?' + querystring.stringify(query),
    onResponse, true);
};

GithubAdapter.prototype.postCommitStatus = function (
    owner, repo, sha, status, callback) {
  this.post('/repos/' + owner + '/' + repo + '/statuses/' + sha,
      status, callback);
};

GithubAdapter.prototype.postHook = function (owner, repo, url, callback) {
  this.post('/repos/' + owner + '/' + repo + '/hooks', {
    name: 'web',
    events: ['push', 'pull_request'],
    config: {
      url: url
    }
  }, callback);
};

GithubAdapter.prototype.testHook = function (owner, repo, hookId, callback) {
  this.post('/repos/' + owner + '/' + repo + '/hooks/' + hookId + '/tests',
    {}, callback);
}

GithubAdapter.prototype.putContentToRepo = function (owner, repoName, path,
  commitMessage, contentBase64, callback) {
  /*  GitHub PUT /repos/:owner/:repo/contents/:path
  *   :repo is the name of the repository
  *   :path is fileName.extension (ie shippable.yml)
  *   contentBase64: commands in ASCII format, converted to base64 below
  */
  this.put('/repos/' + owner + '/' + repoName + '/contents/' + path, {
    message: commitMessage,
    content: contentBase64
  }, callback);
};


GithubAdapter.prototype.deleteHook = function (owner, repo, hookId, callback) {
  this.del('/repos/' + owner + '/' + repo + '/hooks/' + hookId, callback);
};

GithubAdapter.prototype.getHooks = function (owner, repo, callback) {
  this.get('/repos/' + owner + '/' + repo + '/hooks', callback);
};

GithubAdapter.prototype.postDeployKey = function (owner, repo, key, callback) {
  this.post('/repos/' + owner + '/' + repo + '/keys', {
    title: 'shippable-' + (process.env.RUN_MODE || 'dev'),
    'key': key
  }, callback);
};

GithubAdapter.prototype.deleteDeployKey = function (owner, repo, keyId,
                                                    callback) {
  this.del('/repos/' + owner + '/' + repo + '/keys/' + keyId, callback);
};

GithubAdapter.prototype.getDeployKeys = function (owner, repo, callback) {
  this.get('/repos/' + owner + '/' + repo + '/keys', callback);
};

GithubAdapter.prototype.getReference = function (owner, repo, branch,
                                                 callback) {
  logger.debug('GithubAdapter.prototype.getReference ',
      ' /repos/', owner, '/', repo, '/git/refs/heads/', branch);
  this.get('/repos/' + owner + '/' + repo + '/git/refs/heads/' + branch,
    callback);
};

GithubAdapter.prototype.getContents = function (owner, repo, path, callback) {
  this.get('/repos/' + owner + '/' + repo + '/contents/' + path, callback);
};

GithubAdapter.prototype.getCommitContent = function (owner, repo, sha,
                                                     callback) {
  this.get('/repos/' + owner + '/' + repo + '/commits/' + sha, callback);
};

GithubAdapter.prototype.getRepositoryContent = function (owner, repo, filePath,
                                                        ref, callback) {
  var url = '/repos/' + owner + '/' + repo + '/contents/' + filePath;
  if (ref) {
    url = url + '?ref=' + ref;
  }
  this.get(url, callback);
};

GithubAdapter.prototype.getTree = function (owner, repo, sha, callback) {
  var url = '/repos/' + owner + '/' + repo + '/git/trees/' + sha;
  this.get(url, callback);
};

GithubAdapter.prototype.getPullRequest = function (owner, repo,
                                                   pullRequestNumber,
                                                   callback) {
  var url = '/repos/' + owner + '/' + repo + '/pulls/' + pullRequestNumber;
  this.get(url, callback);
};

GithubAdapter.prototype.getPullRequestFiles = function(owner, repo, prNumber,
                                                       callback) {
  var url = '/repos/' + owner + '/' + repo + '/pulls/' + prNumber + '/files';
  this.get(url, callback);
};
