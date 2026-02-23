#!/bin/bash
# cleanup-unused-png.sh
#
# 本番デプロイ前に実行: WebP 版が存在する不使用 PNG を削除し、
# public/images/ を 472MB → ~97MB に削減する。
#
# 使い方:
#   bash scripts/cleanup-unused-png.sh        # ドライラン（削除せず一覧表示）
#   bash scripts/cleanup-unused-png.sh --exec # 実際に削除

set -euo pipefail
cd "$(dirname "$0")/.."

DRY_RUN=true
if [[ "${1:-}" == "--exec" ]]; then
  DRY_RUN=false
fi

TOTAL_SIZE=0
COUNT=0

echo "=== 不使用 PNG スキャン ==="
echo "apple-touch-icon.png はスキップします"
echo ""

while IFS= read -r png; do
  # apple-touch-icon は Apple が PNG を要求するため保持
  if [[ "$png" == *"apple-touch-icon"* ]]; then
    continue
  fi

  webp="${png%.png}.webp"
  if [[ -f "$webp" ]]; then
    size=$(stat -f '%z' "$png" 2>/dev/null || stat -c '%s' "$png" 2>/dev/null)
    size_mb=$(echo "scale=1; $size / 1024 / 1024" | bc)
    TOTAL_SIZE=$((TOTAL_SIZE + size))
    COUNT=$((COUNT + 1))

    if $DRY_RUN; then
      echo "[DRY] rm $png  (${size_mb}MB, WebP版あり)"
    else
      rm "$png"
      echo "[DEL] $png  (${size_mb}MB)"
    fi
  fi
done < <(find public/images -name "*.png" -type f)

TOTAL_MB=$(echo "scale=1; $TOTAL_SIZE / 1024 / 1024" | bc)
echo ""
echo "=== 結果 ==="
echo "対象ファイル: ${COUNT} 件"
echo "削減サイズ:   ${TOTAL_MB} MB"

if $DRY_RUN; then
  echo ""
  echo "実際に削除するには: bash scripts/cleanup-unused-png.sh --exec"
fi
