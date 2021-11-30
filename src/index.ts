import * as ImGui from "./imgui"
import * as ImGui_Impl from "./imgui_impl"

export {ImGui, ImGui_Impl}

let _main:Main;

function _loop(time:number) {
    _main.loop(time);
    window.requestAnimationFrame(_loop);
}

class Main
{
    constructor()
    {
    }

    prev_time:number;
    text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up');
    text2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'もじ/もんじ');
    text_area:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up multiline');
    text_area2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,
        '觀自在菩薩，行深般若波羅蜜多時，\n照見五蘊皆空，度一切苦厄。');
    first:boolean=true;
    v4:ImGui.Vec4=new ImGui.Vec4;

    ImObject(obj:any, id:number=0):number
    {
        Object.entries(obj).forEach(([key, value])=>{
            ImGui.PushID(id);
            id++;
            if(value==null) {
                ImGui.Text(key + ": (null)");
            }
            else if(typeof(value)==='object')    {
                if(ImGui.TreeNode(key)) {
                    id=this.ImObject(value, id+1);
                    ImGui.TreePop();
                }
            }    
            else if(typeof(value)==='number')    {
                let v=(_:number=value as number):number=>obj[key]=_;
                ImGui.SetNextItemWidth(100);
                ImGui.InputFloat(key, v);
            }
            else if(typeof(value)==='boolean')    {
                let v=(_:boolean=value as boolean):boolean=>obj[key]=_;
                ImGui.SetNextItemWidth(100);
                ImGui.Checkbox(key, v);
            }
            else {
                ImGui.Text(key + ": " + value);
            }
            ImGui.PopID();
        })
        return id;
    }

    loop(time:number):void {
        if(ImGui_Impl.is_contextlost)
            return;
        if(!ImGui_Impl.any_pointerdown() && time-this.prev_time<1000.0/30)   {
            return;
        }
        this.prev_time=time;

        ImGui_Impl.NewFrame(time);
        ImGui.NewFrame();

        if(this.first)  {
            ImGui.SetNextWindowPos(new ImGui.ImVec2(0,0));
            ImGui.SetNextWindowSize(new ImGui.ImVec2(ImGui_Impl.canvas.scrollWidth,ImGui_Impl.canvas.scrollHeight));
            this.first=false
        }

        ImGui.Begin("Hello");
        ImGui.Text("Version " + ImGui.VERSION);
        ImGui.InputText("Input", this.text);
        ImGui.InputText("Input2", this.text2);
        ImGui.InputText("Password", this.text, this.text.size, ImGui.InputTextFlags.Password);
        ImGui.InputTextMultiline("Text", this.text_area);
        ImGui.InputTextMultiline("Text2", this.text_area2);
        ImGui.TextWrapped(this.text_area2.buffer);
        ImGui.SliderFloat4("Slider", this.v4, 0,100);
        ImGui.InputFloat4("Float4", this.v4);
        //this.ImObject(ImGui.GetIO().Fonts);
        ImGui.TextColored(new ImGui.ImVec4(0,1,0,1), "FontTexturePool");
        ImGui_Impl.dom_font.texturePage.forEach(page=>{
            ImGui.Image(page.Texure._texture, new ImGui.ImVec2(512,512));
        })
        ImGui.End();
        ImGui.ShowDemoWindow();
        ImGui.ShowMetricsWindow();

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
    ImGui.StyleColorsDark();
    if(ImGui.isMobile.any())    {
        ImGui_Impl.setCanvasScale(1);
        ImGui_Impl.setFontScale(1.5)
    }

    const io:ImGui.IO=ImGui.GetIO();
    let font =io.Fonts.AddFontDefault();
    font.FontName="Microsoft JhengHei";

    const canvas:HTMLCanvasElement=document.getElementById("canvas") as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);

    _main=new Main;
    window.requestAnimationFrame(_loop);
});        


