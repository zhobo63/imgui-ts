CC = emcc
CXX = em++

OUT=../../src/bind-imgui.js
FLAGS = -Wall -Wformat -Os

INC=-I../
EMS=
EMS += -s ALLOW_MEMORY_GROWTH=1
EMS += -s WASM=1
EMS += -s DISABLE_EXCEPTION_CATCHING=1 -s NO_EXIT_RUNTIME=0
EMS += -s ASSERTIONS=1
EMS += -s FILESYSTEM=0 -DIMGUI_DISABLE_FILE_FUNCTIONS
EMS += -s EMBIND_STD_STRING_IS_UTF8=1
EMS += -s SINGLE_FILE=1
EMS += -s MODULARIZE=1
EMS += -s ENVIRONMENT=web
LIBS += $(EMS)


SRC=imgui.o imgui_draw.o imgui_tables.o imgui_widgets.o \
	bind-imgui.o imgui_user.o

%.o: ../%.cpp
	$(CXX) $(FLAGS) $(INC) -c -o $@ $<

%.o: ./%.cpp
	$(CXX) $(FLAGS) $(INC) -c -o $@ $<


all: $(SRC)
	$(CC) $(INC) --bind -o $(OUT) $(SRC) $(LIBS)

clean:
	rm -f *.o
	rm -f *.wasm
	rm -f *.js
	