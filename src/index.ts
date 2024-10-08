import * as ImGui from "./imgui"
import * as ImGui_Impl from "./imgui_impl"

export {ImGui, ImGui_Impl}

export const version="0.1.46";

export function ImGuiObject(obj:any, id:number=0):number
{
    if(obj==null)   {
        ImGui.Text("(null)");
        return id;
    }
    Object.entries(obj).forEach(([key, value])=>{
        ImGui.PushID(id);
        id++;
        if(value==null) {
            ImGui.Text(key + ": (null)");
        }
        else if(typeof(value)==='object')    {
            if(ImGui.TreeNode(key)) {
                id=ImGuiObject(value, id+1);
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

// let _main:Main;

// function _loop(time:number) {
//     _main.loop(time);
//     window.requestAnimationFrame(_loop);
// }

// class Main
// {
//     constructor()
//     {
//     }

//     prev_time:number;
//     text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up');
//     text2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'もじ/もんじ');
//     text_area:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'whats up multiline');
//     text_area2:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,
//         '觀自在菩薩，行深般若波羅蜜多時，\n照見五蘊皆空，度一切苦厄。');
//     first:boolean=true;
//     v4:ImGui.Vec4=new ImGui.Vec4;
//     image_src:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,'');
//     textureCache:ImGui_Impl.TextureCache=new ImGui_Impl.TextureCache;
//     image:ImGui_Impl.Texture;
//     tm:ImGui.ImTransform=new ImGui.ImTransform();
//     v1:ImGui.Vec2=new ImGui.Vec2(-100,-50);
//     v2:ImGui.Vec2=new ImGui.Vec2(100,100);

//     ImGuiWindow(win:ImGui.Window)   {
//         ImGui.Text("ID:" + win.ID);
//         ImGui.InputFloat2("Pos", win.Pos);
//         ImGui.SliderFloat2("Scroll", win.Scroll, 0, win.ScrollMax.y);
//         ImGui.InputFloat2("ScrollMax", win.ScrollMax);
//         ImGui.Text("ScrollbarX:" + win.ScrollbarX);
//         ImGui.Text("ScrollbarY:" + win.ScrollbarY);
//     }

//     loop(time:number):void {
//         if(ImGui_Impl.is_contextlost)
//             return;
//         if(!ImGui_Impl.any_pointerdown() && time-this.prev_time<1000.0/30)   {
//             //return;
//         }
//         this.prev_time=time;

//         ImGui_Impl.NewFrame(time);
//         ImGui.NewFrame();

//         if(this.first)  {
//             ImGui.SetNextWindowPos(new ImGui.ImVec2(0,0));
//             if(ImGui.isMobile.any())
//                 ImGui.SetNextWindowSize(new ImGui.ImVec2(ImGui_Impl.canvas.scrollWidth,ImGui_Impl.canvas.scrollHeight));
//             this.first=false
//         }

//         ImGui.Begin("Hello");
//         ImGui.Text("Version " + ImGui.VERSION);
//         ImGui.InputText("Input", this.text);
//         ImGui.SetNextItemWidth(-ImGui.FLT_MIN);
//         ImGui.InputText("Input2", this.text2);
//         ImGui.InputText("Password", this.text, this.text.size, ImGui.InputTextFlags.Password);
//         ImGui.InputTextMultiline("Text", this.text_area);
//         ImGui.SetNextItemWidth(-ImGui.FLT_MIN);
//         ImGui.InputTextMultiline("Text2", this.text_area2);
//         ImGui.TextWrapped(this.text_area2.buffer);
//         ImGui.SliderFloat4("Slider", this.v4, 0,100);
//         ImGui.InputFloat4("Float4", this.v4);
//         //this.ImObject(ImGui.GetCurrentWindow());
//         let win=ImGui.GetHoveredWindow();
//         if(win) {
//             if(ImGui.TreeNode("HoveredWindow")) {
//                 this.ImGuiWindow(win)
//                 ImGui.TreePop();
//             }                        
//         }
//         ImGui.Text("HoveredID:" + ImGui.GetHoveredId());
//         ImGui.Text("ActiveID:" + ImGui.GetActiveId());
//         ImGui.Text("InputTextID:" + ImGui.GetInputTextId());
//         let inpText=ImGui.GetInputTextState(ImGui.GetInputTextId());
//         if(inpText) {
//             if(ImGui.TreeNode("InputText")) {
//                 ImGui.Text("ID:" + inpText.ID);
//                 ImGui.Text("Flags:" + inpText.Flags);
//                 ImGui.InputFloat2("FrameBBMin", inpText.FrameBB.Min);
//                 ImGui.InputFloat2("FrameBBMax", inpText.FrameBB.Max);
//                 let text:ImGui.ImStringBuffer=new ImGui.ImStringBuffer(128,inpText.Text);
//                 ImGui.InputText("Text", text);
//                 ImGui.TreePop();
//             }
//         }
        
//         ImGui.InputFloat2("scroll_acc",  ImGui_Impl.scroll_acc);
//         ImGui.TextColored(new ImGui.ImVec4(0,1,0,1), "FontTexturePool");
//         if(ImGui_Impl.dom_font&&ImGui_Impl.dom_font.texturePage) {
//             ImGui_Impl.dom_font.texturePage.forEach(page=>{
//                 ImGui.Image(page.Texure._texture, new ImGui.ImVec2(512,512));
//             })
//         }
//         if(ImGui.InputText("image_src", this.image_src))    {
//             this.textureCache.Load("img", this.image_src.buffer).then(img=>{
//                 this.image=img;
//             });
//         }
//         if(this.image)  {
//             ImGui.Image(this.image._texture, new ImGui.ImVec2(256,256));

//             var drawList:ImGui.ImDrawList = ImGui.GetForegroundDrawList();
//             drawList.AddImage(this.image._texture, new ImGui.Vec2(0,0), new ImGui.Vec2(100,100));
//         }
//         let drawlist=ImGui.GetBackgroundDrawList();

//         drawlist.AddCallback((drawlist, cmd)=>{
//             //console.log("this is a drawlist callback " + cmd.UserCallbackData);
//         }, 1);

//         let vstart=drawlist.GetVertexSize();
//         drawlist.AddRectFilledMultiColorRound(this.v1,this.v2,0xff00ff00, 0xffffff00, 0xff00ffff, 0xff0000ff,4,ImGui.ImDrawCornerFlags.All);
//         drawlist.AddRect(this.v1,this.v2,0xff0000ff, 4, ImGui.ImDrawCornerFlags.All);
//         let font=ImGui.GetFont();
//         if(ImGui.Button("AdvanceX")) {
//             console.log(font.IndexAdvanceX);
//             console.log(font.NotReadyChar);
//             //console.log("IndexAdvanceXSize", font.IndexAdvanceXSize);
//             console.log("SpaceX", font.SpaceX);
//             // for(let i=0;i<font.IndexAdvanceXSize;i++) {
//             //     console.log("AdvanceX " + i, font.GetAdvanceX(i));
//             // }
//         }
//         font.RenderText(drawlist, 16, this.v1, 0xffffffff, new ImGui.ImVec4(-100,-50,100,100),
//             "Hello, World! This is a good way to show", null, 0, true);
//         this.tm.rotate.SetRotate(time*0.001);
//         this.tm.translate.Set(200,200);
//         this.tm.scale=1+Math.sin(time*0.001)*0.25;
//         drawlist.Transform(this.tm, vstart);

//         drawlist.AddCallback((drawlist, cmd)=>{
//             //console.log("this is a drawlist callback " + cmd.UserCallbackData);
//         }, 2);


//         ImGui.End();
//         ImGui.ShowDemoWindow();
//         ImGui.ShowMetricsWindow();


//         ImGui.EndFrame();
//         ImGui.Render();

//         ImGui_Impl.ClearBuffer(new ImGui.ImVec4(0.25,0.25,0.25,1));
//         ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
//     }

// }

// window.addEventListener('DOMContentLoaded', async ()=>{
//     await ImGui.default();    
//     ImGui.CHECKVERSION();
//     console.log("ImGui.CreateContext() VERSION=", ImGui.VERSION);
//     console.log("imgui-ts version=", version);

//     ImGui.CreateContext();
//     ImGui.StyleColorsDark();
//     if(ImGui.isMobile.any())    {
//         ImGui_Impl.setCanvasScale(1);
//         ImGui_Impl.setFontScale(1.5)
//     }

//     const io:ImGui.IO=ImGui.GetIO();
//     let font =io.Fonts.AddFontDefault();
//     //font.FontName="Microsoft JhengHei";
//     font.FontName="Arial";
//     //font.FontName="sans-serif"
//     font.FontStyle="bold";
//     font.FontSize=16;
//     //font.Ascent=2.5;

//     let font2=ImGui.CreateFont("Microsoft JhengHei", 16, "bold");
//     font2.AddFontRange(0x4E00, 0x9FFF);
//     font.MergeFont(font2);

//     const canvas:HTMLCanvasElement=document.getElementById("canvas") as HTMLCanvasElement;
//     ImGui_Impl.Init(canvas);

//     _main=new Main;
//     window.requestAnimationFrame(_loop);
// });        



