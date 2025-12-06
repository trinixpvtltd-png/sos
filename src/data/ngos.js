export const NGO_LEVELS = {
  DISTRICT: 'district',
  STATE: 'state',
  NATIONAL: 'national',
  GLOBAL: 'global',
};

export const ngos = [
  {
    id: 'n1',
    name: 'Shruti Child Welfare Trust',
    level: NGO_LEVELS.DISTRICT,
    category: 'Child Welfare',
    description:
      'Educating children with no access to schools after the flood. Verified teaching volunteers on ground.',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=60',
    raisedAmount: 17843.43,
    goalAmount: 25000,
    location: 'Gautam Buddha Nagar',
    progress: 17843.43 / 25000,
  },
  {
    id: 'n2',
    name: 'Food for All Collective',
    level: NGO_LEVELS.STATE,
    category: 'Food Relief',
    description:
      'Hot meals for migrant workers and daily wage earners across Delhi NCR.',
    imageUrl:
      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=900&q=60',
    raisedAmount: 23450,
    goalAmount: 30000,
    location: 'Delhi NCR',
    progress: 23450 / 30000,
  },
  {
    id: 'n3',
    name: 'Global Seva Network',
    level: NGO_LEVELS.GLOBAL,
    category: 'Disaster Relief',
    description:
      'Cross-border coordination for refugees and rapid response training.',
    imageUrl:
      'https://images.unsplash.com/photo-1519996529931-28324d5a6304?auto=format&fit=crop&w=900&q=60',
    raisedAmount: 84500,
    goalAmount: 120000,
    location: 'Global',
    progress: 84500 / 120000,
  },
  {
    id: 'n4',
    name: 'Sankatmochan Medical Corps',
    level: NGO_LEVELS.NATIONAL,
    category: 'Medical Aid',
    description:
      'Verified doctors providing emergency triage units during calamities.',
    imageUrl:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=900&q=60',
    raisedAmount: 45670,
    goalAmount: 90000,
    location: 'India',
    progress: 45670 / 90000,
  },
];
