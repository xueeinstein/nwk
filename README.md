# nwk
nw.js kit

[![Build Status](https://travis-ci.org/xueeinstein/nwk.svg)](https://travis-ci.org/xueeinstein/nwk)

## install
```
npm install nwk -g
```

## cli

* __get nwk version__: `nwk -v`
* __get help__: `nwk -h`
* __download nw.js__: `nwk get [--nw=<nw.js version>]`, use `--nw` to set nw.js version, default it is the latest release version.
* __install node modules__: `nwk install <module_name> --nw=<nw.js version>` or `nwk install --nw=<nw.js version>` install node modules for nw.js, expecially for node addons, using `nwk install` is very useful to solve ABI compatiable problems between nw.js and normal node addons.
* __uninstall node modules__: `nwk uninstall <module_name>`
* __test addons build__: `nwk test [<module_name>]`, test node addons special build for nw.js. And auto solve binary path error which often happens when install node addons that use `node-pre-gyp` to build.

__Note__: use `<arg>` to represent argument, `[...]` means that it's optional.
