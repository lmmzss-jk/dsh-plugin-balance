# dsh-plugin-balance

DeepSeek Harness Web 插件：会话头部余额按钮（位于原生 **Session log** 按钮左侧），
点击下拉查看 **账户余额**、**当前会话的模型与实时 token 用量**、以及按 **DeepSeek 官方价目表**
计算的费用估算。

## 功能

- **会话头部按钮**：跟随会话头部布局，位于 Session log 左侧，加载后直接显示余额（如 `¥558.42`）
- **点击下拉，两个区块**：
  - **当前会话（实时）**：使用的模型、输入·未命中缓存 / 输入·命中缓存 / 缓存写入 / 输出
    四项 token 明细、**缓存命中率**（含进度条）、按官方价目表计算的本会话费用
  - **账户余额**：总余额、充值余额、赠送余额、账户可用状态、更新时间，附 DeepSeek 平台链接
- **实时更新**：token 用量订阅 token-meter 的 session projection，模型回答流式过程中数字实时增长
- **价格自动同步**：宿主端每 6 小时以 ETag 条件请求同步
  [官方定价页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)，自动提取峰谷价与生效日期；
  未联网时回退内置价目表；客户端打开面板时拉取最新价并本地缓存 12 小时
- **峰谷自适应**：按北京时间自动判断高峰（9:00-12:00、14:00-18:00）/空闲时段，
  并随官方调价公告的生效日期自动切换新旧价目
- **自动隐藏**：打开「设置」页面时按钮自动隐藏，关闭设置后恢复
- **零配置**：复用 DSH 已配置的 `DEEPSEEK_API_KEY`（设置 → 模型，或 `~/.dsh/.credentials.yaml`）
- **状态提示**：余额较低（< 10）变黄、余额耗尽变红、Key 无效 / 未配置 / 网络错误给出明确文案
- **中英文自适应**：跟随浏览器语言自动切换文案

## 安装

```bash
dsh plugin --profile web add @lmmzss/dsh-plugin-balance
# 重启 dsh web 使插件生效
```

> 插件复用 DSH 现有配置：先确保已在「设置 → 模型」中配置好 DeepSeek API Key。

## 卸载

```bash
dsh plugin --profile web remove dsh-plugin-balance
```

## 工作原理

- **宿主端**（`lib/index.js`）：
  - `GET /api/dsh-balance`：读取凭证服务中的 `DEEPSEEK_API_KEY`（或环境变量兜底），代理请求
    `https://api.deepseek.com/user/balance`（遵循 `DEEPSEEK_BASE_URL` 覆盖），返回脱敏 JSON——
    **API Key 不会暴露到浏览器**；
  - `GET /api/dsh-pricing`：每 6 小时以 ETag 条件请求同步官方定价页，解析峰谷价/旧价/生效日期/
    高峰窗口，失败时保留上次价格。
- **客户端**（`lib/client.js`）：以 `dsh.client` 双面包加载，注册到
  `conversation.session.header.utilities` 槽位（order: -10，位于 Session log 左侧）。
  - token 明细：`useProjection("tokenUsage")` 订阅 token-meter 的会话投影，实时更新；
  - 模型：`session.models` RPC 读取当前会话的 provider/model；
  - 费用：按官方价目表 × token 用量计算（`命中×命中价 + 未命中×未命中价 + 输出×输出价`）。

## 费用说明（重要）

- **token 数**：来自 DeepSeek API 每次响应上报的 usage 字段，准确（按每次请求的完整输入计费，
  与平台口径一致）；「缓存写入」恒为 0 是因为 DeepSeek API 不报告该字段，属正常现象。
- **费用**：按官方价目表（v4-flash / v4-pro）实时计算，含峰谷时段与调价生效日期自动切换。
  价格每 6 小时从官方页面同步，无法覆盖官方页面未及时更新的情况，费用仅供参考，
  以 [platform.deepseek.com/usage](https://platform.deepseek.com/usage) 实际账单为准。

## 开发

```bash
dsh plugin --profile web add /path/to/dsh-plugin-balance
# 修改 lib/client.js 后刷新页面即可生效；修改宿主端/配置需重启 dsh
```

## License

[MIT](./LICENSE)
