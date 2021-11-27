import { ImFont, ImFontGlyph } from './imgui'
import { Texture } from './imgui_impl';
import { ImGui, ImGui_Impl } from './index';

const FONT_SPACE=3;

export class TexturePage
{
    constructor(tex_size:number, font:ImFont)
    {
        let font_size=font.FontSize;
        this.FontName= font_size + "px " + font.FontName;
        this.Scale=ImGui_Impl.GetCanvasScale();
        this.TextureSize=tex_size;
        this.FontSize=font_size;
        this.SpaceX=font.SpaceX;
        this.FontImageSize=Math.ceil((font_size+FONT_SPACE)*this.Scale);

        this.PixelData=new Uint16Array(tex_size*tex_size);

        this.CharsPerRow=Math.floor(tex_size/this.FontImageSize);
        this.MaxCharCount=this.CharsPerRow*this.CharsPerRow;
        this.Current=0;

        let gl=ImGui_Impl.gl;
        this.Texure=new Texture();
        this.Texure._srcType=gl.UNSIGNED_SHORT_4_4_4_4;
        if(this.Scale==window.devicePixelRatio) {
            this.Texure._minFilter=gl.NEAREST;
            this.Texure._magFilter=gl.NEAREST;
        }
        this.Texure.Update(this.PixelData, {width:tex_size, height:tex_size});
    }

    Destroy()
    {
        this.Texure.Destroy();
    }

    Create(glyph:ImFontGlyph, ctx: CanvasRenderingContext2D):ImFontGlyph {
        const image_size=this.FontImageSize;
        const cur=this.Current;
        this.Current++;
        const ix=cur%this.CharsPerRow;
        const iy=Math.floor(cur/this.CharsPerRow);
        const px=ix*(image_size);
        const py=iy*(image_size);
        const text=String.fromCharCode(glyph.Char);
        glyph.TextureID=this.Texure._texture;

        ctx.save();
        ctx.canvas.width=image_size;
        ctx.canvas.height=image_size;
        ctx.textAlign='left';
        ctx.textBaseline='top';
        ctx.font=this.FontName;
        ctx.clearRect(0,0,image_size,image_size);
        ctx.scale(this.Scale, this.Scale);
        ctx.fillText(text, 1, 1);
        //ctx.strokeRect(0,0,image_size-FONT_SPACE, image_size-FONT_SPACE);
        let m=ctx.measureText(text);
        ctx.restore();
        const img_data=ctx.getImageData(0,0,image_size, image_size);
        const img_data_u32=new Uint32Array(img_data.data.buffer);

        for(let y=0;y<image_size;y++)   {
            for(let x=0;x<image_size;x++)   {
                this.PixelData[(py+y)*this.TextureSize+px+x]=0xFFF0|
                (((img_data_u32[y*image_size+x]>>24)&0xFF)>>4);
            }
        }        

        glyph.X0=0;
        glyph.Y0=0;
        glyph.X1=m.width+2;
        glyph.Y1=this.FontSize;
        glyph.AdvanceX=(m.width)+(glyph.Char<256?this.SpaceX[0]:this.SpaceX[1]);
        let uv_scale=1.0/(this.TextureSize);
        glyph.U0=(px)*uv_scale;
        glyph.V0=(py)*uv_scale;
        glyph.U1=(px+(m.width+2)*this.Scale)*uv_scale;
        glyph.V1=(py+this.FontSize*this.Scale)*uv_scale;

        this.Dirty=true;
        return glyph;
    }

    UpdateTexture() {
        this.Dirty=false;
        console.log(this.FontName + " UpdateTexture");
        this.Texure.Update(this.PixelData);
    }

    get IsAvailable():boolean {return this.Current<this.MaxCharCount;}    

    FontName:string;
    Scale:number;
    TextureSize:number;
    FontSize:number;
    FontImageSize:number;
    PixelData:Uint16Array;
    Current:number;
    MaxCharCount:number;
    CharsPerRow:number;
    Texure:Texture;
    Dirty:boolean=false;
    SpaceX:number[];
}

export class Font
{
    constructor()
    {
        let canvas=document.createElement("canvas");
        canvas.style.backgroundColor="transparent";
        canvas.style.position='absolute';
        canvas.style.top='0px';
        canvas.style.left='0px';
        canvas.style.borderWidth='0';
        canvas.style.borderStyle='none';
        canvas.style.pointerEvents='none';
        
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
    }

    Destroy() {
        this.texturePage.forEach(page=>{
            page.Destroy();
        })
        this.texturePage=[];
    }

    Create(glyph: ImFontGlyph, font:ImFont):ImFontGlyph
    {
        let page=null;
        for(let page2 of this.texturePage)   {
            if(page2.FontSize==font.FontSize&&page2.IsAvailable)  {
                page=page2;
                break;
            }
        }
        if(page==null)  {
            page=new TexturePage(512, font);
            this.texturePage.push(page);
        }
        this.canvas.width=font.FontSize;
        this.canvas.height=font.FontSize;

        return page.Create(glyph, this.ctx);
    }
    async UpdateTexture() {
        this.texturePage.forEach(page=>{
            if(page.Dirty)  {
                page.UpdateTexture();
            }
        })
    }

    texturePage:TexturePage[]=[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}