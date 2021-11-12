# imgui-ts

JavaScript bindings for [Dear ImGui](https://github.com/ocornut/imgui) using [Emscripten](https://github.com/kripken/emscripten) and TypeScript, modularized with webpack for [imgui-js](https://github.com/flyover/imgui-js)

## Building

* compile cpp to js

```compile cpp to js
download and install [Emscripten](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)
cd imgui-ts/imgui/embind
make
```

* create bundle js

```webpack
cd imgui-ts
npm install
webpack
```

# Example

```Notes
import {ImGui, ImGui_Impl} from '@zhobo63/imgui-ts'

let text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'input text');
let text_area:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'edit multiline');

function _loop(time:number):void {
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();
    ImGui.Begin("Hello");
    ImGui.Text("Version " + ImGui.VERSION);
    ImGui.InputText("Input", text);
    ImGui.InputTextMultiline("Text", text_area);
    ImGui.End();
    ImGui.EndFrame();
    ImGui.Render();

    ImGui_Impl.ClearBuffer(new ImGui.ImVec4(0.25,0.25,0.25,1));
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
    window.requestAnimationFrame(_loop);
}

window.addEventListener('DOMContentLoaded', async () => {
    await ImGui.default();

    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    const io:ImGui.IO=ImGui.GetIO();
    ImGui.StyleColorsDark();
    io.Fonts.AddFontDefault();

    const canvas:HTMLCanvasElement=document.getElementById("canvas") as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);
    window.requestAnimationFrame(_loop);
});

```

[ImGui JavaScript+WebGL+Webpack example](https://zhobo63.github.io/imgui-ts/)
