import * as ImGui from './imgui'

export class Input
{
    constructor(multiline:boolean)
    {
        let textCol=ImGui.GetStyleColorVec4(ImGui.ImGuiCol.Text);
        let textBg=ImGui.GetStyleColorVec4(ImGui.ImGuiCol.WindowBg);

        let input;
        if(multiline)   {
            input=document.createElement('textarea');
            input.style.resize='none';
        }
        else 
        {
            input=document.createElement('input');
            input.type='text';
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

    public setRect(x:number, y:number, w:number, h:number)
    {
        let input=this._dom_input;
        input.style.left=x + 'px';
        input.style.top=y + 'px';
        input.style.width=w + 'px';
        input.style.height=h + 'px';
    }
    public setText(text:string)
    {
        let input=this._dom_input;
        input.value=text;
    }
    public setVisible(b:boolean)
    {
        let input=this._dom_input;
        if(b) {
            input.style.display='inline-block';
            input.focus();
        }else {
            input.style.display='none';
        }
        this.isVisible=b;
    }

    private _dom_input:HTMLInputElement|HTMLTextAreaElement;
    public isVisible:boolean=false;
}
