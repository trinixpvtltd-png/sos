export const defaultDraftReports = [
  {
    id: 'DR-1001',
    category: 'Public atrocity',
    severity: 'High',
    anonymity: false,
    includeLocation: true,
    title: 'Harassment near metro exit',
    description: 'Repeated harassment observed near gate 2 around 8 PM.',
    attachments: [
      { id: 'att-1', type: 'photo', name: 'metro_gate.jpg' },
    ],
    status: 'Draft',
    updatedAt: '2026-02-28T07:20:00+05:30',
  },
  {
    id: 'DR-1002',
    category: 'Corruption',
    severity: 'Medium',
    anonymity: true,
    includeLocation: false,
    title: '',
    description: 'Suspicious cash exchange involving local contractors.',
    attachments: [],
    status: 'Failed',
    updatedAt: '2026-02-26T18:00:00+05:30',
  },
];
