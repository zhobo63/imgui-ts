import * as ImGui from "./imgui"
import * as ImGui_Impl from "./imgui_impl"

export {ImGui, ImGui_Impl}

let _main:Main;

function _loop(time:number) {
    _main.loop(time);
    window.requestAnimationFrame(_loop);
}

export class Main
{
    constructor()
    {
    }

    text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up');
    text2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up');
    text_area:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up multiline');
    text_area2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up multiline');

    ImObject(obj:any, id?:number)
    {
        if(id==null)    {
            id=1;
        }
        ImGui.PushID(id);


        ImGui.PopID();
    }

    loop(time:number):void {
        ImGui_Impl.NewFrame(time);
        ImGui.NewFrame();
        ImGui.Begin("Hello");
        ImGui.Text("Version " + ImGui.VERSION);
        ImGui.InputText("Input", this.text);
        //ImGui.InputText("Input2", this.text2);
        ImGui.InputTextMultiline("Text", this.text_area);
        //ImGui.InputTextMultiline("Text2", this.text_area2);

        ImGui_Impl.dom_font.texturePage.forEach(page=>{
            ImGui.Image(page.Texure._texture, new ImGui.ImVec2(512/window.devicePixelRatio,512/window.devicePixelRatio));
        })

        ImGui.End();
        ImGui.EndFrame();
        ImGui.Render();

        ImGui_Impl.ClearBuffer(new ImGui.ImVec4(0.25,0.25,0.25,1));
        ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
    }

}

window.addEventListener('DOMContentLoaded', async ()=>{
    await ImGui.default();
    ImGui.CHECKVERSION();
    console.log("ImGui.CreateContext() VERSION=", ImGui.VERSION);

    ImGui.CreateContext();
    const io:ImGui.IO=ImGui.GetIO();
    ImGui.StyleColorsDark();

    let font =io.Fonts.AddFontDefault();

    const canvas:HTMLCanvasElement=document.getElementById("canvas") as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);

    _main=new Main;
    window.requestAnimationFrame(_loop);
});        
