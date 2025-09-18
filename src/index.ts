import * as ImGui from "./imgui"
import { ImVec4 } from "./imgui";
import * as ImGui_Impl from "./imgui_impl"

export {ImGui, ImGui_Impl, ImVec4}

export const version="0.1.49";

export const ImGuiTableFlagsDefault= 
    ImGui.ImGuiTableFlags.RowBg|
    ImGui.ImGuiTableFlags.Borders|
    ImGui.ImGuiTableFlags.Resizable;

export const ImColor_White:ImVec4=new ImVec4(1,1,1,1)
export const ImColor_Silver:ImVec4=new ImVec4(0.75,0.75,0.75,1)
export const ImColor_Gray:ImVec4=new ImVec4(0.5,0.5,0.5,1)
export const ImColor_Black:ImVec4=new ImVec4(0,0,0,1)
export const ImColor_Red:ImVec4=new ImVec4(1,0,0,1)
export const ImColor_Maroon:ImVec4=new ImVec4(0.5,0,0,1)
export const ImColor_Yellow:ImVec4=new ImVec4(1,1,0,1)
export const ImColor_Olive:ImVec4=new ImVec4(0.5,0.5,0,1)
export const ImColor_Lime:ImVec4=new ImVec4(0,1,0,1)
export const ImColor_Green:ImVec4=new ImVec4(0,0.5,0,1)
export const ImColor_Aqua:ImVec4=new ImVec4(0,1,1,1)
export const ImColor_Teal:ImVec4=new ImVec4(0,0.5,0.5,1)
export const ImColor_Blue:ImVec4=new ImVec4(0,0,1,1)
export const ImColor_Navy:ImVec4=new ImVec4(0,0,0.5,1)
export const ImColor_Fuchsia:ImVec4=new ImVec4(1,0,1,1)
export const ImColor_Purple:ImVec4=new ImVec4(0.5,0,0.5,1)
export const ImColor_DarkGray:ImVec4=new ImVec4(0.25,0.25,0.25,1)
export const ImColor_DarkGreen:ImVec4=new ImVec4(0,0.25,0,1)
export const ImColor_DarkTeal:ImVec4=new ImVec4(0,0.25,0.25,1)
export const ImColor_DarkOlive:ImVec4=new ImVec4(0.25,0.25,0,1)
export const ImColor_DarkPurple:ImVec4=new ImVec4(0.25,0,0.25,1)
export const ImColor_LightRed:ImVec4=new ImVec4(1,0.5,0.5,1)

export function ImGuiObject(obj:any, id:number=0):number
{
    if(obj===undefined)   {
        ImGui.Text("(undefined)");
        return id;
    }
    else if(obj==null)   {
        ImGui.Text("(null)");
        return id;
    }

    let is_array=Array.isArray(obj);
    
    ImGui.PushID(id);
    for(let key in obj) {
        let value=obj[key];
        let key_str=(is_array)?`[${key}]`:key;
        if(value==null) {
            ImGui.Text(key_str + ": (null)");
        }
        else if(Array.isArray(value))    {
            if(value.length>0) {
                if(ImGui.TreeNode(`${key_str}: [...]`)) {
                    id=ImGuiObject(value, id+1);
                    ImGui.TreePop();
                }
            }else {
                ImGui.Text(`${key_str}: []`);
            }
        }
        else if(typeof(value)==='object')    {
            if(Object.keys(value).length>0) {
                if(ImGui.TreeNode(`${key_str}: {...}`)) {
                    id=ImGuiObject(value, id+1);
                    ImGui.TreePop();
                }
            }else {
                ImGui.Text(`${key_str}: {}`)
            }
        }    
        else if(typeof(value)==='string')    {
            let v=(_:string=value as string):string=>obj[key]=_;
            //ImGui.SetNextItemWidth(100);
            ImGui.InputText(key_str, v);
        }    
        else if(typeof(value)==='number')    {
            let v=(_:number=value as number):number=>obj[key]=_;
            ImGui.SetNextItemWidth(100);
            ImGui.InputFloat(key_str, v);
        }
        else if(typeof(value)==='boolean')    {
            let v=(_:boolean=value as boolean):boolean=>obj[key]=_;
            ImGui.SetNextItemWidth(100);
            ImGui.Checkbox(key_str, v);
        }
        else if(typeof(value)==='function')    {
            //ImGui.Text(key_str + ": " + value);
        }
        else {            
            ImGui.Text(key_str + ": " + value);
        }
    }
    ImGui.PopID();
    return id;
}

export interface OnLoadable
{
    onload:any;
    onerror:any;
}

export function LoadImage<T extends OnLoadable>(src:T):Promise<T>
{
    return new Promise((resolve, reject)=>{
        src.onload=()=>resolve(src);
        src.onerror=reject;
    });
}

export async function FetchImage(url:string, onload: (buf:ArrayBuffer)=>any)
{
    let buf=await fetch(url).then(r=>{
        let buf = r.arrayBuffer().then(r=>{
            return r;
        });
        return buf;
    });

    if(onload) {
        onload(buf);
    }
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
//         FetchImage("res/CreditBoard.ui000.dds", (buf)=>{
//             console.log(buf);
//             this.compressed_tex=new ImGui_Impl.Texture;
//             this.compressed_tex.Update(buf);
//         });

//         // fetch('res/CreditBoard.ui000.dds').then(r=>{
//         //     let buf = r.arrayBuffer().then(r=>{
//         //         console.log(r);
//         //         this.compressed_tex=new ImGui_Impl.Texture;
//         //         this.compressed_tex.Update(r);
//         //     });
//         // });
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

//     compressed_tex:ImGui_Impl.Texture;
//     test_obj:{}={
//         A:null,
//         B:undefined,
//         C:[1,2,3],
//         D:{},
//         E:{
//             F:[{G:true},{},{}],
//             G:true,
//             H:()=>{},
//             C: [1,2,3],
//             S: "abcdef"
//         },
//     };
//     test_undef:{}=undefined

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

//         if(this.compressed_tex) {
//             ImGui.Image(this.compressed_tex._texture, 
//                 new ImGui.ImVec2(this.compressed_tex._width,this.compressed_tex._height));
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

//         ImGui.Begin("ImGuiObject");
//         let id=ImGuiObject(this.test_obj, 0);
//         id=ImGuiObject(this.test_undef, id+1);
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
//     io.ConfigWindowsMoveFromTitleBarOnly=true;
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



