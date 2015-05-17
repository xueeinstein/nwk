# nwk
nw.js kit

## install
```
npm install nwk -g
```

## cli

* __download nw.js__: `nwk get [--nw=0.12.1]`, use `--nw` to set nw.js version, default version is the latest release version.
* __install node modules__: `nwk install <modules_name> <--nw=0.12.1>`, install node modules for nw.js, expecially for node addons, using `nwk install` is very useful to solve ABI compatiable problems between nw.js and normal node addons.
* __test addons build__: `nwk test [package]`, test node addons special build for nw.js. And auto solve binary path error which often happens when install node addons that use `node-pre-gyp` to build.
