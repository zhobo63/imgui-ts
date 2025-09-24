# imgui-ts

JavaScript bindings for [Dear ImGui](https://github.com/ocornut/imgui) using [Emscripten](https://github.com/kripken/emscripten) and TypeScript, modularized with webpack for [imgui-js](https://github.com/flyover/imgui-js)

## Notes

* Fonts

```Fonts
imconfig.h
USE_EXTERNAL_FONT

Use canvas2d fillText to generate the fonts that used at runtime. 
```

* Input Text

```Input
Use overlay document element 'input' for single line text, and 'textarea' for multi-line text input.
We can input text from mobile now.

TODO InputInt and other function input from mobile
```

* Slide Content from Mobile

```Slide Window Content
When window is no_move, we can slide content then HoveredID=0. Usefull for mobile with no mouse wheel.
```

## Building

* compile cpp to js

```
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

## Update

* 0.1.50
  * [New] ImBlend
  * [New] ImDrawList::SetBlend

* 0.1.49
  * [New] Compressed Texture

* 0.1.43
  * Implement ImDrawList::AddCallback

* Merge ImFont

```typescript
let fontface=new FontFace("FontAwesome",
    "url(res/fa-solid-900.woff2) format(woff2)", {});
await fontface.load().then(r=>{
    console.log("FontFace loaded!", r)
})
document.fonts.add(fontface);
let io=ImGui.GetIO();
let font=io.Fonts.AddFontDefault();
font.FontName="arial"
font.FontStyle="bold";
font.FontSize=16;    

let font2=ImGui.CreateFont("FontAwesome", font.FontSize-2, "");
font2.AddFontRange(0xf000, 0xffff);
font.MergeFont(font2);

//code range 0xf000~0xffff use "FontAwesome", others use "arial"
ImGui.Text("this is a \uf013 gear.");
```

* ImTransform

```typescript
let tm=new ImTransform();
tm.rotate.SetRotate(radians);   //rotate
tm.scale=1+Math.sin(time)*0.5;  //scale
tm.translate.Set(100,100);      //translate
let vstart=drawlist.GetVertexSize();
//draw some thing
drawlist.AddRectFilledMultiColorRound(this.v1,this.v2,0xff00ff00, 0xffffff00, 0xff00ffff, 0xff0000ff,4,ImGui.ImDrawCornerFlags.All);
drawlist.AddRect(this.v1,this.v2,0xff0000ff, 4, ImGui.ImDrawCornerFlags.All);
drawlist.Transform(tm, vstart);
```

* ImDrawList: AddRectFilledMultiColorRound

# Example

```typescript
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
