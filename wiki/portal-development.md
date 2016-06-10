# Portal development

This wiki page shows an overview of the current architecture of the `portal-web` service, with details on how to contribute to its development.

### Table of contents

<!-- MarkdownTOC -->

1. [Requirements](#requirements)
1. [Architecture Overview](#architecture-overview)
1. [Configuring `gcloud`](#configuring-gcloud)
1. [Getting started](#getting-started)
    1. [Grabbing the code](#grabbing-the-code)
    1. [Launching the development server](#launching-the-development-server)
1. [Development best practices](#development-best-practices)
    1. [Before getting you hands dirty...](#before-getting-you-hands-dirty)
    1. [Create and activate a new branch](#create-and-activate-a-new-branch)
    1. [Commit your work](#commit-your-work)
1. [Deployment](#deployment)
    1. [Test your changes in a new version](#test-your-changes-in-a-new-version)
    1. [Merging your changes in the `master` branch](#merging-your-changes-in-the-master-branch)
1. [Cleaning up](#cleaning-up)
    1. [Deleting the App Engine version](#deleting-the-app-engine-version)
    1. [Delete your local branch](#delete-your-local-branch)
    1. [Delete the remote branch](#delete-the-remote-branch)

<!-- /MarkdownTOC -->




<a name="requirements"></a>
# Requirements

1. [Python](https://www.python.org/) 2.7 *(**WARNING**, Google App Engine does not support Python3 generally)*
1. [Google Cloud SDK](https://cloud.google.com/sdk/gcloud/), with `app-engine-python` component installed (at least 1.9.10)
1. [NodeJS](http://nodejs.org/) (>=0.10.31)
1. [Git](http://git-scm.com/)




<a name="architecture-overview"></a>
# Architecture Overview

On the server side, VertNet runs on the [Google App Engine](https://cloud.google.com/appengine) Python 2.7 runtime. To develop, you will need to [download and install](https://cloud.google.com/appengine/downloads) the latest Python SDK and add it to your `$PATH`. Development has been tested with Python 2.7.5 and App Engine 1.9.10. 

On the client side the web application uses NodeJS. Development has been tested with nodejs 0.10.31.

To manage updates to the Github repository, use [Git](http://git-scm.com/).




<a name="configuring-gcloud"></a>
# Configuring `gcloud`

As a preparation step, you need to configure the Google Cloud SDK to attach the project and store the credentials. This is a mandatory step before making any deployment or checking any Google Cloud service.

First, make sure you have the SDK installed and generally available by running

```bash
$ gcloud -v
```

Then, we can start the configuration process by calling:

```bash
$ gcloud init
```

This will lead you through a set of steps to properly configure gcloud services to be used with the VertNet project. Please make sure to use `vertnet-portal` as the ID for the project. Also, make sure you have the ability to open a browser window to enter your Google Account credentials (*e.g.*, you are not running on a remote SSH connection with no graphic interface).

Once finished, if it shows a message starting like this: `Your Google Cloud SDK is configured and ready to use!`, that means you are ready to go!




<a name="getting-started"></a>
# Getting started

<a name="grabbing-the-code"></a>
## Grabbing the code

Make sure you have `git` installed. To do so, run this from the command line:

```bash
$ git --version
```

It should return something like `git version 2.8.3`. If there is an error, you don't have `git` properly installed.

Then, get the latest version of the code by cloning the repository:

```bash
$ git clone https://github.com/VertNet/portal-web.git
```

That will download the full code repository into a directory named `portal-web`. If you want to rename it to something different, use this command instead:

```bash
$ git clone https://github.com/VertNet/portal-web.git reponame
```

<a name="launching-the-development-server"></a>
## Launching the development server

The application runs on [Google App Engine](https://cloud.google.com/appengine), so we can use the local development server for testing changes before deploying them to production on App Engine. To do so, make sure you are in the `portal-web` folder and that you have correctly added the path to the `gcloud` binaries to the `$PATH` environment variable. To check this, run:

```bash
$ dev_appserver.py -h
```

If you see the help output, then you have the environment correctly configured. Then, to launch the development server, simply run:

```bash
$ dev_appserver.py portal-web.yaml
```

That will throw a stream of logging messages that will eventually go to a pause with the message:

    INFO     2016-06-09 10:55:53,184 api_server.py:205] Starting API server at: http://localhost:59662
    INFO     2016-06-09 10:55:53,191 dispatcher.py:197] Starting module "portal-web" running at: http://localhost:8080
    INFO     2016-06-09 10:55:53,192 admin_server.py:116] Starting admin server at: http://localhost:8000
    WARNING  2016-06-09 10:55:53,196 devappserver2.py:835] No default module found. Ignoring.

This means the development server is ready to receive traffic, listening to `http://localhost:8080`. There is also an administration server ready on `http://localhost:8000`.

*IMPORTANT NOTE*: Although the webapp will run locally, it still requires a JSON authentication file named 'auth.txt' be present in the application's root folder. A sample of this file is included in the code base [https://github.com/VertNet/portal-web/blob/master/auth.txt.sample](https://github.com/VertNet/portal-web/blob/master/auth.txt.sample) and will be needed to be customized with your information and google key.

<a name="getting-some-test-data-deprecated"></a>
### Getting some test data (*DEPRECATED*)

First we'll need some test data. Go into the `portal-web` directory, download [this file](https://dl.dropboxusercontent.com/u/13724811/data.zip), and unzip it. It will create a folder called `data` with the required files. Then at the command line, add the `--storage_path=data` argument, like so:

```bash
$ dev_appserver.py --storage_path=data portal-web.yaml
```

**DEPRECATION NOTE**: Before June 2016, the VertNet portal (a.k.a. `webapp`) was a monolithic application that served all operations on the VertNet network. However, we have migrated the architecture to a [microservice](https://en.wikipedia.org/wiki/Microservices)-based infrastructure, and the web portal (now called `portal-web`) became an independent service that just serves the data to the users. The main difference is that all data access operations are handled by a different service, called [`api`](https://github.com/VertNet/api), and the `portal-web` service is already configured to make calls to this `api` service. Therefore, no data download is required in order to work.




<a name="development-best-practices"></a>
# Development best practices

<a name="before-getting-you-hands-dirty"></a>
## Before getting you hands dirty...

... there are a few things to keep in mind when contributing to the development of the portal. Code maintenance is a difficult and never-ending task, so we encourage a set of best practices in order to make the development process smoother and everyone's life easier.

We encourage the use of [branches](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) in the repository to add new functionality or improve existing one. That means, instead of working directly onto the main branch, it is wise to first create a new branch and work there. This allows easy rollback if things get messy and helps avoiding accidental or incomplete deployments.

<a name="create-and-activate-a-new-branch"></a>
## Create and activate a new branch

To create a new branch, run this code from the command line:

```bash
$ git checkout master
$ git pull
$ git checkout -b branch_name
```

The first two commands make sure we are on the `master` (main) branch and that we have received the latest changes anyone has pushed to the repository. Then the third command creates and "activates" the new branch, with the name `branch_name`.

We also recommend a clear nomenclature for branches, where the purpose and main idea of the work is clearly stated. For example, to add a new feature to the portal (say dynamic maps) we would recommend a name like this: `feature/dynamic-maps`, or to fix a bug in the publishers' list, `bug/publisher-list`. So, to create the dynamic maps branch, the `checkout` command should be:

```bash
$ git checkout -b feature/dynamic-maps
```

If the output is `Switched to a new branch 'feature/dynamic-maps'`, then you are all set.

<a name="commit-your-work"></a>
## Commit your work

Now it is safe to work on your code knowing it will be harder to break anything. Changes can be committed to your branch in the *local* repository by executing the following commands:

```bash
$ git add .
$ git commit -m "Commit message"
```

or, with a single command

```bash
$ git commit -a -m "Commit message"
```

> **Tip**: If the commit fixes an issue from the [issue tracking system for this repository](http://www.github.com/vertnet/portal-web/issues), you can add the following piece of text in the commit message: `Fix #N` (where `N` is the issue number). That will close the issue when the changes are pushed to the `master` branch.

The previous steps will update the code in your *local copy* of the code. To push the changes to the GitHub repository, execute the following command:

```bash
$ git push origin feature/dynamic-maps
```

After entering your credentials, a new branch will be created with your changes. If the branch already existed, the changes will simply be pushed to that branch.




<a name="deployment"></a>
# Deployment

<a name="test-your-changes-in-a-new-version"></a>
## Test your changes in a new version

Even though your new version of the portal worked fine on your machine, it might not work exactly as expected in a real live environment. Therefore, it is wise to first deploy your work to a different version of the live portal, just for testing purposes. App Engine infrastructure allows vertain amount of different versions for each deployed service. To see the currently deployed ones, run the following command (make sure you have the Google Cloud SDK properly installed first):

```bash
$ gcloud preview app versions list --service portal-web
```

This will return something like this

```bash
SERVICE     VERSION  TRAFFIC_SPLIT  LAST_DEPLOYED              SERVING_STATUS
portal-web  dev      0.00           2016-05-17T12:59:22+02:00  SERVING
portal-web  prod     1.00           2016-05-24T12:38:20+02:00  SERVING
```

So you can see there are already two versions deployed: `dev` (with no traffic redirected by default) and `prod` (the main production version).

After picking a name for your version, you are ready to deploy your code to make the final tests. To do so, first we need to run some code optimizers:

```bash
$ cd tools
$ node r.js -o build.js
```

Then, go back to the root folder of the service and run the deployment command:

```bash
$ cd ..
$ gcloud preview app deploy --version <version_name> portal-web.yaml
```

Make sure you replace `<version_name>` for the name you chose for your version. It will ask for confirmation and show the URL your version will be deployed to (will most likely be `http://<your-version>.portal-web.vertnet-portal.appspot.com`). If all is good, confirm and after a few moments, you will be able to access the new version through that URL.

Test-run the application. If something doesn't work as expected, you can check App Engine's logs here:

> [https://console.cloud.google.com/logs?project=vertnet-portal](https://console.cloud.google.com/logs?project=vertnet-portal)

A common error is missing the `auth.txt` file we talked about earlier. The log messages that reflect this are like these:

```bash
Traceback (most recent call last):
  File "/base/data/home/runtimes/python27/python27_lib/versions/1/google/appengine/runtime/wsgi.py", line 239, in Handle
    handler = _config_handle.add_wsgi_middleware(self._LoadHandler())
  File "/base/data/home/runtimes/python27/python27_lib/versions/1/google/appengine/api/lib_config.py", line 353, in __getattr__
    self._update_configs()
  File "/base/data/home/runtimes/python27/python27_lib/versions/1/google/appengine/api/lib_config.py", line 289, in _update_configs
    self._registry.initialize()
  File "/base/data/home/runtimes/python27/python27_lib/versions/1/google/appengine/api/lib_config.py", line 164, in initialize
    import_func(self._modname)
  File "/base/data/home/apps/s~vertnet-portal/tuco.373402616596125535/appengine_config.py", line 53, in <module>
    auth = get_auth()
  File "/base/data/home/apps/s~vertnet-portal/tuco.373402616596125535/appengine_config.py", line 32, in get_auth
    auth = json.loads(open(path, "r").read())
IOError: [Errno 2] No such file or directory: '/base/data/home/apps/s~vertnet-portal/tuco.373402616596125535/auth.txt'
```

Make sure you have a valid (filled) copy of `auth.txt` stored in your application's root folder.

If that is not the case, there might be another authentication file missing, but this one is only useful for certain publisher statistics generation: `cdbkey.txt`. There is also a template for this file here: [https://github.com/VertNet/portal-web/blob/master/vertnet/service/cdbkey.txt.sample](https://github.com/VertNet/portal-web/blob/master/vertnet/service/cdbkey.txt.sample).

<a name="merging-your-changes-in-the-master-branch"></a>
## Merging your changes in the `master` branch

When everything looks good, you are ready to make a **pull request**. This is the way to request your code to be merged with the `master` branch. The overall process is as follows:

1. You make a pull request
1. Someone (different than you) will review the changes and deem them appropriate (or not)
1. Then, the pull request will be either accepted or rejected. If it is accepted, the changes will be merged in the `master` branch
1. Finally, an administrator will deploy the changes to the production version

Instructions on how to make a pull request are available in the [GitHub documentation pages](https://help.github.com/articles/using-pull-requests/), but in brief, go to the GitHub repository page:

> [http://www.github.com/vertnet/portal-web](http://www.github.com/vertnet/portal-web)

Then, switch to your branch and click *New pull request*. Use `master` as the base branch and yours as the `compare` branch. Add a title and some comments and click on *Create pull request*. That's it!




<a name="cleaning-up"></a>
# Cleaning up

Just as important as the rest of the process (for code maintenance purposes) is to delete unused branches and versions, to avoid clutter and to avoid hitting some App Engine limits. Basically, this step implies removing three components:

1. Your deployed App Engine version
1. Your local branch
1. Your remote branch (once it is merged)

<a name="deleting-the-app-engine-version"></a>
## Deleting the App Engine version

This can be done with the `gcloud` command in two steps, like so:

```bash
$ gcloud preview app versions --service portal-web --stop <version_name>
$ gcloud preview app versions --service portal-web --delete <version_name>
```

The first step stops the version, so that it is safe deleting it. The second one permanently deletes the version. You can run again the `list` command to check that the version does not exist anymore (See [above](#test-your-changes-in-a-new-version))

<a name="delete-your-local-branch"></a>
## Delete your local branch

You can merge your changes locally to your `master` branch but it isn't really necessary, since the next time you do a `git pull` while on `master` branch, you will receive all changes that happened since the last `git pull`, including your changes now merged. So, in order to delete your local copy of the working branch, do as follows:

```bash
$ git checkout master
$ git pull
$ git branch -D branch_name
```

In essence, you go to the `master` branch and get the latest changes (including your work). If your work is there, then it is safe to delete the branch with the third command.

<a name="delete-the-remote-branch"></a>
## Delete the remote branch

Removing the local branch does not automatically delete the remote one. To do that, you need a somewhat more weird version of the `push` command:

```bash
$ git push origin --delete branch_name
```

**NOTE**: If you have an older version of Git (<1.7.0), this won't work. In that case, this is the command you should use:

```bash
$ git push origin :branch_name
```

**NOTE**: Alternatively, you can go to the GitHub repository and delete the remote branch from there:

> [https://github.com/VertNet/portal-web/branches](https://github.com/VertNet/portal-web/branches)