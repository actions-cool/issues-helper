echo "[TEST] check format"
npm run format-check

echo "[TEST] test package"
npm run package

echo "[TEST] test commit"
npm run check-commit

echo "[Action] do tag"
npm run tag

echo "[Action] do release"
npm run release
