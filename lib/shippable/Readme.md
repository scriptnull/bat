# NodeJS wrapper for Shippable API

[![Build Status](https://api.shippable.com/projects/550aca695ab6cc1352a4fa9a/badge?branchName=master)](https://app.shippable.com/projects/550aca695ab6cc1352a4fa9a/builds/latest)

Makes it easier to call the Shippable API from NodeJS apps.

## Quick start
````
var Shippable = require('shippable.js');

var api = new Shippable('https://api.shippable.com', myMachineToken);
api.getProject(myProjectId, function(err, project) {
    if (project.autoBuild) {
      project.build();
    }
});
````
