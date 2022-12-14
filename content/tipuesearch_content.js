var tipuesearch = {"pages": [{'title': 'About', 'text': 'cmsite: wcms use  https://github.com/mdecycu/cmsimde  as submodule \n \n 我的倉儲: https://github.com/mdecp2022/site-kevingg601 \n 我的倉儲修改內容: https://github.com/mdecp2022/site-kevingg601/commits/main \n', 'tags': '', 'url': 'About.html'}, {'title': 'HW', 'text': '', 'tags': '', 'url': 'HW.html'}, {'title': 'w13', 'text': 'temp \n \'\'\'\nf =c*9/5 + 32\nc = (f-32)*5/9\n\'\'\'\nc = input("請輸入攝氏溫度")\n#print(type(c))\nc = float(c)\nprint("你輸入的攝氏溫度: " + str(c), "等於華氏溫度: " + str(c*9/5 +32)) \n 俄羅斯方塊 \n # from https://levelup.gitconnected.com/writing-tetris-in-python-2a16bddb5318\n# 改為可自動執行模式\nimport random\n# 以下為 Brython 新增\nfrom browser import document as doc\nfrom browser import html\nimport browser.timer\n\ndef intersects(game_field, x, y, game_width, game_height, game_figure_image):\n    intersection = False\n    for i in range(4):\n        for j in range(4):\n            if i * 4 + j in game_figure_image:\n                if i + y > game_height - 1 or \\\n                        j + x > game_width - 1 or \\\n                        j + x < 0 or \\\n                        game_field[i + y][j + x] > 0:\n                    intersection = True\n    return intersection\n\ndef simulate(game_field, x, y, game_width, game_height, game_figure_image):\n    while not intersects(game_field, x, y, game_width, game_height, game_figure_image):\n        y += 1\n    y -= 1\n\n    height = game_height\n    holes = 0\n    filled = []\n    breaks = 0\n    for i in range(game_height-1, -1, -1):\n        it_is_full = True\n        prev_holes = holes\n        for j in range(game_width):\n            u = \'_\'\n            if game_field[i][j] != 0:\n                u = "x"\n            for ii in range(4):\n                for jj in range(4):\n                    if ii * 4 + jj in game_figure_image:\n                        if jj + x == j and ii + y == i:\n                            u = "x"\n\n            if u == "x" and i < height:\n                height = i\n            if u == "x":\n                filled.append((i, j))\n                for k in range(i, game_height):\n                    if (k, j) not in filled:\n                        holes += 1\n                        filled.append((k,j))\n            else:\n                it_is_full = False\n        if it_is_full:\n            breaks += 1\n            holes = prev_holes\n\n    return holes, game_height-height-breaks\n\ndef best_rotation_position(game_field, game_figure, game_width, game_height):\n    best_height = game_height\n    best_holes = game_height*game_width\n    best_position = None\n    best_rotation = None\n\n    for rotation in range(len(game_figure.figures[game_figure.type])):\n        fig = game_figure.figures[game_figure.type][rotation]\n        for j in range(-3, game_width):\n            if not intersects(\n                    game_field,\n                    j,\n                    0,\n                    game_width,\n                    game_height,\n                    fig):\n                holes, height = simulate(\n                    game_field,\n                    j,\n                    0,\n                    game_width,\n                    game_height,\n                    fig\n                )\n                if best_position is None or best_holes > holes or \\\n                    best_holes == holes and best_height > height:\n                    best_height = height\n                    best_holes = holes\n                    best_position = j\n                    best_rotation = rotation\n    return best_rotation, best_position\n\n# 建立一個自動執行的函式\n# step 1\n\'\'\'\ndef run_ai():\n    game.rotate()\n\'\'\'\n#step 2\ndef run_ai(game_field, game_figure, game_width, game_height):\n    rotation, position = best_rotation_position(game_field, game_figure, game_width, game_height)\n    if game_figure.rotation != rotation:\n        game.rotate()\n    elif game_figure.x < position:\n        game.go_side(1)\n    elif game_figure.x > position:\n        game.go_side(-1)\n    else:\n        game.go_space()\n\n# 利用 html 建立一個 CANVAS 標註物件, 與變數 canvas 對應\ncanvas = html.CANVAS(width = 400, height = 500, id="canvas")\nbrython_div = doc["brython_div2"]\nbrython_div <= canvas\nctx = canvas.getContext("2d")\n\ncolors = [\n    (0, 0, 0),\n    (120, 37, 179),\n    (100, 179, 179),\n    (80, 34, 22),\n    (80, 134, 22),\n    (180, 34, 22),\n    (180, 34, 122),\n]\n\n\nclass Figure:\n    x = 0\n    y = 0\n\n    figures = [\n        [[1, 5, 9, 13], [4, 5, 6, 7]],\n        [[4, 5, 9, 10], [2, 6, 5, 9]],\n        [[6, 7, 9, 10], [1, 5, 6, 10]],\n        [[1, 2, 5, 9], [0, 4, 5, 6], [1, 5, 9, 8], [4, 5, 6, 10]],\n        [[1, 2, 6, 10], [5, 6, 7, 9], [2, 6, 10, 11], [3, 5, 6, 7]],\n        [[1, 4, 5, 6], [1, 4, 5, 9], [4, 5, 6, 9], [1, 5, 6, 9]],\n        [[1, 2, 5, 6]],\n    ]\n\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n        self.type = random.randint(0, len(self.figures) - 1)\n        self.color = random.randint(1, len(colors) - 1)\n        self.rotation = 0\n\n    def image(self):\n        return self.figures[self.type][self.rotation]\n\n    def rotate(self):\n        self.rotation = (self.rotation + 1) % len(self.figures[self.type])\n\n\nclass Tetris:\n    level = 2\n    score = 0\n    state = "start"\n    field = []\n    height = 0\n    width = 0\n    x = 100\n    y = 60\n    zoom = 20\n    figure = None\n\n    def __init__(self, height, width):\n        self.height = height\n        self.width = width\n        self.field = []\n        self.score = 0\n        self.state = "start"\n        for i in range(height):\n            new_line = []\n            for j in range(width):\n                # 起始時每一個都填入 0\n                new_line.append(0)\n            self.field.append(new_line)\n\n    def new_figure(self):\n        self.figure = Figure(3, 0)\n\n    def intersects(self):\n        intersection = False\n        for i in range(4):\n            for j in range(4):\n                if i * 4 + j in self.figure.image():\n                    # block 到達底部, 左右兩邊界, 或該座標有其他 block\n                    if i + self.figure.y > self.height - 1 or \\\n                            j + self.figure.x > self.width - 1 or \\\n                            j + self.figure.x < 0 or \\\n                            self.field[i + self.figure.y][j + self.figure.x] > 0:\n                        intersection = True\n        return intersection\n\n    def break_lines(self):\n        lines = 0\n        for i in range(1, self.height):\n            zeros = 0\n            for j in range(self.width):\n                if self.field[i][j] == 0:\n                    zeros += 1\n            if zeros == 0:\n                lines += 1\n                for i1 in range(i, 1, -1):\n                    for j in range(self.width):\n                        self.field[i1][j] = self.field[i1 - 1][j]\n        self.score += lines ** 2\n\n    def go_space(self):\n        while not self.intersects():\n            self.figure.y += 1\n        self.figure.y -= 1\n        self.freeze()\n\n    def go_down(self):\n        self.figure.y += 1\n        if self.intersects():\n            self.figure.y -= 1\n            self.freeze()\n\n    def freeze(self):\n        for i in range(4):\n            for j in range(4):\n                if i * 4 + j in self.figure.image():\n                    self.field[i + self.figure.y][j + self.figure.x] = self.figure.color\n        self.break_lines()\n        self.new_figure()\n        if self.intersects():\n            self.state = "gameover"\n\n    def go_side(self, dx):\n        old_x = self.figure.x\n        self.figure.x += dx\n        if self.intersects():\n            self.figure.x = old_x\n\n    def rotate(self):\n        old_rotation = self.figure.rotation\n        self.figure.rotate()\n        if self.intersects():\n            self.figure.rotation = old_rotation\n\n# Define some colors\n# from https://stackoverflow.com/questions/3380726/converting-a-rgb-color-tuple-to-a-six-digit-code\nBLACK = \'#%02x%02x%02x\' % (0, 0, 0)\nWHITE = \'#%02x%02x%02x\' % (255, 255, 255)\nGRAY = \'#%02x%02x%02x\' % (128, 128, 128)\nRED = \'#%02x%02x%02x\' % (255, 0, 0)\n\ndone = False\nfps = 5\ngame = Tetris(20, 10)\ncounter = 0\n\npressing_down = False\n\ndef key_down(eve):\n    key = eve.keyCode\n    #if event.type == pygame.QUIT:\n    # 32 is pause\n    if key == 32:\n        done = True\n    # 82 is r key to rotate\n    if key == 82:\n        game.rotate()\n    # 40 is down key\n    if key == 40:\n        pressing_down = True\n    # 37 is left key\n    if key == 37:\n        game.go_side(-1)\n    # 39 is right key\n    if key == 39:\n        game.go_side(1)\n    # 68 is d key to move block to bottom\n    if key == 68:\n        game.go_space()\n    # 27 is escape\n    # reset the game\n    if key == 27:\n        # clear the previous score\n        ctx.fillStyle = WHITE\n        ctx.fillRect( 100, 0, 200, 50)\n        game.__init__(20, 10)\n\ndef key_up(eve):\n    key = eve.keyCode\n    # 40 is down key\n    if key == 40:\n        pressing_down = False\n\n#while not done:\ndef do_game():\n    global counter\n    if game.figure is None:\n        game.new_figure()\n    counter += 1\n    if counter > 100000:\n        counter = 0\n    if counter % (fps // game.level // 2) == 0 or pressing_down:\n        if game.state == "start":\n            game.go_down()\n            run_ai(game.field, game.figure, game.width, game.height)\n    \n    for i in range(game.height):\n        for j in range(game.width):\n            ctx.fillStyle = WHITE\n            #ctx.scale(game.zoom, game.zoom)\n            ctx.fillRect(game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom)\n            if game.field[i][j] > 0:\n                ctx.fillStyle = \'#%02x%02x%02x\' % colors[game.field[i][j]]\n                ctx.fillRect(game.x + game.zoom * j + 1, game.y + game.zoom * i + 1, game.zoom - 2, game.zoom - 1)\n            ctx.lineWidth = 1\n            ctx.strokeStyle = GRAY\n            ctx.beginPath()\n            ctx.rect(game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom)\n            ctx.stroke()\n    if game.figure is not None:\n        for i in range(4):\n            for j in range(4):\n                p = i * 4 + j\n                if p in game.figure.image():\n                    ctx.fillStyle = \'#%02x%02x%02x\' % colors[game.figure.color]\n                    ctx.fillRect(game.x + game.zoom * (j + game.figure.x) + 1,\n                                      game.y + game.zoom * (i + game.figure.y) + 1,\n                                      game.zoom - 2, game.zoom - 2)\n\n# score and Game Over scripts from https://s40723245.github.io/wcm2022\n    # 宣告文字的大小為36px\n    ctx.font = \'36px serif\'\n    # 宣告文字顏色為黑色\n    ctx.fillStyle = BLACK\n    # 將分數顯示在遊戲區上方, 座標為(10, 50), 並設定變數為text\n    ctx.fillText(\'Score:\'+ str(game.score), 10,50)\n    \n    # 宣告變數int = 1 ，如果分數大於int，則畫布清掉原本的分數填上新的得分分數\n    int = 1\n    if game.score >= int:\n        ctx.fillStyle = WHITE\n        ctx.fillRect( 100, 0, 200, 50)\n        ctx.fillStyle = BLACK\n        ctx.fillText(str(game.score), 108,50)\n    \n    # 如果遊戲狀態為gameover，顯示Game Over及Press ESC，並將文字設定為紅色\n    if game.state == "gameover":\n        ctx.fillStyle = RED\n        ctx.fillText("Game Over", 100, 200)\n        ctx.fillText("Press ESC", 105, 265)\n        ctx.fillStyle = WHITE\n        ctx.fillRect( 100, 0, 200, 50)\n        game.__init__(20, 10)\n\ndoc.addEventListener("keydown", key_down)\ndoc.addEventListener("keyup", key_up)\nbrowser.timer.set_interval(do_game, fps) \n', 'tags': '', 'url': 'w13.html'}, {'title': 'w12', 'text': '溫度轉換程式 \n # Brython 的 input() 可以接受輸入提示字串, 跳出瀏覽器輸入表單後, 將輸入內容以字串取回\nuser_input_temp = input("請輸入攝氏溫度值:")\n# 接著列出 user_input_temp 變數的資料型別\nprint(type(user_input_temp))\n# 到這裡已知利用 input() 函式將傳回字串, 接著以 float() 將字串轉為浮點數\nuser_input_temp = float(user_input_temp)\n# 因為攝氏溫度乘上 9/5 之後再加上 32 就可以得到對應的華氏溫度值\nFahrenheit = (user_input_temp*9/5) + 32\n# 到這裡, Fahrenheit 資料型別為浮點數, 而 user_input_temp 在第 8 行也轉為浮點數\n# 要將兩個浮點數與字串相加, 都必須透過 str() 轉為字串\nprint("攝氏 " + str(user_input_temp) + " 度, 等於華氏 " + str(Fahrenheit) + " 度.") \n 第十週缺考名單 \n import ast\n# get stud_list first\ndef get_stud(c_name):\n    courses = {"1a": "0747", "1b": "0761", "2a": "0773", "2b": "0786"}\n    #c_name = "1b"\n    c = courses[c_name]\n    url = "https://nfu.cycu.org/?semester=1111&courseno=" + c + "&column=True"\n    data = open(url).read().split("\\n")\n    stud = data[:-1]\n    return stud\n    \ncp_stud = get_stud("1b")\n# get w10 quiz result\ncp_w11_quiz_url = "https://gist.githubusercontent.com/mdecycu/9df4b372ac1b7386cf259ced15f1a2b2/raw/8e59f90d8ff4f1ad4fecd4f7ee159f91eb6addf9/cp1b_w11_quiz_result.json"\ncp_w10_quiz_url = "https://gist.githubusercontent.com/mdecycu/9df4b372ac1b7386cf259ced15f1a2b2/raw/a6825f13b1bb0b61e09e74dd117729eefe1d947f/20221110_cp1b_w10_quiz.json"\ndef get_score(url):\n    num_stud = 0\n    total_score = 0\n    json_data = open(url).read()\n    big_dict = ast.literal_eval(json_data)\n    data = big_dict["body"]["testuser"]\n    quiz_dict = {}\n    for i in data:\n        stud_id = data[i]["user_name"]\n        stud_score = int(float(data[i]["total_score"]))\n        quiz_dict[stud_id] = stud_score\n        num_stud = num_stud + 1\n        total_score = total_score + stud_score\n    return quiz_dict, num_stud, total_score\n    \n#cp_quiz, num_stud, total_score = get_score(cp_w10_quiz_url)\ncp_quiz, num_stud, total_score = get_score(cp_w11_quiz_url)\ncp_abs = []\nfor stud in cp_stud:\n    try:\n        print(stud, cp_quiz[stud])\n    except:\n        # 缺考者沒有 quiz 成績\n        print(stud, "缺")\n        cp_abs.append(stud)\nprint("\\n考試平均分數為:", int(total_score/num_stud))\n# 列出缺考名單\nprint("="*20)\nprint("以下為 w10 缺考名單:")\nfor stud in cp_abs:\n    print(stud) \n 使用按鈕啟動 get_input \n \n  \n在動態網站頁面中啟用 Brython 執行環境的用法, 請注意動態網站執行所在路徑\n \n \n \n  啟動 Brython  \n \n \n  以下事先在頁面中加入 id="brython_div" 的 div 標註\n之後可利用 Brython 的 document 模組與此 html 標註對應\n \n \n  將直接執行的程式變成註解的 \n<script type="text/python">\nfrom browser import html, document\n# Brython 的 input() 可以接受輸入提示字串, 跳出瀏覽器輸入表單後, 將輸入內容以字串取回\nuser_input_temp = input("請輸入攝氏溫度值:")\n# 接著列出 user_input_temp 變數的資料型別\n# 但是在頁面中 Brython 的 print() 將會顯示在 log 而非頁面\nprint(type(user_input_temp))\n# 這裡定義一個 brython_div 變數, 透過 document[] 與頁面中 id="brython_div" 的位置對應\nbrython_div = document["brython_div"]\n# 看能不能直接將變數值字串列在標註 id 為 "brython_div" 的頁面位置\nbrython_div <= user_input_temp\n# 之後若要列出 html, 則需要透過 Brython 的 html 模組\n</script>\n \n 啟動下方程式的按鈕 \n \n \n \n \n 加上說明 \n <h3>w12</h3>\n<!-- \n在動態網站頁面中啟用 Brython 執行環境的用法, 請注意動態網站執行所在路徑\n-->\n<script src="./../cmsimde/static/brython.js"></script>\n<script src="./../cmsimde/static/brython_stdlib.js"></script>\n<!-- 啟動 Brython -->\n<p>\n<script>// <![CDATA[\nwindow.onload=function(){\nbrython({debug:1, pythonpath:[\'./../cmsimde/static/\',\'/downloads/py/\']});\n}\n// ]]></script>\n<!-- 以下事先在頁面中加入 id="brython_div" 的 div 標註\n之後可利用 Brython 的 document 模組與此 html 標註對應\n--></p>\n<div id="brython_div"></div>\n<p>\n<script type="text/python">// <![CDATA[\nfrom browser import html, document\n# Brython 的 input() 可以接受輸入提示字串, 跳出瀏覽器輸入表單後, 將輸入內容以字串取回\nuser_input_temp = input("請輸入攝氏溫度值:")\n# 接著列出 user_input_temp 變數的資料型別\n# 但是在頁面中 Brython 的 print() 將會顯示在 log 而非頁面\nprint(type(user_input_temp))\n# 這裡定義一個 brython_div 變數, 透過 document[] 與頁面中 id="brython_div" 的位置對應\nbrython_div = document["brython_div"]\n# 看能不能直接將變數值字串列在標註 id 為 "brython_div" 的頁面位置\nbrython_div <= user_input_temp\n# 之後若要列出 html, 則需要透過 Brython 的 html 模組\n// ]]></script>\n</p> \n \n', 'tags': '', 'url': 'w12.html'}, {'title': 'w10', 'text': '1 3 5 7 9 程式 \n for i in range(1,10,2):\n    \n    print(i,end=" ") \n \n', 'tags': '', 'url': 'w10.html'}, {'title': 'w6', 'text': '顯示學員靜態網頁 \n from browser import document, html\n\nbrython_div1 = document["brython_div1"]\n"""\nbrython_div1 <= html.BUTTON("hello")\nbrython_div1 <= html.BR()\nbrython_div1 <= html.A("google", href="https://google.com")\n"""\n\nurl = "https://mde.tw/studlist/2022fall/1a.txt"\ndata = open(url).read().split("\\n")\nmdecp2022 = "https://mdecp2022.github.io/site-"\ndata = data[1:-1]\nfor i in data:\n    stud = i.split("\\t")\n    stud_num = stud[0]\n    github_acc = stud[1]\n    #print(stud_num, github_acc)\n    if github_acc == "":\n        github_acc = stud_num\n    site = mdecp2022 + github_acc\n    link = html.A(stud_num, href=site)\n    brython_div1 <= link\n    brython_div1 <= html.BR() \n', 'tags': '', 'url': 'w6.html'}, {'title': 'Brython', 'text': 'https://en.wikipedia.org/wiki/Python_(programming_language) \n Examples: \n https://gist.github.com/mdecycu/d9082d678096bd58378d6afe2c7fa05d \n https://www.geeksforgeeks.org/python-programming-examples/ \n https://www.programiz.com/python-programming/examples \n https://www.freecodecamp.org/news/python-code-examples-sample-script-coding-tutorial-for-beginners/ \n Python Tutorial: \n https://docs.python.org/3/tutorial/ \n An informal introduction to Python \n Indentation \n Variables \n Comments \n Numbers \n Strings \n print \n Python control flow tools \n for \n if \n range \n open \n read \n lists \n tuples \n dictionaries \n functions \n try ... except \n break \n pass \n classes \n 這個頁面 demo 如何在同一頁面下納入多個線上 Ace 編輯器與執行按鈕 ( practice_html.txt  動態頁面超文件). \n practice_html.txt  動態頁面超文件應該可以在啟動 Brython 時, 設定將 .py 檔案放入 downloads/py 目錄中引用. \n 亦即將所有對應的 html 也使用 Brython 產生, 然後寫為  class  後, 在範例導入時透過  instance  引用. \n <!-- 啟動 Brython -->\n<script>\nwindow.onload=function(){\nbrython({debug:1, pythonpath:[\'./../cmsimde/static/\',\'./../downloads/py/\']});\n}\n</script> \n 從 1 累加到 100: \n 1 add to 100 \n 將 iterable 與 iterator  相關說明 , 利用 Brython 與 Ace Editor 整理在這個頁面. \n  導入 brython 程式庫  \n \n \n \n \n  啟動 Brython  \n \n \n \n  導入 FileSaver 與 filereader  \n \n \n \n \n  導入 ace  \n \n \n \n \n \n \n  導入 gearUtils-0.9.js Cango 齒輪繪圖程式庫  \n \n \n \n \n \n \n  請注意, 這裡使用 Javascript 將 localStorage["kw_py_src1"] 中存在近端瀏覽器的程式碼, 由使用者決定存檔名稱 \n \n \n \n \n \n \n  add 1 to 100 開始  \n \n \n  add 1 to 100 結束 \n  editor1 開始  \n  用來顯示程式碼的 editor 區域  \n \n  以下的表單與按鈕與前面的 Javascript doSave 函式以及 FileSaver.min.js 互相配合  \n  存擋表單開始  \n Filename:  .py   \n  存擋表單結束  \n \n  執行與清除按鈕開始  \n Run   Output   清除輸出區 清除繪圖區 Reload \n  執行與清除按鈕結束  \n \n  程式執行 ouput 區  \n \n  Brython 程式執行的結果, 都以 brython_div1 作為切入位置  \n \n  editor1 結束   ##########################################  \n 從 1 累加到 100 part2: \n 1 add to 100 cango_three_gears BSnake AI Tetris \n  請注意, 這裡使用 Javascript 將 localStorage["kw_py_src2"] 中存在近端瀏覽器的程式碼, 由使用者決定存檔名稱 \n \n \n \n  add 1 to 100 part2 開始  \n \n \n  add 1 to 100 part2 結束 \n  editor2 開始  \n  用來顯示程式碼的 editor 區域  \n \n  以下的表單與按鈕與前面的 Javascript doSave 函式以及 FileSaver.min.js 互相配合  \n  存擋表單開始  \n Filename:  .py   \n  存擋表單結束  \n \n  執行與清除按鈕開始  \n Run   Output   清除輸出區 清除繪圖區 Reload \n  執行與清除按鈕結束  \n \n  程式執行 ouput 區  \n \n  Brython 程式執行的結果, 都以 brython_div1 作為切入位置  \n \n  editor2 結束 ', 'tags': '', 'url': 'Brython.html'}]};