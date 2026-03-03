export const CONTACT_FILTERS = ['All', 'Active', 'Family', 'Friend', 'Guardian', 'Police'];

export const CONTACT_RELATIONS = [
  'Family',
  'Friend',
  'Guardian',
  'Police',
  'Neighbor',
  'Other',
];

export const CONTACT_PRIORITIES = ['High', 'Medium', 'Low'];

export const defaultContacts = [
  {
    id: 'ct-1001',
    name: 'Neha Jain',
    phone: '+91 9876543210',
    alternatePhone: '+91 9898989898',
    relation: 'Family',
    priority: 'High',
    isActiveForSos: true,
    notes: 'Sister. Lives 15 minutes away.',
  },
  {
    id: 'ct-1002',
    name: 'Rajat Verma',
    phone: '+91 9811122233',
    alternatePhone: '',
    relation: 'Friend',
    priority: 'Medium',
    isActiveForSos: true,
    notes: 'Trusted friend for late-night commute emergencies.',
  },
  {
    id: 'ct-1003',
    name: 'Mohan Sharma',
    phone: '+91 8800112233',
    alternatePhone: '',
    relation: 'Guardian',
    priority: 'High',
    isActiveForSos: true,
    notes: 'Apartment welfare lead.',
  },
  {
    id: 'ct-1004',
    name: 'Women Helpline 1091',
    phone: '1091',
    alternatePhone: '112',
    relation: 'Police',
    priority: 'High',
    isActiveForSos: false,
    notes: 'Regional emergency desk.',
  },
];
