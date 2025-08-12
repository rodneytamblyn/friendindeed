const { CosmosClient } = require('@azure/cosmos');

// Configuration
const endpoint = 'https://cosmos-friendindeed-prod.documents.azure.com:443/';
const key = process.env.COSMOS_KEY; // Set this environment variable
const databaseName = 'friendindeed';

const client = new CosmosClient({ endpoint, key });

// Seed data
const organizations = [
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
    createdAt: new Date(2025, 0, 1).toISOString()
  }
];

const needs = [
  {
    id: '1',
    title: 'Grocery Shopping Help',
    description: 'Need someone to help with weekly grocery shopping. I have mobility issues and would appreciate assistance picking up items from the local supermarket.',
    category: 'meals',
    location: 'George Street, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 14, 10, 0).toISOString(),
        end: new Date(2025, 7, 14, 12, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 10).toISOString()
  },
  {
    id: '2',
    title: 'Transport to Medical Appointment',
    description: 'Looking for a ride to my oncology appointment at Dunedin Hospital. The appointment is important for my ongoing treatment.',
    category: 'transport',
    location: 'North Dunedin to Dunedin Hospital',
    timeSlots: [
      {
        start: new Date(2025, 7, 16, 14, 0).toISOString(),
        end: new Date(2025, 7, 16, 16, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 11).toISOString()
  },
  {
    id: '3',
    title: 'Afternoon Companionship',
    description: 'Would love some company for tea and conversation. I live alone and enjoy meeting new people and sharing stories about Dunedin.',
    category: 'companionship',
    location: 'St Clair, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 15, 15, 0).toISOString(),
        end: new Date(2025, 7, 15, 17, 0).toISOString()
      }
    ],
    status: 'claimed',
    organizationId: '1',
    requesterId: '1',
    volunteerId: '2',
    createdAt: new Date(2025, 7, 9).toISOString(),
    claimedAt: new Date(2025, 7, 12).toISOString()
  },
  {
    id: '4',
    title: 'Help with Technology',
    description: 'Need assistance setting up my new tablet and learning how to video call with family members overseas.',
    category: 'other',
    location: 'Roslyn, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 17, 13, 0).toISOString(),
        end: new Date(2025, 7, 17, 15, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 11).toISOString()
  },
  {
    id: '5',
    title: 'Meal Delivery Support',
    description: 'Help needed to deliver prepared meals to families in our care. This is a meaningful way to support families during difficult times.',
    category: 'meals',
    location: 'Central Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 18, 11, 0).toISOString(),
        end: new Date(2025, 7, 18, 14, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 12).toISOString()
  },
  {
    id: '6',
    title: 'Garden Maintenance',
    description: 'Help maintain our peaceful memorial garden. Light gardening work including weeding and planting seasonal flowers.',
    category: 'other',
    location: 'Hospice Grounds, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 19, 9, 0).toISOString(),
        end: new Date(2025, 7, 19, 12, 0).toISOString()
      }
    ],
    status: 'completed',
    organizationId: '1',
    requesterId: '1',
    volunteerId: '2',
    createdAt: new Date(2025, 7, 5).toISOString(),
    claimedAt: new Date(2025, 7, 6).toISOString()
  },
  {
    id: '7',
    title: 'Family Transport Support',
    description: 'Provide transport for family members visiting patients. Help ensure families can spend precious time together.',
    category: 'transport',
    location: 'Various Dunedin locations',
    timeSlots: [
      {
        start: new Date(2025, 7, 20, 14, 0).toISOString(),
        end: new Date(2025, 7, 20, 17, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 13).toISOString()
  },
  {
    id: '8',
    title: 'Administrative Support',
    description: 'Help with filing, data entry, and general office tasks. Perfect for someone who enjoys helping behind the scenes.',
    category: 'other',
    location: 'Hospice Office, Dunedin',
    timeSlots: [
      {
        start: new Date(2025, 7, 21, 10, 0).toISOString(),
        end: new Date(2025, 7, 21, 13, 0).toISOString()
      }
    ],
    status: 'open',
    organizationId: '1',
    requesterId: '1',
    createdAt: new Date(2025, 7, 14).toISOString()
  }
];

async function seedDatabase() {
  try {
    const database = client.database(databaseName);

    // Seed Organizations
    console.log('Seeding organizations...');
    const orgContainer = database.container('organizations');
    
    for (const org of organizations) {
      try {
        const { resource } = await orgContainer.items.create(org);
        console.log(`Created organization: ${resource.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`Organization ${org.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    // Seed Needs
    console.log('Seeding needs...');
    const needsContainer = database.container('needs');
    
    for (const need of needs) {
      try {
        const { resource } = await needsContainer.items.create(need);
        console.log(`Created need: ${resource.title}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`Need ${need.title} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  if (!process.env.COSMOS_KEY) {
    console.error('Please set the COSMOS_KEY environment variable');
    process.exit(1);
  }
  seedDatabase();
}

module.exports = { seedDatabase };