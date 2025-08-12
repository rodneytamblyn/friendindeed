import type { Need, User, Organization } from '../types';

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Otago Community Hospice',
    slug: 'otago-hospice',
    location: 'Dunedin',
    region: 'Otago',
    description: 'Supporting families through end-of-life care with compassion and dignity.',
    contactEmail: 'volunteer@otagohospice.co.nz',
    website: 'https://otagohospice.co.nz',
    isActive: true,
    createdAt: new Date(2025, 0, 1)
  }
  // Additional organizations can be added here as needed
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'requester',
    organizationId: '1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'volunteer',
    preferredLocations: ['Dunedin', 'Auckland']
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah@otagohospice.co.nz',
    role: 'org_admin',
    organizationId: '1'
  },
  {
    id: '4',
    name: 'Platform Admin',
    email: 'admin@friendindeed.com',
    role: 'platform_admin'
  }
];

export const mockNeeds: Need[] = [
  {
    id: '1',
    title: 'Grocery Shopping Help',
    description: 'Need someone to help with weekly grocery shopping. I have mobility issues and would appreciate assistance picking up items from the local supermarket.',
    category: 'meals',
    location: 'George Street, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 14, 10, 0),
        end: new Date(2025, 7, 14, 12, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 10)
  },
  {
    id: '2',
    title: 'Transport to Medical Appointment',
    description: 'Looking for a ride to my oncology appointment at Dunedin Hospital. The appointment is important for my ongoing treatment.',
    category: 'transport',
    location: 'North Dunedin to Dunedin Hospital',
    timeSlots: [
      {
        start: new Date(2025, 7, 16, 14, 0),
        end: new Date(2025, 7, 16, 16, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 11)
  },
  {
    id: '3',
    title: 'Afternoon Companionship',
    description: 'Would love some company for tea and conversation. I live alone and enjoy meeting new people and sharing stories about Dunedin.',
    category: 'companionship',
    location: 'St Clair, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 15, 15, 0),
        end: new Date(2025, 7, 15, 17, 0)
      }
    ],
    status: 'claimed',
    organizationId: '1',
    requesterId: '1',
    volunteerId: '2',
    createdAt: new Date(2025, 7, 9),
    claimedAt: new Date(2025, 7, 12)
  },
  {
    id: '4',
    title: 'Help with Technology',
    description: 'Need assistance setting up my new tablet and learning how to video call with family members overseas.',
    category: 'other',
    location: 'Roslyn, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 17, 13, 0),
        end: new Date(2025, 7, 17, 15, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 11)
  },
  {
    id: '5',
    title: 'Meal Delivery Support',
    description: 'Help needed to deliver prepared meals to families in our care. This is a meaningful way to support families during difficult times.',
    category: 'meals',
    location: 'Central Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 18, 11, 0),
        end: new Date(2025, 7, 18, 14, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 12)
  },
  {
    id: '6',
    title: 'Garden Maintenance',
    description: 'Help maintain our peaceful memorial garden. Light gardening work including weeding and planting seasonal flowers.',
    category: 'other',
    location: 'Hospice Grounds, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 19, 9, 0),
        end: new Date(2025, 7, 19, 12, 0)
      }
    ],
    status: 'completed',
    organizationId: '1',
    requesterId: '1',
    volunteerId: '2',
    createdAt: new Date(2025, 7, 5),
    claimedAt: new Date(2025, 7, 6)
  },
  {
    id: '7',
    title: 'Family Transport Support',
    description: 'Provide transport for family members visiting patients. Help ensure families can spend precious time together.',
    category: 'transport',
    location: 'Various Dunedin locations',
    timeSlots: [
      {
        start: new Date(2025, 7, 20, 14, 0),
        end: new Date(2025, 7, 20, 17, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 13)
  },
  {
    id: '8',
    title: 'Administrative Support',
    description: 'Help with filing, data entry, and general office tasks. Perfect for someone who enjoys helping behind the scenes.',
    category: 'other',
    location: 'Hospice Office, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 21, 10, 0),
        end: new Date(2025, 7, 21, 13, 0)
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 14)
  }
];

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};