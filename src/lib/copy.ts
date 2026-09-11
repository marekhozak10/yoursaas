/**
 * Every Czech string visible to the user lives here.
 * Code (identifiers, types, comments) stays English.
 * Never add a Czech string literal anywhere else in the codebase.
 */

import type { RequestStatus, SystemKey } from "@/lib/types"

// Re-export with the names used in components
export type StatusKey = RequestStatus
export type { SystemKey }

export const copy = {
  /* ── Shell ──────────────────────────────────────────────────────────── */
  shell: {
    appName: 'Peoplebase',
    sections: {
      pozadavky: 'Požadavky',
      keSchvaleni: 'Ke schválení',
    },
    tenant: 'Alpina Hotels Group',
    switcherHeading: 'Přihlášen jako',
    scriptedBadge: 'nanečisto',
  },

  /* ── Status labels ──────────────────────────────────────────────────── */
  statusLabels: {
    submitted:          'Odesláno',
    processing:         'Probíhá',
    awaiting_approval:  'Čeká na schválení',
    approved:           'Schváleno',
    open:               'Otevřeno',
    declined:           'Zamítnuto',
    failed:             'Chyba',
  } as Record<StatusKey, string>,

  /* ── List ───────────────────────────────────────────────────────────── */
  list: {
    title:     'Požadavky na pozice',
    newButton: 'Nový požadavek',
    columns: {
      number:    'Číslo',
      position:  'Pozice',
      requester: 'Žadatel',
      status:    'Stav',
      updated:   'Aktualizováno',
    },
    filters: {
      all:              'Vše',
      inProgress:       'Probíhá',
      awaitingApproval: 'Ke schválení',
      open:             'Otevřené',
      declined:         'Zamítnuté',
    },
    empty: 'Zatím tu nic není. První požadavek začíná formulářem.',
  },

  /* ── Form ───────────────────────────────────────────────────────────── */
  form: {
    eyebrow:  'Nábor',
    title:    'Nový požadavek na pozici',
    subtitle: 'Provoz, střední Evropa. HR partner se vám ozve do dvou pracovních dnů.',
    labels: {
      team:          'Tým',
      title:         'Název pozice',
      seniority:     'Seniorita',
      startDate:     'Nástup od',
      location:      'Lokalita',
      justification: 'Proč tuto pozici a proč teď',
    },
    seniorityOptions: {
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      lead:   'Lead',
    },
    justificationHelper: 'čím víc kontextu, tím lepší podklad',
    submitButton: 'Odeslat požadavek',
    cancelButton: 'Zrušit',
    footer: 'Šest polí. Žádný schvalovací řetězec k zapamatování, žádný automatizační nástroj, do kterého se musíte přihlásit, žádný ticket na HR.',
    validation: {
      required:    'Tohle pole vyplňte.',
      tooShort:    'Napište aspoň pár vět, agent z toho vychází.',
      dateInPast:  'Datum nástupu musí být v budoucnu.',
    },
  },

  /* ── Detail ─────────────────────────────────────────────────────────── */
  detail: {
    sectionHeadings: {
      request:  'Požadavek',
      context:  'Kontext',
      draft:    'Návrh',
      decision: 'Rozhodnutí',
      systems:  'Systémy',
    },
    timelineHeader: {
      live: 'Živě',
      done: 'Hotovo',
    },
    requestFields: {
      team:          'Tým',
      seniority:     'Seniorita',
      startDate:     'Nástup od',
      location:      'Lokalita',
      justification: 'Zdůvodnění',
    },
    contextTiles: {
      salaryBand: 'Mzdové pásmo',
      timeToFill: 'Doba obsazení',
      lastAd:     'Poslední inzerát týmu',
    },
    contextCaptions: {
      inBand:        'v rozmezí',
      outOfBand:     'mimo rozmezí',
      medianCaption: 'medián, tato pozice',
    },
    draftEyebrow: 'Inzerát, napsaný podle vašich posledních tří',
    draftLink:    'Zobrazit celý návrh',
    criteriaHeading: 'Kritéria pro screening',
    costLabel:    'Roční náklad',
    costCaption:  'včetně odvodů',
    waitingState: 'Dokud někdo neklikne, nikde se nic nezveřejní ani nezaloží.',
  },

  /* ── Timeline summaries ─────────────────────────────────────────────── */
  timeline: {
    /** Static summaries keyed by event type. For system.updated use the sub-key variants below. */
    summaries: {
      'local.submitted':       'Požadavek odeslán',
      'flow.started':          'Workflow převzalo požadavek',
      'context.loaded':        'Načteno mzdové pásmo a poslední inzeráty týmu',
      'draft.ready':           'Inzerát napsaný, pět kritérií, spočítaný náklad',
      'draft.ready.outOfBand': 'Inzerát napsaný, ale mzda vybočuje z pásma',
      'local.approved':        'Petra Málková schválila',
      'local.declined':        'Petra Málková zamítla',
      'system.updated.ats':    'Pozice založená v ATS',
      'system.updated.job_board': 'Inzerát zveřejněný na job boardu',
      'system.updated.slack':  'Náborový kanál založený, panel pozvaný',
      'system.updated.drive':  'Složka se scorecardy vytvořená ze šablony',
      'flow.completed':        'Pozice je otevřená',
      'local.trigger_failed':  'Workflow nedosažitelné, běží náhradní scénář',
    } as Record<string, string>,
    /** Builder for flow.failed – needs the error message from the event. */
    flowFailed: (message: string) => `Workflow se zastavilo: ${message}`,
  },

  /* ── Approval card ──────────────────────────────────────────────────── */
  approvalCard: {
    /** Genitive name is seeded in user data (e.g. "Jany Dvořákové"). */
    leadLine: (genitiveName: string, title: string) =>
      `Nový požadavek na pozici od ${genitiveName}, ${title}. Čeká na tvoje rozhodnutí.`,
    statLabels: {
      salaryBand: 'Mzdové pásmo',
      annualCost: 'Roční náklad',
      timeToFill: 'Doba obsazení',
    },
    approveButton:  'Schválit',
    declineButton:  'Zamítnout',
    waitingFooter:  'Čeká na Petru Málkovou, HR partnerku.',
    decidedApproved: (time: string) => `Schválila Petra Málková v ${time}.`,
    decidedDeclined: (time: string) => `Zamítla Petra Málková v ${time}.`,
    declineDialog: {
      title:   'Proč to zamítáte?',
      helper:  'Jednou větou. Vrátí se to žadateli.',
      confirm: 'Zamítnout požadavek',
      cancel:  'Zpět',
    },
  },

  /* ── Systems ────────────────────────────────────────────────────────── */
  systems: {
    titles: {
      ats:       'Pozice v ATS',
      job_board: 'Inzerát na job boardu',
      slack:     'Náborový kanál',
      drive:     'Složka se scorecardy',
    } as Record<SystemKey, string>,
    captions: {
      pending: 'čeká',
      created: {
        ats:       'založeno',
        job_board: 'zveřejněno',
        slack:     'založen, pozváno 6 lidí',
        drive:     'vytvořeno ze šablony',
      } as Record<SystemKey, string>,
      failed: 'nepovedlo se',
    },
  },

  /* ── Approvals page ─────────────────────────────────────────────────── */
  approvalsPage: {
    title: 'Ke schválení',
    empty: 'Nic na vás nečeká.',
  },
} as const
