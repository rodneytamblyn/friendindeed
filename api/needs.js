const { app } = require('@azure/functions');

// Mock data for needs
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

app.http('needs', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Needs API called');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    try {
      if (request.method === 'GET') {
        // Handle filtering based on query parameters
        const url = new URL(request.url);
        const organizationFilter = url.searchParams.get('organization');
        const locationFilter = url.searchParams.get('location');
        const categoryFilter = url.searchParams.get('category');
        const statusFilter = url.searchParams.get('status');

        let filteredNeeds = needs;

        if (organizationFilter) {
          filteredNeeds = filteredNeeds.filter(need => need.organizationId === organizationFilter);
        }
        if (locationFilter) {
          filteredNeeds = filteredNeeds.filter(need => 
            need.location.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        if (categoryFilter) {
          filteredNeeds = filteredNeeds.filter(need => need.category === categoryFilter);
        }
        if (statusFilter) {
          filteredNeeds = filteredNeeds.filter(need => need.status === statusFilter);
        }

        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify(filteredNeeds)
        };
      } else if (request.method === 'POST') {
        // Handle need creation (mock implementation)
        const body = await request.json();
        const newNeed = {
          id: (needs.length + 1).toString(),
          ...body,
          status: 'open',
          createdAt: new Date().toISOString()
        };
        needs.push(newNeed);

        return {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(newNeed)
        };
      }
    } catch (error) {
      context.error('Error in needs endpoint:', error);
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }
});