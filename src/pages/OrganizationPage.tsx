import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Need, User, NeedStatus, NeedCategory, Organization } from '../types';
import { mockNeeds, mockOrganizations, getCurrentUser, setCurrentUser } from '../data/mockData';

function OrganizationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [filterCategory, setFilterCategory] = useState<NeedCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<NeedStatus | 'all'>('all');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const org = mockOrganizations.find(o => o.slug === slug);
    setOrganization(org || null);
    
    if (org) {
      const orgNeeds = mockNeeds.filter(need => need.organizationId === org.id);
      setNeeds(orgNeeds);
      
      // Set dynamic page title
      document.title = `Friend Indeed - ${org.name}`;
    } else {
      // Fallback title if organization not found
      document.title = 'Friend Indeed - Organization Not Found';
    }
    
    setCurrentUserState(getCurrentUser());
  }, [slug]);

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h2>
          <p className="text-gray-600 mb-6">The organization you're looking for doesn't exist.</p>
          <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredNeeds = needs.filter(need => {
    const categoryMatch = filterCategory === 'all' || need.category === filterCategory;
    const statusMatch = filterStatus === 'all' || need.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const handleVolunteer = (needId: string) => {
    console.log('OrganizationPage handleVolunteer called with needId:', needId);
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, opening signup modal');
      setIsSigningUp(true);
      return;
    }
    
    console.log('User exists, claiming need');
    setNeeds(prev => prev.map(need => 
      need.id === needId 
        ? { ...need, status: 'claimed' as NeedStatus, volunteerId: currentUser.id, claimedAt: new Date() }
        : need
    ));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: signupForm.name,
      email: signupForm.email,
      role: 'volunteer'
    };
    setCurrentUser(newUser);
    setCurrentUserState(newUser);
    setIsSigningUp(false);
    setSignupForm({ name: '', email: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: NeedCategory) => {
    switch (category) {
      case 'transport': return '🚗';
      case 'meals': return '🍽️';
      case 'companionship': return '💬';
      case 'other': return '🤝';
    }
  };

  const getCategoryColor = (category: NeedCategory) => {
    switch (category) {
      case 'transport': return 'bg-blue-100 text-blue-800';
      case 'meals': return 'bg-green-100 text-green-800';
      case 'companionship': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                backdropFilter: 'blur(10px)'
              }}>
                🤝
              </div>
              <div>
                <Link to="/" style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  textDecoration: 'none',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Friend Indeed
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>→</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '500' }}>{organization.name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-gray-700">Hello, {currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsSigningUp(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up to Help
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{organization.location}, {organization.region}</p>
              {organization.description && (
                <p className="text-gray-700 mb-4">{organization.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {organization.website && (
                  <a 
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    🌐 Visit Website
                  </a>
                )}
                <span>📧 {organization.contactEmail}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600">
                  {needs.filter(n => n.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">Open Needs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as NeedCategory | 'all')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="transport">Transport</option>
              <option value="meals">Meals & Shopping</option>
              <option value="companionship">Companionship</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as NeedStatus | 'all')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="open">Available to Help</option>
              <option value="claimed">Already Claimed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Needs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNeeds.map((need) => (
            <div key={need.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(need.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(need.category)}`}>
                    {need.category}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  need.status === 'open' ? 'bg-green-100 text-green-800' :
                  need.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                  need.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {need.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{need.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{need.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <span className="font-medium">📍 Location:</span>
                  <span className="ml-2">{need.location}</span>
                </div>
                {need.timeSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="font-medium">🕐 Time:</span>
                    <span className="ml-2">
                      {formatDate(slot.start)} - {formatDate(slot.end)}
                    </span>
                  </div>
                ))}
              </div>

              {need.status === 'open' && (
                <button
                  onClick={() => handleVolunteer(need.id)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  🙋‍♀️ I can help!
                </button>
              )}
              
              {need.status === 'claimed' && need.volunteerId && (
                <div className="text-sm text-gray-500">
                  Claimed {need.claimedAt && `on ${formatDate(need.claimedAt)}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredNeeds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No needs found for this organization.</p>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
              ← Browse all needs
            </Link>
          </div>
        )}
      </main>

      {/* Signup Modal */}
      {isSigningUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Sign up to volunteer</h3>
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Sign Up & Help
                </button>
                <button
                  type="button"
                  onClick={() => setIsSigningUp(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationPage;