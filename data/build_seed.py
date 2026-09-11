#!/usr/bin/env python3
"""Builds data/seed.json. Run once; the output is what ships. Kept in the repo so the
seeded history can be regenerated if it drifts. Keys English, labels Czech."""
import json, datetime as dt

BASE = dt.datetime(2026, 9, 30, 8, 0, tzinfo=dt.timezone.utc)
def iso(minutes=0, days=0):
    return (BASE + dt.timedelta(days=days, minutes=minutes)).isoformat().replace("+00:00", "Z")

users = [
    {"id": "u_jana", "name": "Jana Dvořáková", "nameGenitive": "Jany Dvořákové",
     "initials": "JD", "title": "ředitelka provozu, střední Evropa",
     "email": "jana.dvorakova@alpinahotels.example", "role": "manager"},
    {"id": "u_petra", "name": "Petra Málková", "nameGenitive": "Petry Málkové",
     "initials": "PM", "title": "HR partnerka",
     "email": "petra.malkova@alpinahotels.example", "role": "hrbp"},
]

teams = [
    {"id": "t_revmgmt", "name": "Revenue management, střední Evropa", "costCenter": "CE-RM-01"},
    {"id": "t_recepce", "name": "Recepce, Praha", "costCenter": "CE-FO-04"},
    {"id": "t_fnb", "name": "Gastro, Vídeň", "costCenter": "AT-FB-02"},
]

def band(team, sen, name, lo, hi):
    return {"teamId": team, "seniority": sen, "band": name, "currency": "CZK",
            "minMinor": lo * 100, "maxMinor": hi * 100}

bands = [
    band("t_revmgmt", "medior", "Pásmo 3", 62000, 82000),
    band("t_revmgmt", "senior", "Pásmo 4", 95000, 120000),
    band("t_revmgmt", "lead", "Pásmo 5", 125000, 165000),
    band("t_recepce", "junior", "Pásmo 1", 32000, 41000),
    band("t_recepce", "medior", "Pásmo 2", 44000, 58000),
    band("t_recepce", "senior", "Pásmo 3", 60000, 78000),
    band("t_fnb", "junior", "Pásmo 1", 31000, 40000),
    band("t_fnb", "medior", "Pásmo 2", 43000, 56000),
    band("t_fnb", "senior", "Pásmo 3", 58000, 75000),
]

SYSTEM_KEYS = ["ats", "job_board", "slack", "drive"]

def systems(done, refs=None):
    refs = refs or {}
    out = []
    for k in SYSTEM_KEYS:
        e = {"key": k, "status": "created" if done else "pending"}
        if done and refs.get(k):
            e.update({"ref": refs[k], "url": "#", "updatedAt": iso(days=-2)})
        out.append(e)
    return out

def ev(n, at, typ, actor, summary):
    return {"id": n, "at": at, "type": typ, "actor": actor, "summary": summary}

def request(pid, rid, title, team, sen, status, days_ago, location="Praha, hybridně",
            approval=None, done=False, refs=None):
    events = [
        ev(f"{rid}_1", iso(days=days_ago), "local.submitted", "u_jana", "Požadavek odeslán"),
        ev(f"{rid}_2", iso(days=days_ago, minutes=1), "flow.started", "workflow",
           "Workflow převzalo požadavek"),
        ev(f"{rid}_3", iso(days=days_ago, minutes=2), "draft.ready", "agent",
           "Inzerát napsaný, pět kritérií, spočítaný náklad"),
    ]
    if approval and approval["decision"] == "approved":
        events.append(ev(f"{rid}_4", approval["decidedAt"], "local.approved", "u_petra",
                         "Petra Málková schválila"))
    if approval and approval["decision"] == "declined":
        events.append(ev(f"{rid}_4", approval["decidedAt"], "local.declined", "u_petra",
                         "Petra Málková zamítla"))
    if done:
        events.append(ev(f"{rid}_5", iso(days=days_ago, minutes=8), "flow.completed",
                         "workflow", "Pozice je otevřená"))
    return {
        "id": rid, "publicId": pid, "requesterId": "u_jana", "teamId": team,
        "title": title, "seniority": sen, "location": location,
        "targetStartDate": (BASE + dt.timedelta(days=days_ago + 60)).date().isoformat(),
        "justification": "Seedovaná historie, schválně krátká.",
        "status": status,
        "createdAt": iso(days=days_ago), "updatedAt": iso(days=days_ago, minutes=90),
        "context": {"band": "Pásmo 3", "medianTimeToFillDays": 39,
                    "lastAdWrittenAt": iso(days=days_ago - 40)},
        "draft": None,
        "approval": approval,
        "systems": systems(done, refs),
        "events": events,
        "callbackToken": f"seed_token_{rid}",
    }

def approved(days_ago):
    return {"approverId": "u_petra", "decision": "approved",
            "decidedAt": iso(days=days_ago, minutes=140), "comment": None}

requests = [
    request("POZ-2026-009", "r_009", "Vedoucí směny na recepci", "t_recepce", "medior",
            "open", -21, approval=approved(-21), done=True,
            refs={"ats": "ATS-8712", "job_board": "JB-41209",
                  "slack": "#nabor-vedouci-smeny", "drive": "Scorecards / Vedoucí směny"}),
    request("POZ-2026-010", "r_010", "Sous chef", "t_fnb", "senior", "open", -18,
            location="Vídeň, na place", approval=approved(-18), done=True,
            refs={"ats": "ATS-8730", "job_board": "JB-41355",
                  "slack": "#nabor-sous-chef", "drive": "Scorecards / Sous chef"}),
    request("POZ-2026-011", "r_011", "Noční recepční", "t_recepce", "junior",
            "declined", -14,
            approval={"approverId": "u_petra", "decision": "declined",
                      "decidedAt": iso(days=-14, minutes=140),
                      "comment": "Pokryjte to zatím ze stávajícího rozpisu, vrátíme se k tomu v lednu."}),
    request("POZ-2026-012", "r_012", "Rezervační referent", "t_recepce", "junior",
            "open", -11, approval=approved(-11), done=True,
            refs={"ats": "ATS-8798", "job_board": "JB-41502",
                  "slack": "#nabor-rezervace", "drive": "Scorecards / Rezervace"}),
    request("POZ-2026-013", "r_013", "Revenue analytik", "t_revmgmt", "medior", "open", -3,
            approval=approved(-3), done=True,
            refs={"ats": "ATS-8835", "job_board": "JB-41688",
                  "slack": "#nabor-revenue-analytik", "drive": "Scorecards / Revenue analytik"}),
]

store = {"users": users, "teams": teams, "bands": bands, "requests": requests}
with open("seed.json", "w", encoding="utf-8") as f:
    json.dump(store, f, indent=2, ensure_ascii=False)
print("seed.json:", len(users), "users,", len(teams), "teams,", len(bands), "bands,",
      len(requests), "requests")
