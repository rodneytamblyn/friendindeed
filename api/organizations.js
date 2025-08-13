const { app } = require('@azure/functions');

// Mock data for organizations
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

app.http('organizations', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Organizations API called');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    try {
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(organizations)
      };
    } catch (error) {
      context.error('Error in organizations endpoint:', error);
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