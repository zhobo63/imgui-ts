import { ImFont } from "./imgui";
import {ImGui, ImGui_Impl } from "./index";

export enum EType
{
    eInput,
    eMultiLine, 
    ePassword,
}

export class Input
{
    constructor(type:EType)
    {
        let textCol=ImGui.GetStyleColorVec4(ImGui.ImGuiCol.Text);
        let textBg=ImGui.GetStyleColorVec4(ImGui.ImGuiCol.WindowBg);

        let input;
        switch(type)    {
        case EType.eInput:
            input=document.createElement('input');
            input.type='text';
            break;
        case EType.eMultiLine:
            input=document.createElement('textarea');
            input.style.resize='none';
            break;
        case EType.ePassword:
            input=document.createElement('input');
            input.type='password';
            break;
        }
        input.style.position='fixed';
        input.style.top=0 + 'px';
        input.style.left=0 + 'px';
        input.style.borderWidth='0';
        input.style.borderStyle='none';
        input.style.zIndex='999';
        input.style.backgroundColor=this.to_rgba(textBg);
        input.style.color=this.to_rgba(textCol);
        input.value="123";

        input.addEventListener('blur', (e)=>{this.onLostFocus(e)})

        document.body.appendChild(input);
        this._dom_input=input;
        this.setVisible(false);
    }

    private to_rgba(c:ImGui.ImVec4):string {
        return "rgba("+c.x*255+","+c.y*255+","+c.z*255+","+c.w*255+")";
    }

    public on_input: ((this: Input, text: string) => any) | null; 

    private onLostFocus(e:Event)
    {
        if(this.on_input)   {
            this.on_input(this._dom_input.value);
        }
        this.setVisible(false);        
    }
    public isMe(id:ImGui.ImGuiID):boolean {
        return this.isVisible && this._id==id;
    }

    public get Text():string {
        return this._dom_input.value;
    }
    public setRect(x:number, y:number, w:number, h:number)
    {
        let input=this._dom_input;
        input.style.left=x + 'px';
        input.style.top=y + 'px';
        input.style.width=w -5 + 'px';
        input.style.height=h -5 + 'px';
    }
    public setText(text:string, id:ImGui.ImGuiID, font:ImFont)
    {
        this._id=id;
        let input=this._dom_input;
        input.style.font=font.FontSize+"px "+font.FontName;
        input.value=text;
        this.setVisible(true);
    }
    public setVisible(b:boolean)
    {
        let input=this._dom_input;
        if(b) {
            ImGui_Impl.remove_key_event();
            input.style.display='inline-block';
            input.focus();
        }else {
            ImGui_Impl.add_key_event();
            input.style.display='none';
        }
        this.isVisible=b;
    }

    private _dom_input:HTMLInputElement|HTMLTextAreaElement;
    private _id:ImGui.ImGuiID;
    public isVisible:boolean=false;
}
