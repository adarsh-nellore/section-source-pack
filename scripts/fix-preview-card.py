from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/screens/document-workspace/source-preview/SourcePreviewCard.tsx"

p = Path(__file__).with_name("SourcePreviewCard.tail.tsx")
if not p.exists():
    raise SystemExit("missing tail fragment")

head = TARGET.read_text()
cut = head.find("<PreviewTable artifact={artifact} compact={!isPage} />")
if cut == -1:
    raise SystemExit("anchor not found")
line_end = head.find("\n", cut) + 1
# drop corrupted remainder
tail = p.read_text()
TARGET.write_text(head[:line_end] + tail)
print("fixed", TARGET)
