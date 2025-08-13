const { app } = require('@azure/functions');

app.http('claim', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'needs/{needId}/claim',
  handler: async (request, context) => {
    context.log('Claim need API called');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    try {
      const needId = request.params.needId;
      
      // Mock response for claiming a need
      const claimedNeed = {
        id: needId,
        title: 'Mock Claimed Need',
        description: 'This need has been successfully claimed',
        category: 'other',
        location: 'Mock Location',
        timeSlots: [{
          start: new Date().toISOString(),
          end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }],
        status: 'claimed',
        organizationId: '1',
        requesterId: '1',
        volunteerId: 'mock-user-id',
        createdAt: new Date().toISOString(),
        claimedAt: new Date().toISOString()
      };

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(claimedNeed)
      };
    } catch (error) {
      context.error('Error in claim endpoint:', error);
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