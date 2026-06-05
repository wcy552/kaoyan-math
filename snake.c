#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <windows.h>
#include <time.h>

#define WIDTH   40
#define HEIGHT  20

typedef struct {
    int x, y;
} Point;

/* 全局变量 */
Point snake[WIDTH * HEIGHT];
int   snake_len;
Point food;
int   dir_x, dir_y;
int   score;
int   speed;      /* 毫秒 */
int   game_over;

void gotoxy(int x, int y) {
    COORD c = {x, y};
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), c);
}

void hide_cursor() {
    CONSOLE_CURSOR_INFO ci = {100, FALSE};
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &ci);
}

void set_color(int fg) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), fg);
}

/* 生成不在蛇身上的食物 */
void spawn_food() {
    int valid;
    do {
        valid = 1;
        food.x = 1 + rand() % (WIDTH - 2);
        food.y = 1 + rand() % (HEIGHT - 2);
        for (int i = 0; i < snake_len; i++) {
            if (snake[i].x == food.x && snake[i].y == food.y) {
                valid = 0;
                break;
            }
        }
    } while (!valid);
}

void init() {
    snake_len  = 3;
    dir_x      = 1;
    dir_y      = 0;
    score      = 0;
    speed      = 120;
    game_over  = 0;

    /* 蛇初始位置：水平三节 */
    snake[0].x = WIDTH / 2;
    snake[0].y = HEIGHT / 2;
    snake[1].x = WIDTH / 2 - 1;
    snake[1].y = HEIGHT / 2;
    snake[2].x = WIDTH / 2 - 2;
    snake[2].y = HEIGHT / 2;

    spawn_food();
}

/* 非阻塞检测按键 */
int get_key() {
    if (_kbhit()) {
        int ch = _getch();
        if (ch == 224) {         /* 方向键 */
            ch = _getch();
            switch (ch) {
                case 72: return 'w';  /* 上 */
                case 75: return 'a';  /* 左 */
                case 77: return 'd';  /* 右 */
                case 80: return 's';  /* 下 */
            }
        }
        return ch;
    }
    return 0;
}

void handle_input() {
    int key = get_key();
    switch (key) {
        case 'w': case 'W': if (dir_y == 0) { dir_x = 0; dir_y = -1; } break;
        case 's': case 'S': if (dir_y == 0) { dir_x = 0; dir_y =  1; } break;
        case 'a': case 'A': if (dir_x == 0) { dir_x = -1; dir_y = 0; } break;
        case 'd': case 'D': if (dir_x == 0) { dir_x =  1; dir_y = 0; } break;
    }
}

void update() {
    /* 新蛇头 */
    Point new_head;
    new_head.x = snake[0].x + dir_x;
    new_head.y = snake[0].y + dir_y;

    /* 撞墙检测 */
    if (new_head.x <= 0 || new_head.x >= WIDTH - 1 ||
        new_head.y <= 0 || new_head.y >= HEIGHT - 1) {
        game_over = 1;
        return;
    }

    /* 撞自己检测 */
    for (int i = 0; i < snake_len; i++) {
        if (snake[i].x == new_head.x && snake[i].y == new_head.y) {
            game_over = 1;
            return;
        }
    }

    /* 蛇身移动 */
    for (int i = snake_len; i > 0; i--)
        snake[i] = snake[i - 1];
    snake[0] = new_head;

    /* 吃到食物 */
    if (new_head.x == food.x && new_head.y == food.y) {
        snake_len++;
        score += 10;
        if (speed > 40) speed -= 5;  /* 加速 */
        spawn_food();
    }
}

void draw() {
    gotoxy(0, 0);

    set_color(11);  /* 青色边框 */
    /* 上边框 */
    for (int x = 0; x < WIDTH; x++) printf("█");
    printf("\n");

    /* 中间区域 */
    for (int y = 1; y < HEIGHT - 1; y++) {
        set_color(11);
        printf("█");
        for (int x = 1; x < WIDTH - 1; x++) {
            int drawn = 0;

            /* 蛇头 */
            if (x == snake[0].x && y == snake[0].y) {
                set_color(10);  /* 绿色蛇头 */
                printf("O");
                drawn = 1;
            }

            /* 蛇身 */
            if (!drawn) {
                for (int i = 1; i < snake_len; i++) {
                    if (x == snake[i].x && y == snake[i].y) {
                        set_color(2);  /* 深绿色蛇身 */
                        printf("o");
                        drawn = 1;
                        break;
                    }
                }
            }

            /* 食物 */
            if (!drawn && x == food.x && y == food.y) {
                set_color(12);  /* 红色食物 */
                printf("♥");
                drawn = 1;
            }

            /* 空地 */
            if (!drawn) {
                printf(" ");
            }
        }
        set_color(11);
        printf("█\n");
    }

    /* 下边框 */
    for (int x = 0; x < WIDTH; x++) printf("█");

    set_color(7);  /* 白色 */
    printf("\n\n  得分: %d    速度: %dms    用 WASD 移动\n", score, speed);
    printf("  按 Q 退出游戏\n");
}

int main() {
    system("cls");
    SetConsoleOutputCP(65001);
    srand((unsigned)time(NULL));
    hide_cursor();

    printf("🐍  贪 吃 蛇  🐍\n\n");
    printf("  WASD 或方向键控制移动\n");
    printf("  吃到 ♥ 得分，撞墙或撞到自己就输啦\n\n");
    printf("  按任意键开始...");
    _getch();

    init();

    while (!game_over) {
        handle_input();

        int key = get_key();
        if (key == 'q' || key == 'Q') break;

        update();

        system("cls");
        draw();

        /* 处理输入的同时做延迟 */
        for (int tick = 0; tick < speed; tick += 20) {
            handle_input();
            int q = get_key();
            if (q == 'q' || q == 'Q') { game_over = 1; break; }
            Sleep(20);
        }
    }

    gotoxy(0, HEIGHT + 4);
    if (game_over) {
        set_color(12);
        printf("\n  💔 游戏结束！最终得分: %d\n", score);
    }
    set_color(7);
    printf("\n  按任意键退出...");
    _getch();

    system("cls");
    set_color(7);
    printf("  下次再一起玩哦，Sakura～ 🌸\n");
    return 0;
}
