# 天气预报 Web 应用（Next.js + TypeScript + Tailwind + OpenWeatherMap）

一个中文界面的天气应用，支持：
- 城市搜索（中文/英文）
- 自动定位（可开关）
- 当前天气展示
- 5 天/3 小时预报（按日分组显示 min/max）
- ℃/℉ 单位切换（localStorage 记忆）
- 错误提示与加载骨架屏

技术栈：Next.js 14（App Router）+ TypeScript + Tailwind CSS。
第三方数据均通过 Next.js API Route 代理，避免泄露后端密钥。

## 快速开始

1. 克隆仓库并安装依赖：

```bash
npm install
```

2. 配置环境变量：

- 复制 `.env.example` 为 `.env`
- 填入你的 OpenWeatherMap API Key

`.env` 示例：

```
OPENWEATHER_API_KEY=你的_API_Key
```

获取 API Key：https://home.openweathermap.org/api_keys

3. 本地开发：

```bash
npm run dev
```

访问 http://localhost:3000

- 首次进入将尝试浏览器定位（可在右上角关闭“自动定位”）
- 也可直接输入城市名搜索，例如：北京、Shanghai

4. 构建与启动：

```bash
npm run build
npm start
```

## 目录结构

```
app/
  layout.tsx            # 全局布局
  page.tsx              # 主页：搜索/定位/结果展示
  api/
    weather/route.ts    # 当前天气代理
    forecast/route.ts   # 5 天预报代理
components/
  SearchBar.tsx
  WeatherCard.tsx
  ForecastList.tsx
  UnitToggle.tsx
  ErrorBanner.tsx
  LoadingSkeleton.tsx
lib/
  weather.ts            # 类型与封装、工具函数
styles/
  globals.css           # Tailwind 全局样式
public/
  icons/                # 可放置自定义图标（当前使用 OWM 图标 URL）
```

## 实现说明

- 所有对 OpenWeatherMap 的请求均由服务器端 API Route 转发，统一附加 `OPENWEATHER_API_KEY`、`lang=zh_cn`、`units` 参数。
- 前端仅调用 `/api/weather` 与 `/api/forecast`，不会暴露真实密钥。
- 预报数据为 5 天/3 小时粒度，前端按“日”分组，显示每天 min/max 温度与图标。
- 单位切换（°C/°F）通过 `localStorage` 记忆。
- 错误处理：当第三方接口非 200 时，API Route 转换为 `{ error: { code, message } }` 的结构化错误；前端展示友好提示。
- 时间显示使用 `Intl.DateTimeFormat('zh-CN')`，并结合 OWM 提供的 `timezone` 偏移进行换算。

## 环境变量

- `OPENWEATHER_API_KEY`：OpenWeatherMap 的 API Key，必填，仅服务器端使用。

## 脚本

- `npm run dev`：启动开发服务器
- `npm run build`：构建生产包
- `npm start`：启动生产服务器
- `npm run lint`：ESLint 检查
- `npm run format`：使用 Prettier 格式化

## 部署

- 本项目为 Next.js App Router 应用，可部署到任意支持 Node.js 的平台（Vercel、Render、自建等）。
- 部署时确保配置 `OPENWEATHER_API_KEY` 环境变量。

## 注意

- 本项目为 MVP 示例，暂未提供：PWA 离线、收藏城市、多语言切换（除中文）、测试用例、地图展示等。
- 如需扩展功能，可在现有结构上新增页面与组件。
