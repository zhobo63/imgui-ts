#include "imgui.h"

#ifndef IMGUI_DEFINE_MATH_OPERATORS
#define IMGUI_DEFINE_MATH_OPERATORS
#endif
#include "imgui_internal.h"

#ifdef HAVE_IMGUI_DEMO
#include "imgui_demo.cpp"
#endif

extern ImGuiContext*   GImGui;

ImFont* GetCurrentFont()
{
	return GImGui->Font;
}

#ifdef USE_EXTERNAL_FONT

const int FONT_ATLAS_DEFAULT_TEX_DATA_W=108;
const int FONT_ATLAS_DEFAULT_TEX_DATA_H=27;

static const char FONT_ATLAS_DEFAULT_TEX_DATA_PIXELS[FONT_ATLAS_DEFAULT_TEX_DATA_W * FONT_ATLAS_DEFAULT_TEX_DATA_H + 1] =
{
	"..-         -XXXXXXX-    X    -           X           -XXXXXXX          -          XXXXXXX-     XX          "
	"..-         -X.....X-   X.X   -          X.X          -X.....X          -          X.....X-    X..X         "
	"---         -XXX.XXX-  X...X  -         X...X         -X....X           -           X....X-    X..X         "
	"X           -  X.X  - X.....X -        X.....X        -X...X            -            X...X-    X..X         "
	"XX          -  X.X  -X.......X-       X.......X       -X..X.X           -           X.X..X-    X..X         "
	"X.X         -  X.X  -XXXX.XXXX-       XXXX.XXXX       -X.X X.X          -          X.X X.X-    X..XXX       "
	"X..X        -  X.X  -   X.X   -          X.X          -XX   X.X         -         X.X   XX-    X..X..XXX    "
	"X...X       -  X.X  -   X.X   -    XX    X.X    XX    -      X.X        -        X.X      -    X..X..X..XX  "
	"X....X      -  X.X  -   X.X   -   X.X    X.X    X.X   -       X.X       -       X.X       -    X..X..X..X.X "
	"X.....X     -  X.X  -   X.X   -  X..X    X.X    X..X  -        X.X      -      X.X        -XXX X..X..X..X..X"
	"X......X    -  X.X  -   X.X   - X...XXXXXX.XXXXXX...X -         X.X   XX-XX   X.X         -X..XX........X..X"
	"X.......X   -  X.X  -   X.X   -X.....................X-          X.X X.X-X.X X.X          -X...X...........X"
	"X........X  -  X.X  -   X.X   - X...XXXXXX.XXXXXX...X -           X.X..X-X..X.X           - X..............X"
	"X.........X -XXX.XXX-   X.X   -  X..X    X.X    X..X  -            X...X-X...X            -  X.............X"
	"X..........X-X.....X-   X.X   -   X.X    X.X    X.X   -           X....X-X....X           -  X.............X"
	"X......XXXXX-XXXXXXX-   X.X   -    XX    X.X    XX    -          X.....X-X.....X          -   X............X"
	"X...X..X    ---------   X.X   -          X.X          -          XXXXXXX-XXXXXXX          -   X...........X "
	"X..X X..X   -       -XXXX.XXXX-       XXXX.XXXX       -------------------------------------    X..........X "
	"X.X  X..X   -       -X.......X-       X.......X       -    XX           XX    -           -    X..........X "
	"XX    X..X  -       - X.....X -        X.....X        -   X.X           X.X   -           -     X........X  "
	"      X..X          -  X...X  -         X...X         -  X..X           X..X  -           -     X........X  "
	"       XX           -   X.X   -          X.X          - X...XXXXXXXXXXXXX...X -           -     XXXXXXXXXX  "
	"------------        -    X    -           X           -X.....................X-           ------------------"
	"                    ----------------------------------- X...XXXXXXXXXXXXX...X -                             "
	"                                                      -  X..X           X..X  -                             "
	"                                                      -   X.X           X.X   -                             "
	"                                                      -    XX           XX    -                             "
};

static const ImVec2 FONT_ATLAS_DEFAULT_TEX_CURSOR_DATA[ImGuiMouseCursor_COUNT][3] =
{
	// Pos ........ Size ......... Offset ......
	{ ImVec2(0,3), ImVec2(12,19), ImVec2(0, 0) }, // ImGuiMouseCursor_Arrow
	{ ImVec2(13,0), ImVec2(7,16), ImVec2(1, 8) }, // ImGuiMouseCursor_TextInput
	{ ImVec2(31,0), ImVec2(23,23), ImVec2(11,11) }, // ImGuiMouseCursor_ResizeAll
	{ ImVec2(21,0), ImVec2(9,23), ImVec2(4,11) }, // ImGuiMouseCursor_ResizeNS
	{ ImVec2(55,18),ImVec2(23, 9), ImVec2(11, 4) }, // ImGuiMouseCursor_ResizeEW
	{ ImVec2(73,0), ImVec2(17,17), ImVec2(8, 8) }, // ImGuiMouseCursor_ResizeNESW
	{ ImVec2(55,0), ImVec2(17,17), ImVec2(8, 8) }, // ImGuiMouseCursor_ResizeNWSE
	{ ImVec2(91,0), ImVec2(17,22), ImVec2(5, 0) }, // ImGuiMouseCursor_Hand
};



///////////////////////////////////////////////////////////////////////
// ImFontAtlas
///////////////////////////////////////////////////////////////////////

ImFontAtlas::ImFontAtlas()
{
	TexWidth = 256;
	TexHeight = 64;
}
ImFontAtlas::~ImFontAtlas()
{
    for(int i=0;i<Fonts.size();i++) {
        IM_DELETE(Fonts[i]);
    }
	Fonts.clear();
}

ImFont* ImFontAtlas::AddFontDefault(const ImFontConfig* _font_cfg)
{
    ImFont *font=IM_NEW(ImFont);
	font->Initialize();
    ImFontConfig &font_cfg=font->ConfigData[0];
    font->ConfigDataCount=1;

    font_cfg = _font_cfg ? *_font_cfg : ImFontConfig();
    if (!_font_cfg)
    {
        font_cfg.OversampleH = font_cfg.OversampleV = 1;
        font_cfg.PixelSnapH = true;
    }
    if (font_cfg.SizePixels <= 0.0f)
        font_cfg.SizePixels = 14.0f * 1.0f;
    if (font_cfg.Name[0] == '\0') {
        //ImFormatString(font_cfg.Name, IM_ARRAYSIZE(font_cfg.Name), "ProggyClean.ttf, %dpx", (int)font_cfg.SizePixels);
		ImFormatString(font_cfg.Name, IM_ARRAYSIZE(font_cfg.Name), "sans-serif");
	}
    font_cfg.EllipsisChar = (ImWchar)0x0085;
    font_cfg.GlyphOffset.y = 1.0f * IM_FLOOR(font_cfg.SizePixels / 13.0f);  // Add +1 offset per 13 units

	font->FontName=font_cfg.Name;
    font->ContainerAtlas=this;
    font->FontSize=font_cfg.SizePixels;
	font->Descent=1;
    Fonts.push_back(font);
	return font;
}

bool ImFontAtlas::GetMouseCursorTexData(ImGuiMouseCursor cursor, ImVec2* out_offset, ImVec2* out_size, ImVec2 out_uv_border[2], ImVec2 out_uv_fill[2])
{
	if (cursor <= ImGuiMouseCursor_None || cursor >= ImGuiMouseCursor_COUNT)
		return false;
	if (Flags & ImFontAtlasFlags_NoMouseCursors)
		return false;
	float TexUvScaleW = 1.0f / TexWidth;
	float TexUvScaleH = 1.0f / TexHeight;

	ImVec2 pos = FONT_ATLAS_DEFAULT_TEX_CURSOR_DATA[cursor][0] + ImVec2((float)20, (float)0);
	ImVec2 size = FONT_ATLAS_DEFAULT_TEX_CURSOR_DATA[cursor][1];
	*out_size = size;
	*out_offset = FONT_ATLAS_DEFAULT_TEX_CURSOR_DATA[cursor][2];
	out_uv_border[0] = (pos)*TexUvScaleW;
	out_uv_border[1] = (pos + size) * TexUvScaleH;
	pos.x += FONT_ATLAS_DEFAULT_TEX_DATA_W + 1;
	out_uv_fill[0] = (pos)*TexUvScaleW;
	out_uv_fill[1] = (pos + size) * TexUvScaleH;

	return true;
}

void ImFontAtlas::BuildRenderDefaultTexData()
{
	ImU8* pb = TexPixels.Data + 64;
	ImU8* pw = TexPixels.Data + 64 + 32 * TexWidth;
	for (int y = 0; y < FONT_ATLAS_DEFAULT_TEX_DATA_H; y++) {
		for (int x = 0; x < FONT_ATLAS_DEFAULT_TEX_DATA_W; x++) {
			switch (FONT_ATLAS_DEFAULT_TEX_DATA_PIXELS[y * FONT_ATLAS_DEFAULT_TEX_DATA_W + x]) {
			case '.':
				pb[x] = 0xFF;
				pw[x] = 0x00;
				break;
			case 'X':
				pb[x] = 0x00;
				pw[x] = 0xFF;
				break;
			default:
				pb[x] = 0x00;
				pw[x] = 0x00;
				break;
			}
		}		
		pb += TexWidth;
		pw += TexWidth;
	}	
	TexUvWhitePixel.x = 64.5f / TexWidth;
	TexUvWhitePixel.y = 0.5f / TexHeight;
}

void ImFontAtlas::GetTexDataAsAlpha8(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel)
{
	if(Fonts.empty())	{
		AddFontDefault();
	}
    if(TexPixels.empty())   {
        TexPixels.resize(TexWidth*TexHeight);
   	    BuildRenderLinesTexData();
	    BuildRenderDefaultTexData();
    }
    *out_pixels=TexPixels.Data;
    *out_width=TexWidth;
    *out_height=TexHeight;
    *out_bytes_per_pixel=1;
}

void ImFontAtlas::BuildRenderLinesTexData()
{
	if (Flags & ImFontAtlasFlags_NoBakedLines)
		return;
	int width = 64;
	float TexUvScaleW = 1.0f / TexWidth;
	float TexUvScaleH = 1.0f / TexHeight;

	for (unsigned int n = 0; n < IM_DRAWLIST_TEX_LINES_WIDTH_MAX + 1; n++) // +1 because of the zero-width row
	{
		// Each line consists of at least two empty pixels at the ends, with a line of solid pixels in the middle
		unsigned int y = n;
		unsigned int line_width = n;
		unsigned int pad_left = (width - line_width) / 2;
		unsigned int pad_right = width - (pad_left + line_width);

		// Write each slice
		{
			ImU8* write_ptr = &TexPixels.Data[y * TexWidth];
			for (unsigned int i = 0; i < pad_left; i++)
				*(write_ptr + i) = 0x00;

			for (unsigned int i = 0; i < line_width; i++)
				*(write_ptr + pad_left + i) = 0xFF;

			for (unsigned int i = 0; i < pad_right; i++)
				*(write_ptr + pad_left + line_width + i) = 0x00;
		}

		// Calculate UVs for this line
		ImVec2 uv0 = ImVec2((float)(pad_left - 1) * TexUvScaleW, (float)(y)*TexUvScaleH);
		ImVec2 uv1 = ImVec2((float)(pad_left + line_width + 1) * TexUvScaleW, (float)(y + 1) * TexUvScaleH);
		float half_v = (uv0.y + uv1.y) * 0.5f; // Calculate a constant V in the middle of the row to avoid sampling artifacts
		TexUvLines[n] = ImVec4(uv0.x, half_v, uv1.x, half_v);
	}
}

///////////////////////////////////////////////////////////////////////
// ImFont
///////////////////////////////////////////////////////////////////////

inline void SetBit(ImU8 *buf,int i)	{buf[i>>3]|=(1<<((i)&7));}
inline ImU8 GetBit(ImU8 *buf,int i)	{return (ImU8)(*(buf+((i)>>3))&(1<<((i)&7)));}

ImFont::ImFont()
{
	Scale = 1;
	Ascent=Descent=0;
	SpaceX[0]=SpaceX[1]=0;
	MetricsTotalSurface=0;
}
ImFont::~ImFont()
{

}

void ImFont::Initialize()
{
	Glyphs.push_back(ImFontGlyph());	//0	Uncreated
	Glyphs.push_back(ImFontGlyph());	//1 Wait For Create
    IndexAdvanceX.resize(256);
    IndexLookup.resize(65536);
    memset(IndexLookup.Data, 0, sizeof(ImWchar)*IndexLookup.size());
}

const ImFontGlyph* ImFont::FindGlyph(ImWchar c) const
{
	if(IndexLookup.empty())	{
		return FallbackGlyph;
	}
    ImWchar &find=(ImWchar&)(const ImWchar&)IndexLookup[c];
    if(find==0) {
        ImFontGlyph glyph;
        glyph.Char=c;
        ((ImFont*)this)->GlyphsToCreate.push_back(glyph);
        find=1;
        return &Glyphs[0];
    }else if(find==1)   {
        return &Glyphs[0];
    }
	const ImFontGlyph& cglyph = Glyphs[find];
	return &cglyph;
}
const ImFontGlyph* ImFont::FindGlyphNoFallback(ImWchar c) const
{
	return FindGlyph(c);
}

const char* ImFont::CalcWordWrapPositionA(float scale, const char* text, const char* text_end, float wrap_width) const
{
	// Simple word-wrapping for English, not full-featured. Please submit failing cases!
	// FIXME: Much possible improvements (don't cut things like "word !", "word!!!" but cut within "word,,,,", more sensible support for punctuations, support for Unicode punctuations, etc.)

	// For references, possible wrap point marked with ^
	//  "aaa bbb, ccc,ddd. eee   fff. ggg!"
	//      ^    ^    ^   ^   ^__    ^    ^

	// List of hardcoded separators: .,;!?'"

	// Skip extra blanks after a line returns (that includes not counting them in width computation)
	// e.g. "Hello    world" --> "Hello" "World"

	// Cut words that cannot possibly fit within one line.
	// e.g.: "The tropical fish" with ~5 characters worth of width --> "The tr" "opical" "fish"

	float line_width = 0.0f;
	float word_width = 0.0f;
	float blank_width = 0.0f;
	wrap_width /= scale; // We work with unscaled widths to avoid scaling every characters

	const char* word_end = text;
	const char* prev_word_end = NULL;
	bool inside_word = true;

	const char* s = text;
	while (s < text_end)
	{
		unsigned int c = (unsigned int)*s;
		const char* next_s;
		if (c < 0x80)
			next_s = s + 1;
		else
			next_s = s + ImTextCharFromUtf8(&c, s, text_end);
		if (c == 0)
			break;

		if (c < 32)
		{
			if (c == '\n')
			{
				line_width = word_width = blank_width = 0.0f;
				inside_word = true;
				s = next_s;
				continue;
			}
			if (c == '\r')
			{
				s = next_s;
				continue;
			}
		}

		float char_width = ((ImFont*)this)->GetCharAdvance(c);
		if (ImCharIsBlankW(c))
		{
			if (inside_word)
			{
				line_width += blank_width;
				blank_width = 0.0f;
				word_end = s;
			}
			blank_width += char_width;
			inside_word = false;
		}
		else
		{
			word_width += char_width;
			if (inside_word)
			{
				word_end = next_s;
			}
			else
			{
				prev_word_end = word_end;
				line_width += word_width + blank_width;
				word_width = blank_width = 0.0f;
			}

			// Allow wrapping after punctuation.
			inside_word = (c != '.' && c != ',' && c != ';' && c != '!' && c != '?' && c != '\"');
		}

		// We ignore blank width at the end of the line (they can be skipped)
		if (line_width + word_width > wrap_width)
		{
			// Words that cannot possibly fit within an entire line will be cut anywhere.
			if (word_width < wrap_width)
				s = prev_word_end ? prev_word_end : word_end;
			break;
		}

		s = next_s;
	}

	return s;
}

float ImFont::GetCharAdvance(ImWchar c) const
{
	if(IndexAdvanceX.empty())
		return FallbackAdvanceX;
	return c < 256 ? IndexAdvanceX[c] : IndexAdvanceX[0];
}

ImVec2 ImFont::CalcTextSizeA(float size, float max_width, float wrap_width, const char* text_begin, const char* text_end, const char** remaining) const // utf8
{
	if (!text_end)
		text_end = text_begin + strlen(text_begin); // FIXME-OPT: Need to avoid this.
	

	const float line_height = size;
	const float scale = size / FontSize;

	ImVec2 text_size = ImVec2(0, 0);
	float line_width = 0.0f;

	const bool word_wrap_enabled = (wrap_width > 0.0f);
	const char* word_wrap_eol = NULL;

	const char* s = text_begin;
	while (s < text_end)
	{
		if (word_wrap_enabled)
		{
			// Calculate how far we can render. Requires two passes on the string data but keeps the code simple and not intrusive for what's essentially an uncommon feature.
			if (!word_wrap_eol)
			{
				word_wrap_eol = CalcWordWrapPositionA(scale, s, text_end, wrap_width - line_width);
				if (word_wrap_eol == s) // Wrap_width is too small to fit anything. Force displaying 1 character to minimize the height discontinuity.
					word_wrap_eol++;    // +1 may not be a character start point in UTF-8 but it's ok because we use s >= word_wrap_eol below
			}

			if (s >= word_wrap_eol)
			{
				if (text_size.x < line_width)
					text_size.x = line_width;
				text_size.y += line_height;
				line_width = 0.0f;
				word_wrap_eol = NULL;

				// Wrapping skips upcoming blanks
				while (s < text_end)
				{
					const char c = *s;
					if (ImCharIsBlankA(c)) { s++; }
					else if (c == '\n') { s++; break; }
					else { break; }
				}
				continue;
			}
		}

		// Decode and advance source
		const char* prev_s = s;
		unsigned int c = (unsigned int)*s;
		if (c < 0x80)
		{
			s += 1;
		}
		else
		{
			s += ImTextCharFromUtf8(&c, s, text_end);
			if (c == 0) // Malformed UTF-8?
				break;
		}

		if (c < 32)
		{
			if (c == '\n')
			{
				text_size.x = ImMax(text_size.x, line_width);
				text_size.y += line_height;
				line_width = 0.0f;
				continue;
			}
			if (c == '\r')
				continue;
		}

		const float char_width = GetCharAdvance(c);
		if (line_width + char_width >= max_width)
		{
			s = prev_s;
			break;
		}

		line_width += char_width;
	}

	if (text_size.x < line_width)
		text_size.x = line_width;

	if (line_width > 0 || text_size.y == 0.0f)
		text_size.y += line_height;

	if (remaining)
		*remaining = s;

	return text_size;
}
void ImFont::RenderChar(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, ImWchar c) const
{
	const ImFontGlyph *glyph=FindGlyph(c);

	ImVec2 px(pos.x+glyph->X0, pos.y+glyph->Y0);
	ImVec2 ps(px.x + glyph->X1, px.y + glyph->Y1);
	ImVec2 uv0(glyph->U0, glyph->V0);
	ImVec2 uv1(glyph->U1, glyph->V1);
	draw_list->AddImage(glyph->TexID, px, ps, uv0, uv1, col);
}
void ImFont::RenderText(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, const ImVec4& clip_rect, const char* text_begin, const char* text_end, float wrap_width, bool cpu_fine_clip) const
{
	if (!text_end)
		text_end = text_begin + strlen(text_begin); // ImGui:: functions generally already provides a valid text_end, so this is merely to handle direct calls.

	// Align to be pixel perfect
	pos.x = IM_FLOOR(pos.x);
	pos.y = IM_FLOOR(pos.y);
	float x = pos.x;
	float y = pos.y;
	if (y > clip_rect.w)
		return;
	const float scale = size / FontSize;
	const float line_height = FontSize * scale;
	const bool word_wrap_enabled = (wrap_width > 0.0f);
	const char* word_wrap_eol = NULL;

	// Fast-forward to first visible line
	const char* s = text_begin;
	if (y + line_height < clip_rect.y && !word_wrap_enabled)
		while (y + line_height < clip_rect.y && s < text_end)
		{
			s = (const char*)memchr(s, '\n', text_end - s);
			s = s ? s + 1 : text_end;
			y += line_height;
		}

	// For large text, scan for the last visible line in order to avoid over-reserving in the call to PrimReserve()
	// Note that very large horizontal line will still be affected by the issue (e.g. a one megabyte string buffer without a newline will likely crash atm)
	if (text_end - s > 10000 && !word_wrap_enabled)
	{
		const char* s_end = s;
		float y_end = y;
		while (y_end < clip_rect.w && s_end < text_end)
		{
			s_end = (const char*)memchr(s_end, '\n', text_end - s_end);
			s_end = s_end ? s_end + 1 : text_end;
			y_end += line_height;
		}
		text_end = s_end;
	}
	if (s == text_end)
		return;

	// Reserve vertices for remaining worse case (over-reserving is useful and easily amortized)
	//const int vtx_count_max = (int)(text_end - s) * 4;
	//const int idx_count_max = (int)(text_end - s) * 6;
	//const int idx_expected_size = draw_list->IdxBuffer.Size + idx_count_max;
	//draw_list->PrimReserve(idx_count_max, vtx_count_max);

	//ImDrawVert* vtx_write = draw_list->_VtxWritePtr;
	//ImDrawIdx* idx_write = draw_list->_IdxWritePtr;
	//unsigned int vtx_current_idx = draw_list->_VtxCurrentIdx;

	//const ImU32 col_untinted = col | ~IM_COL32_A_MASK;

	while (s < text_end)
	{
		if (word_wrap_enabled)
		{
			// Calculate how far we can render. Requires two passes on the string data but keeps the code simple and not intrusive for what's essentially an uncommon feature.
			if (!word_wrap_eol)
			{
				word_wrap_eol = CalcWordWrapPositionA(scale, s, text_end, wrap_width - (x - pos.x));
				if (word_wrap_eol == s) // Wrap_width is too small to fit anything. Force displaying 1 character to minimize the height discontinuity.
					word_wrap_eol++;    // +1 may not be a character start point in UTF-8 but it's ok because we use s >= word_wrap_eol below
			}

			if (s >= word_wrap_eol)
			{
				x = pos.x;
				y += line_height;
				word_wrap_eol = NULL;

				// Wrapping skips upcoming blanks
				while (s < text_end)
				{
					const char c = *s;
					if (ImCharIsBlankA(c)) { s++; }
					else if (c == '\n') { s++; break; }
					else { break; }
				}
				continue;
			}
		}

		// Decode and advance source
		unsigned int c = (unsigned int)*s;
		if (c < 0x80)
		{
			s += 1;
		}
		else
		{
			s += ImTextCharFromUtf8(&c, s, text_end);
			if (c == 0) // Malformed UTF-8?
				break;
		}

		if (c < 32)
		{
			if (c == '\n')
			{
				x = pos.x;
				y += line_height;
				if (y > clip_rect.w)
					break; // break out of main loop
				continue;
			}
			if (c == '\r')
				continue;
		}

        const ImFontGlyph *glyph=FindGlyph(c);

		ImVec2 px(x+glyph->X0, y+glyph->Y0);
		ImVec2 ps(px.x + glyph->X1, px.y + glyph->Y1);
		ImVec2 uv0(glyph->U0, glyph->V0);
		ImVec2 uv1(glyph->U1, glyph->V1);
		draw_list->AddImage(glyph->TexID, px, ps, uv0, uv1, col);
		x += glyph->AdvanceX;
	}
}

void ImFont::GlyphCreated(const ImFontGlyph &_glyph)
{
	Glyphs.push_back(_glyph);
	IndexLookup[_glyph.Char]=Glyphs.size()-1;
	if(_glyph.Char<256)	{
		IndexAdvanceX[_glyph.Char]=_glyph.AdvanceX;
	}else {
		IndexAdvanceX[0]=_glyph.AdvanceX;
	}
	for(int i=0;i<GlyphsToCreate.size();i++)	{
		if(GlyphsToCreate[i].Char==_glyph.Char)	{
			GlyphsToCreate[i]=GlyphsToCreate.back();
			GlyphsToCreate.pop_back();
			break;
		}
	}
}

#endif
