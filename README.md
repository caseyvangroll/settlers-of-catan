# Settlers of Catan

### Basics
App is hosted at [GravityPond].
You can find the server logs [here].
Development takes place in root of the repo, with grunt uglifying/minifying/cleaning into the nested production folder.
Deployment is triggered on a push to master, and unless the build fails after deploy there should be no lapse in service.
The Wiki contains an overall [system model], [flow of game], [domain model], as well as [board ids] and [sizing math].
### Installation
After cloning...
```sh
$ cd settlers-of-catan
$ npm install
$ npm install -g grunt pm2
```
### Development
To run tests locally:
```sh
$ grunt test<:env><:suite>
      env = dev | prod
      suite = all | server | db
```
To locally nuke/remake production directory:
```sh
$ grunt build
```
### CICD
###### Code is managed with [Github].
###### Deployment is managed with [Jenkins].

### Modules
| Web | |
| ------ | ------ |
| [node] | Of course |
| [express] | Network app framework and static files |
| [socket.io] | Server-client communication |

| Code | |
| ------ | ------ |
| [eslint] | Javascript Linting |
| [grunt] | Task Runner for Tests, Uglification/Minification |

| Testing | |
| ------ | ------ |
| [mocha] | Behavior testing |
| [chai] | Assertion library |

   [gravitypond]: <http://gravitypond.com>
   [here]: <http://gravitypond.com/logs>
   [node]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [socket.io]: <https://socket.io/m>
   [eslint]: <https://www.npmjs.com/package/eslint>
   [grunt]: <https://gruntjs.com/>
   [mocha]: <https://mochajs.org/>
   [chai]: <http://chaijs.com/>
   [jenkins]: <http://gravitypond.com/jenkins/>
   [github]: <https://github.com/caseyvangroll/settlers-of-catan>
   [system model]: <https://github.com/caseyvangroll/settlers-of-catan/wiki/System-Model>
   [board ids]: <https://github.com/caseyvangroll/settlers-of-catan/wiki/Board-IDs>
   [domain model]: <https://github.com/caseyvangroll/settlers-of-catan/wiki/Domain-Model>
   [sizing math]: <https://github.com/caseyvangroll/settlers-of-catan/wiki/Sizing-Math>
   [flow of game]: <https://github.com/caseyvangroll/settlers-of-catan/wiki/Flow-of-Game>
