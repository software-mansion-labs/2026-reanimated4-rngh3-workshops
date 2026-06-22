#!/usr/bin/env bash
# Downloads all lesson video assets to docs-site/static/videos/ for offline docs.
# Run from the repo root or the docs-site directory:
#   bash docs-site/download-videos.sh
#
# github.com/user-attachments/assets/<UUID>  → saved as <UUID>.mp4
# user-images.githubusercontent.com/.../F.EXT → saved as F.ext (lowercased)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/static/videos"
mkdir -p "$OUT_DIR"

download() {
  local url="$1"
  local out="$2"
  if [[ -f "$out" ]]; then
    echo "  ✓ already exists: $(basename "$out")"
    return
  fi
  echo "  ↓ downloading: $(basename "$out")"
  curl -sSL --retry 3 \
    -H "User-Agent: Mozilla/5.0" \
    -o "$out" "$url"
}

# ── github.com/user-attachments/assets/<UUID> ────────────────────────────────
GITHUB_ASSETS=(
  "b83c7b61-361d-48a3-8f3d-4fa7061222c7"
  "ca2dfa7e-6e5a-4064-8c5a-f84956716364"
  "cc00d745-4384-49de-952a-1bc88e291a09"
  "b78391ca-e954-4b40-9d94-d2e29b678c51"
  "87df1fbe-0cd8-4508-9b40-9ce8d638612d"
  "f1cfee5c-a516-480a-bdfc-eb9cb29bf844"
  "c6cd3ecc-4d0d-4f38-8a1f-49cd50e3a269"
  "eb5efd34-bdd3-4341-9863-704913f3cef5"
  "3e78a5eb-899f-4b67-abbb-f681f37818a7"
  "c3221460-8789-4e64-ad59-255291a08fe4"
  "c7b5ff97-54d0-4b49-a8e0-d03be69e7bf9"
  "96c862ff-85cd-401d-ab73-c8a9f28dfeea"
)

echo "Downloading github.com/user-attachments/assets …"
for uuid in "${GITHUB_ASSETS[@]}"; do
  download \
    "https://github.com/user-attachments/assets/$uuid" \
    "$OUT_DIR/$uuid.mp4"
done

# ── user-images.githubusercontent.com direct files ───────────────────────────
# Stored as parallel arrays to avoid bash associative-array arithmetic parsing.
USER_IMAGE_FILES=(
  "236633815-8a714b8d-97d0-4b26-b04e-1e1b5bbf8c0d.mp4"
  "236633812-e237aa2f-3608-4e26-b8fa-f8991d6a6355.mov"
  "236649726-82140d72-177f-4895-ac61-6827a13dd8e9.mp4"
  "236649722-47f571e5-45a4-4247-b1b0-8f88be584115.mov"
  "236649724-28ffb34e-f967-4591-9a42-13d9d1d20cf1.mp4"
)
USER_IMAGE_URLS=(
  "https://user-images.githubusercontent.com/2805320/236633815-8a714b8d-97d0-4b26-b04e-1e1b5bbf8c0d.MP4"
  "https://user-images.githubusercontent.com/2805320/236633812-e237aa2f-3608-4e26-b8fa-f8991d6a6355.mov"
  "https://user-images.githubusercontent.com/2805320/236649726-82140d72-177f-4895-ac61-6827a13dd8e9.MP4"
  "https://user-images.githubusercontent.com/2805320/236649722-47f571e5-45a4-4247-b1b0-8f88be584115.mov"
  "https://user-images.githubusercontent.com/2805320/236649724-28ffb34e-f967-4591-9a42-13d9d1d20cf1.MP4"
)

echo "Downloading user-images.githubusercontent.com …"
for i in "${!USER_IMAGE_FILES[@]}"; do
  download "${USER_IMAGE_URLS[$i]}" "$OUT_DIR/${USER_IMAGE_FILES[$i]}"
done

echo ""
echo "Done → $OUT_DIR"
ls -lh "$OUT_DIR"
