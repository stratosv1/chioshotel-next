from pathlib import Path

path = Path("scripts/apply-italian-seo-cleanup.py")
source = path.read_text(encoding="utf-8")
old = 'old_swipe = \'  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";\''
new = 'old_swipe = \'  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isFrenchCopy(copy) ? "Balayez" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";\''
if old not in source:
    raise RuntimeError("Could not repair swipe marker in Italian cleanup patch")
source = source.replace(old, new, 1)
exec(compile(source, str(path), "exec"), {"__name__": "__main__", "__file__": str(path)})
