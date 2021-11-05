import * as ImGui from "./imgui"
import * as ImGui_Impl from "./imgui_impl"

let text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up');
let text_area:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up multiline');

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
    console.log("DOMContentLoaded");
    await ImGui.default();
    console.log("ImGui.CreateContext() VERSION=", ImGui.VERSION);

    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    const io:ImGui.IO=ImGui.GetIO();
    ImGui.StyleColorsDark();
    io.Fonts.AddFontDefault();

    const canvas:HTMLCanvasElement=document.getElementById("canvas") as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);
    console.log(io.BackendRendererName);
    console.log(io.BackendPlatformName);
    window.requestAnimationFrame(_loop);
});


