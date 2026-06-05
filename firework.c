#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <windows.h>
#include <time.h>
#include <math.h>

#define MAX_PARTICLES  200
#define WIDTH          60
#define HEIGHT         25

typedef struct {
    double x, y;
    double vx, vy;
    int    life;
    int    color;
    char   ch;
} Particle;

Particle particles[MAX_PARTICLES];
int      particle_count = 0;

void gotoxy(int x, int y) {
    COORD c = {(SHORT)x, (SHORT)y};
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), c);
}

void hide_cursor() {
    CONSOLE_CURSOR_INFO ci = {100, FALSE};
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &ci);
}

void set_color(int fg) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), (WORD)fg);
}

/* 生成一朵烟花 */
void spawn_firework(double cx, double cy) {
    int count = 40 + rand() % 60;
    int color = 9 + rand() % 7;  /* 9-15 亮色 */
    for (int i = 0; i < count && particle_count < MAX_PARTICLES; i++) {
        double angle = (rand() % 360) * 3.14159 / 180.0;
        double speed = 0.3 + (rand() % 100) / 100.0 * 1.2;
        Particle* p = &particles[particle_count++];
        p->x     = cx;
        p->y     = cy;
        p->vx    = cos(angle) * speed;
        p->vy    = sin(angle) * speed;
        p->life  = 15 + rand() % 25;
        p->color = color;
        p->ch    = "*+.o"[rand() % 4];
    }
}

/* 更新所有粒子 */
void update_particles() {
    for (int i = 0; i < particle_count; i++) {
        Particle* p = &particles[i];
        p->x  += p->vx;
        p->y  += p->vy;
        p->vy += 0.04;   /* 重力 */
        p->vx *= 0.985;
        p->vy *= 0.985;
        p->life--;
    }
    /* 清理死掉的粒子 */
    int alive = 0;
    for (int i = 0; i < particle_count; i++) {
        if (particles[i].life > 0 &&
            particles[i].x > 0 && particles[i].x < WIDTH &&
            particles[i].y > 0 && particles[i].y < HEIGHT) {
            particles[alive++] = particles[i];
        }
    }
    particle_count = alive;
}

/* 清空屏幕 */
void clear_screen() {
    gotoxy(0, 0);
    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            printf(" ");
        }
        printf("\n");
    }
}

void draw_particles() {
    /* 先画星空背景 */
    gotoxy(0, 0);
    char screen[HEIGHT][WIDTH + 1];
    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            screen[y][x] = ' ';
        }
        screen[y][WIDTH] = '\0';
    }

    /* 随机星星 */
    for (int i = 0; i < 20; i++) {
        int sx = rand() % WIDTH;
        int sy = rand() % HEIGHT;
        screen[sy][sx] = '.';
    }

    /* 放置粒子 */
    for (int i = 0; i < particle_count; i++) {
        int px = (int)particles[i].x;
        int py = (int)particles[i].y;
        if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
            screen[py][px] = particles[i].ch;
        }
    }

    /* 输出画面 */
    for (int y = 0; y < HEIGHT; y++) {
        gotoxy(0, y);
        set_color(7);
        int last_color = 7;
        for (int x = 0; x < WIDTH; x++) {
            int color = 7;
            /* 寻找该位置的粒子颜色 */
            for (int i = 0; i < particle_count; i++) {
                if ((int)particles[i].x == x && (int)particles[i].y == y) {
                    color = particles[i].color;
                    break;
                }
            }
            if (color != last_color) {
                set_color(color);
                last_color = color;
            }
            printf("%c", screen[y][x]);
        }
    }

    /* 底部信息 */
    gotoxy(0, HEIGHT);
    set_color(14);
    printf("\n  🎆  按任意键放烟花 | 按 Q 退出  🎆\n");
}

int main() {
    SetConsoleOutputCP(65001);
    srand((unsigned)time(NULL));
    hide_cursor();
    system("cls");

    set_color(14);
    printf("\n\n");
    printf("         ✨  ✨    烟 花 盛 宴    ✨  ✨\n\n");
    printf("           按任意键开始放烟花...\n");
    printf("           Q 键退出\n");
    _getch();
    system("cls");

    int running = 1;
    while (running) {
        /* 随机生成烟花 */
        if (rand() % 100 < 30 || particle_count == 0) {
            double cx = 5 + rand() % (WIDTH - 10);
            double cy = 3 + rand() % (HEIGHT / 2);
            spawn_firework(cx, cy);
        }

        /* 输入检测 */
        if (_kbhit()) {
            int ch = _getch();
            if (ch == 'q' || ch == 'Q') {
                running = 0;
                break;
            }
            /* 在指定位置放烟花 */
            if (particle_count < MAX_PARTICLES - 60) {
                double cx = 5 + rand() % (WIDTH - 10);
                double cy = 3 + rand() % (HEIGHT / 2);
                spawn_firework(cx, cy);
            }
        }

        update_particles();
        draw_particles();
        Sleep(50);
    }

    system("cls");
    set_color(13);
    printf("\n\n");
    printf("       🎆  愿你每天都像烟花一样灿烂 🎆\n\n");
    printf("            Sakura 会一直陪着你的\n\n");
    set_color(7);
    printf("       按任意键退出...");
    _getch();

    system("cls");
    return 0;
}
