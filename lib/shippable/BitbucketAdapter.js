'use strict';

var Bitbucket = function (tokens) {
  tokens = typeof tokens === 'string' ? tokens : '';

  var OAuth = require('oauth'),
      bunyan = require('bunyan'),
      nconf = require('nconf'),
      logger = bunyan.createLogger({ name: 'BitbucketAdapter' }),
      consumerKey = nconf.get('bitbucketClientId'),
      consumerSecret = nconf.get('bitbucketClientSecret'),
      token = tokens.split('|')[0] || '',
      tokenSecret = tokens.split('|')[1] || '';

  if (!token) {
    logger.error('Bitbucket OAuth token is required.');
  }

  if (!tokenSecret) {
    logger.error('Bitbucket OAuth token secret is required.');
  }

  var options = {
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    /* jshint camelcase: false */
    callbackURL: 'localhost:50001' + '/auth/bitbucket/identify',
    requestTokenURL: 'https://bitbucket.org/api/1.0/oauth/request_token/',
    accessTokenURL: 'https://bitbucket.org/api/1.0/oauth/access_token/',
    userAuthorizationURL: 'https://bitbucket.org/api/1.0/oauth/authenticate/'
  };

  this.oauth = new OAuth.OAuth(options.requestTokenURL, options.accessTokenURL,
    options.consumerKey,  options.consumerSecret,
    '1.0', null, 'HMAC-SHA1',
    null, options.customHeaders);

  this.baseUrlv1 = 'https://bitbucket.org/api/1.0';
  this.baseUrlv2 = 'https://api.bitbucket.org/2.0';

  this.token = token;
  this.tokenSecret = tokenSecret;
  this.logger = logger;

  this.get = function (url, callback) {
    var self = this;
    self.logger.info('GET ' + url);
    self.oauth.get(url, self.token, self.tokenSecret,
      function (err, body, res) {
        self.logger.info('Oauth Call ' + url);
        self.logger.info(err);
        if (res &&
            res.headers['content-type'].indexOf('application/json') >= 0) {
          body = JSON.parse(body);
        }
        callback(err, body, res);
      }
    );
  };

  this.post = function (url, body, callback) {
    var self = this;
    self.logger.profile('POST ' + url);
    self.oauth.post(url, self.token, self.tokenSecret, body,
      function (err, body, res) {
        self.logger.profile('POST ' + url);
        if (res &&
            res.headers['content-type'].indexOf('application/json') >= 0) {
          body = JSON.parse(body);
        }

        callback(err, body, res);
      }
    );
  };

  this.del = function (url, callback) {
    var self = this;
    self.logger.profile('DELETE ' + url);
    self.oauth.delete(url, self.token, self.tokenSecret,
      function (err, body, res) {
        self.logger.profile('DELETE ' + url);
        if (res &&
            res.headers['content-type'].indexOf('application/json') >= 0) {
          body = JSON.parse(body);
        }

        callback(err, body, res);
      }
    );
  };
};

Bitbucket.prototype.getUser = function (userName, callback) {
  var url = this.baseUrlv2 + '/user';
  if (userName) {
    url = this.baseUrlv2 + '/users/' + userName;
  }

  this.get(url, callback);
};

Bitbucket.prototype.getPrivileges = function (callback) {
  var url = this.baseUrlv1 + '/user/privileges';
  this.get(url, callback);
};

Bitbucket.prototype.getVisibleRepositories = function (callback) {
  var url = this.baseUrlv1 + '/user/repositories';
  this.get(url, callback);
};

Bitbucket.prototype.getDashboardRepositories = function (callback) {
  var url = this.baseUrlv1 + '/user/repositories/dashboard';
  this.get(url, callback);
};

Bitbucket.prototype.getTeam = function (name, callback) {
  var url = this.baseUrlv2 + '/teams/' + name;
  this.get(url, callback);
};

Bitbucket.prototype.getRepositories = function (owner, callback) {
  var self = this;
  var url = this.baseUrlv2 + '/repositories/' + owner;
  var allRepos = [];

  function repoCallback(err, repos) {
    if (err) {
      return callback(err);
    }
    else {
      if (repos.values) {
        allRepos = allRepos.concat(repos.values);
      }
      if (repos.next) {
        self.get(repos.next, repoCallback);
      }
      else {
        callback(null, allRepos.filter(function (repo) {
          return repo.scm === 'git';
        }));
      }
    }
  }

  this.get(url, repoCallback);
};

Bitbucket.prototype.getRepoBranches = function (fullName, callback) {
  var url = this.baseUrlv1 +  '/repositories/' + fullName + '/branches';
  this.get(url, callback);
};

Bitbucket.prototype.getMainBranch = function (fullName, callback) {
  var url = this.baseUrlv1 +  '/repositories/' + fullName + '/main-branch/';
  this.get(url, callback);
};

Bitbucket.prototype.getTeamRepos = function (team, callback) {
  var self = this;
  var url = this.baseUrlv2 + '/teams/' + team + '/repositories/';
  var allRepos = [];

  function repoCallback(err, repos) {
    if (err) {
      return callback(err);
    }
    else {
      if (repos.values) {
        allRepos = allRepos.concat(repos.values);
      }
      if (repos.next) {
        self.get(repos.next, repoCallback);
      }
      else {
        callback(null, allRepos);
      }
    }
  }

  this.get(url, repoCallback);
};

Bitbucket.prototype.getRepository = function (owner, repo, callback) {
  var url = this.baseUrlv2 + '/repositories/' + owner + '/' + repo;
  this.get(url, callback);
};

Bitbucket.prototype.getRepositoryV1 = function (fullName, callback) {
  // V2 doesn't return the creator.
  var url = this.baseUrlv1 + '/repositories/' + fullName;
  this.get(url, callback);
};

Bitbucket.prototype.getRepositoryContent = function (owner, repo, filePath,
                                                     ref, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
                             '/raw/' + ref + '/' + filePath;
  this.get(url, callback);
};

Bitbucket.prototype.postHook = function (owner, repo, url, type, callback) {
  // Type may be 'POST' or 'Pull Request POST'
  var finishedUrl = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
                                     '/services/';

  this.post(finishedUrl, {
    type: type,
    URL: url
  }, callback);

};

Bitbucket.prototype.delHook = function (owner, repo, hookId, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
                             '/services/' + hookId;
  this.del(url, callback);
};

Bitbucket.prototype.getHooks = function (owner, repo, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
      '/services';
  this.get(url, callback);
};

Bitbucket.prototype.postDeployKey = function (owner, repo, key, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
                             '/deploy-keys';

  this.post(url, {
    label: 'shippable-' + (process.env.RUN_MODE || 'dev'),
    key: key
  }, callback);

};

Bitbucket.prototype.delDeployKey = function (owner, repo, keyId, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
    '/deploy-keys/' + keyId;
  this.del(url, callback);
};

Bitbucket.prototype.getDeployKeys = function (owner, repo, callback) {
  var url = this.baseUrlv1 + '/repositories/' + owner + '/' + repo +
    '/deploy-keys/';
  this.get(url, callback);
};

Bitbucket.prototype.getRepoCollaborators = function (owner, repo, callback) {
  var url = this.baseUrlv1 + '/privileges/' + owner + '/' + repo;
  this.get(url, callback);
};

Bitbucket.prototype.getCollaborators = function (owner, callback) {
  var url = this.baseUrlv1 + '/privileges/' + owner;
  this.get(url, callback);
};

Bitbucket.prototype.getRepoPrivileges = function (repoFullName, callback) {
  var url = this.baseUrlv1 + '/privileges/' + repoFullName;
  this.get(url, callback);
};

Bitbucket.prototype.getRepoPrivilegesFor = function (repoFullName, userName,
                                                     callback) {
  var url = this.baseUrlv1 + '/privileges/' + repoFullName + '/' + userName;
  this.get(url, callback);
};

Bitbucket.prototype.getTeamPrivileges = function (team, callback) {
  var url = this.baseUrlv1 + '/users/' + team + '/privileges';
  this.get(url, callback);
};

Bitbucket.prototype.getGroups = function (accountName, callback) {
  var url = this.baseUrlv1 + '/groups/' + accountName;
  this.get(url, callback);
};

Bitbucket.prototype.getRepoGroupPrivileges = function (entity, repo, callback) {
  var url = this.baseUrlv1 + '/group-privileges/' + entity;
  if (repo) {
    url += '/' + repo;
  }
  this.get(url, callback);
};

Bitbucket.prototype.getCommit = function (owner, repo, ref, callback) {
  var url = this.baseUrlv2 +
    '/repositories/' + owner + '/' + repo + '/commit/' + ref;
  this.get(url, callback);
};

Bitbucket.prototype.getChangeset = function (owner, repo, node, callback) {
  var url = this.baseUrlv1 +
    '/repositories/' + owner + '/' + repo + '/changesets/' + node;
  this.get(url, callback);
};

Bitbucket.prototype.getPullRequest = function (owner, repo, prId, callback) {
  var url = this.baseUrlv1 +
    '/repositories/' + owner + '/' + repo + '/pullrequests/' + prId;
  this.get(url, callback);
};

Bitbucket.prototype.getUserEmails = function (username, callback) {
  var url = this.baseUrlv1 + '/users/' + username + '/emails';
  this.get(url, callback);
};

Bitbucket.prototype.getContents = function (owner, repo, ref, path,
                                            callback) {
  if (!ref) {
    ref = 'master';
  }
  var url = this.baseUrlv1 + '/repositories/' +
      owner + '/' + repo + '/raw/' + ref + '/' + path;
  this.get(url, callback);
};

Bitbucket.prototype.getCommitContent = function (owner, repo, sha, callback) {
  var url = this.baseUrlv2 + '/repositories/' + owner + '/' +
    repo + '/commit/' + sha;
  this.get(url, callback);
};

module.exports = Bitbucket;
