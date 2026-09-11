#!/usr/bin/env python3
"""Turns the design canvas .dc.html artboards into plain HTML you can open in a
browser and Claude Code can read as a visual reference."""
import re, pathlib, sys

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/innovation-week")
OUT = pathlib.Path(__file__).parent
NAMES = {"RequestForm": "form", "ApprovalCard": "approval",
         "Main": "designer", "FlowMap": "flow"}

for stem, out_name in NAMES.items():
    raw = (SRC / f"{stem}.dc.html").read_text(encoding="utf-8")
    helmet = re.search(r"<helmet>(.*?)</helmet>", raw, re.S)
    head_extra = helmet.group(1) if helmet else ""
    body = raw
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)
    body = body.replace('<script src="./support.js"></script>', "")
    body = body.replace("<x-dc>", "").replace("</x-dc>", "")
    body = body.replace("</head>", head_extra + "\n</head>")
    body = body.replace("<head>", "<head>\n  <title>Peoplebase mockup: " + out_name + "</title>")
    (OUT / f"{out_name}.html").write_text(body, encoding="utf-8")
    print("wrote", out_name + ".html")
