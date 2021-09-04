# imgui-ts
JavaScript bindings for [Dear ImGui](https://github.com/ocornut/imgui) using [Emscripten](https://github.com/kripken/emscripten) and TypeScript, modularized with webpack for [imgui-js](https://github.com/flyover/imgui-js)

## Building

* compile cpp to js

``` compile cpp to js
download and install [Emscripten](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)
cd imgui-ts/imgui/embind
make
```

* create bundle js

``` webpack
cd imgui-ts
npm install
webpack
```

## Example

