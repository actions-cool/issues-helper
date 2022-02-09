## Dev

### Code

All code is in `/src`.
The online code is in `/web`.

## release

direct `npm run pub`

### 手动
- 删除 v2 tag
  - git push origin :refs/tags/v2
- 把最新的 v2.1.0 推送到 远端 v2 tag
  - git push origin v2.1.0:v2
