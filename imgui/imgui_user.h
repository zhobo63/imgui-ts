#ifndef _IMGUI_USER_H
#define _IMGUI_USER_H

#include <string>

#ifdef USE_EXTERNAL_FONT

struct ImFontAtlas
{
    ImFontAtlas();
    ~ImFontAtlas();

    ImFont* AddFontDefault(const ImFontConfig* font_cfg = NULL);
    bool IsBuilt() const { return true; }

    void GetTexDataAsAlpha8(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel);
    bool GetMouseCursorTexData(ImGuiMouseCursor cursor, ImVec2* out_offset, ImVec2* out_size, ImVec2 out_uv_border[2], ImVec2 out_uv_fill[2]);
    void BuildRenderDefaultTexData();
    void BuildRenderLinesTexData();

    ImFontAtlasFlags Flags = 0;         // Build flags (see ImFontAtlasFlags_)
    ImTextureID TexID = 0;              // User data to refer to the texture once it has been uploaded to user's graphic systems. It is passed back to you during rendering via the ImDrawCmd structure.
    int TexWidth=0;           // Texture width calculated during Build().
    int TexHeight=0;          // Texture height calculated during Build().
    ImVector<ImU8> TexPixels;

    bool Locked = false;
    ImVec2 TexUvWhitePixel;    // Texture coordinates to a white pixel
    ImVec4 TexUvLines[IM_DRAWLIST_TEX_LINES_WIDTH_MAX + 1];  // UVs for baked anti-aliased lines

    ImVector<ImFont*> Fonts;
};

struct ImFont
{
    int FontId;
    std::string FontStyle;
    std::string FontName;

    ImVector<float>             IndexAdvanceX;      // 12-16 // out //            // Sparse. Glyphs->AdvanceX in a directly indexable way (cache-friendly for CalcTextSize functions which only this this info, and are often bottleneck in large UI).
    float SpaceX[2];
    float                       FallbackAdvanceX;   // 4     // out // = FallbackGlyph->AdvanceX
    float                       FontSize;           // 4     // in  //            // Height of characters/line, set during loading (don't change after loading)

    ImVector<ImWchar>           IndexLookup;        // 12-16 // out //            // Sparse. Index glyphs by Unicode code-point.
    ImVector<ImFontGlyph>       Glyphs;             // 12-16 // out //            // All glyphs.
    const ImFontGlyph* FallbackGlyph;      // 4-8   // out // = FindGlyph(FontFallbackChar)

    ImFontAtlas* ContainerAtlas;     // 4-8   // out //            // What we has been loaded into
    ImFontConfig ConfigData[1];      // 4-8   // in  //            // Pointer within ContainerAtlas->ConfigData
    short        ConfigDataCount;    // 2     // in  // ~ 1        // Number of ImFontConfig involved in creating this font. Bigger than 1 when merging multiple font sources into one ImFont.

    ImWchar                     FallbackChar;       // 2     // out // = FFFD/'?' // Character used if a glyph isn't found.
    ImWchar                     EllipsisChar;       // 2     // out // = '...'    // Character used for ellipsis rendering.
    ImWchar                     DotChar;            // 2     // out // = '.'      // Character used for ellipsis rendering (if a single '...' character isn't found)
        
    float                       Scale;              // 4     // in  // = 1.f      // Base font scale, multiplied by the per-window font scale which you can adjust with SetWindowFontScale()
    float                       Ascent, Descent;    // 4+4   // out //            // Ascent: distance from top to bottom of e.g. 'A' [0..FontSize]
    int                         MetricsTotalSurface;// 4     // out //            // Total surface in pixels to get an idea of the font rasterization/texture cost (not exact, we approximate the cost of padding between glyphs)

    ImVector<ImFontGlyph>       GlyphsToCreate;
    ImVector<ImWchar>           NotReadyChar;

    struct ImFontRange
    {
        ImWchar start;
        ImWchar end;

        inline bool InRange(ImWchar ch) const {return ch>=start && ch<=end;}
    };

    ImVector<ImFont*> SubFonts;
    ImVector<ImFontRange> FontRange;

    ImFont();
    ~ImFont();

    void Initialize();

    IMGUI_API const ImFontGlyph* FindGlyph(ImWchar c) const;
    IMGUI_API const ImFontGlyph* FindGlyphNoFallback(ImWchar c) const;
    float GetCharAdvance(ImWchar c) const;
    bool IsLoaded() const { return true; }

    const char* CalcWordWrapPositionA(float scale, const char* text, const char* text_end, float wrap_width) const;
    IMGUI_API ImVec2 CalcTextSizeA(float size, float max_width, float wrap_width, const char* text_begin, const char* text_end = NULL, const char** remaining = NULL, bool *isReady = NULL) const; // utf8
    IMGUI_API void RenderChar(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, ImWchar c) const;
    IMGUI_API void RenderText(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, const ImVec4& clip_rect, const char* text_begin, const char* text_end, float wrap_width = 0.0f, bool cpu_fine_clip = false) const;

    IMGUI_API bool IsGlyphRangeUnused(unsigned int c_begin, unsigned int c_last) const { return false; }

    void CreateGlyph(const char *text_begin, const char* text_end);
    void GlyphCreated(const ImFontGlyph &glyph);
    void ClearGlyphCreated()    {GlyphsToCreate.clear();}

    void AddFontRange(ImWchar start, ImWchar end) {
        ImFontRange range;
        range.start=start;
        range.end=end;
        FontRange.push_back(range);
    }
    void ClearFontRange() {
        FontRange.clear();
    }
    void MergeFont(ImFont *font)
    {
        SubFonts.push_back(font);
    }
    void ClearSubFont() {
        SubFonts.clear();
    }
    bool InRange(ImWchar ch) const;

    std::string DebugName;
    const char* GetDebugName() {
        if(DebugName.empty())   {
            char buffer[64]={0};
            if(FontStyle.empty())   {
                sprintf(buffer, "%dpx %s", (int)FontSize, FontName.c_str());
            }else {
                sprintf(buffer, "%s %dpx %s",FontStyle.c_str(), (int)FontSize, FontName.c_str());
            }
            DebugName=buffer;
        }
        return DebugName.c_str();
    }
};

#endif

struct ImMat2
{
    float m11 = 1, m12 = 0;
    float m21 = 0, m22 = 1;

    inline void Identity()
    {
        m11 = 1; m12 = 0;
        m21 = 0; m22 = 1;
    }
    ImMat2 SetRotate(float rad);
    ImVec2 operator*(const ImVec2& p) const;
    ImMat2 operator*(const ImMat2& m) const;
};

struct ImTransform
{
    ImMat2 rotate;
    ImVec2 translate = ImVec2(0, 0);
    float scale = 1;

    ImVec2 operator*(const ImVec2& p) const;
    ImTransform operator*(const ImTransform& _tm) const;
    void Identity();
};


#endif
