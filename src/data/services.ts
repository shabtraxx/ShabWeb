export const SERVICES = [
  {
    name: 'Digital',
    icon: 'digital',
    promise: 'Get the change delivered, not just designed.',
    covers: [
      'Target operating model and roadmap',
      'Legacy replacement and cloud migration',
      'Supplier selection and contract scrutiny',
      'Delivery assurance on programmes in trouble',
    ],
    bestFor: 'Leadership teams mid-programme who need an honest read before the next gate.',
  },
  {
    name: 'Data',
    icon: 'data',
    promise: 'Numbers the business trusts enough to act on.',
    covers: [
      'Data strategy, ownership and governance',
      'Platform and warehouse architecture',
      'Reporting that answers real questions',
      'AI readiness — and where it is not worth it',
    ],
    bestFor: 'Organisations with plenty of dashboards and no shared version of the truth.',
  },
  {
    name: 'Cyber',
    icon: 'cyber',
    promise: 'Know what would actually hurt, and fix that first.',
    covers: [
      'Security posture and control reviews',
      'Third-party and supply chain risk',
      'Incident response planning and rehearsal',
      'Compliance work that survives an audit',
    ],
    bestFor: 'Teams facing a customer security review, an audit, or a board asking hard questions.',
  },
] as const;

export const PROCESS = [
  {
    title: 'Read the ground',
    body: 'Two to three weeks with your people, your systems and your contracts. You get what we found, including the parts nobody wanted to write down.',
  },
  {
    title: 'Agree what matters',
    body: 'A ranked, costed set of moves — with the ones we would not spend money on named just as plainly. You decide; we are not paid by the recommendation.',
  },
  {
    title: 'Deliver and hand over',
    body: 'We do the work alongside your team, then leave them the documentation, the decisions and the reasoning behind both.',
  },
] as const;
