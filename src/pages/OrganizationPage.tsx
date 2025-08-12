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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ color: 'white', fontWeight: '600' }}>Hello, {currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '20px',
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>🎯</span>
                  <span>Volunteer opportunities below</span>
                </div>
              )}
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
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Organization Hero Section */}
        <div style={{
          background: 'white',
          borderRadius: '30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
          padding: '50px',
          marginBottom: '60px',
          marginTop: '40px',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '20px',
                lineHeight: '1.1'
              }}>{organization.name}</h1>
              <p style={{
                fontSize: '1.3rem',
                color: '#6b7280',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📍</span>
                <span>{organization.location}, {organization.region}</span>
              </p>
              {organization.description && (
                <p style={{
                  fontSize: '1.1rem',
                  color: '#374151',
                  marginBottom: '30px',
                  lineHeight: '1.6'
                }}>{organization.description}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                {organization.website && (
                  <a 
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#4f46e5',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      padding: '12px 20px',
                      background: '#eef2ff',
                      borderRadius: '15px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ddd6fe';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#eef2ff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>🌐</span>
                    <span>Visit Website</span>
                  </a>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6b7280',
                  fontSize: '1rem',
                  padding: '12px 20px',
                  background: '#f9fafb',
                  borderRadius: '15px'
                }}>
                  <span>📧</span>
                  <span>{organization.contactEmail}</span>
                </div>
              </div>
            </div>
            <div style={{ minWidth: '200px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)',
                borderRadius: '25px',
                padding: '30px',
                textAlign: 'center',
                border: '1px solid #c7d2fe'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '10px'
                }}>
                  {needs.filter(n => n.status === 'open').length}
                </div>
                <div style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: '600' }}>Open Needs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '15px'
            }}>Find the Right Opportunity</h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Filter by your preferences and availability</p>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '30px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            padding: '40px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  <span>🎯</span>
                  <span>Category</span>
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as NeedCategory | 'all')}
                  style={{
                    width: '100%',
                    border: '2px solid #e5e7eb',
                    borderRadius: '15px',
                    padding: '15px 18px',
                    background: '#f9fafb',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="meals">🍽️ Meals & Shopping</option>
                  <option value="companionship">💬 Companionship</option>
                  <option value="other">🤝 Other</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  <span>⚡</span>
                  <span>Availability</span>
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as NeedStatus | 'all')}
                  style={{
                    width: '100%',
                    border: '2px solid #e5e7eb',
                    borderRadius: '15px',
                    padding: '15px 18px',
                    background: '#f9fafb',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Requests</option>
                  <option value="open">✅ Available to Help</option>
                  <option value="claimed">🟡 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            </div>
            
            {/* Filter Summary */}
            <div style={{
              marginTop: '30px',
              paddingTop: '30px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Showing <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>{filteredNeeds.length}</span> opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Needs Grid */}
        <div style={{
          display: 'grid',
          gap: '30px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
        }}>
          {filteredNeeds.map((need) => (
            <div key={need.id} style={{
              background: 'white',
              borderRadius: '30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#c7d2fe';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f3f4f6';
            }}>
              {/* Status Badge and Category Header */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 10
                }}>
                  <span style={{
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    color: 'white',
                    ...(need.status === 'open' ? { background: '#10b981' } :
                       need.status === 'claimed' ? { background: '#f59e0b' } :
                       need.status === 'completed' ? { background: '#3b82f6' } :
                       { background: '#6b7280' })
                  }}>
                    {need.status === 'open' ? 'Available' : 
                     need.status === 'claimed' ? 'In Progress' : 
                     need.status === 'completed' ? 'Completed' : 'Unavailable'}
                  </span>
                </div>
                
                {/* Category Icon Background */}
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '3.5rem', opacity: 0.9 }}>{getCategoryIcon(need.category)}</span>
                </div>
              </div>
              
              <div style={{ padding: '30px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '15px',
                  lineHeight: '1.3'
                }}>{need.title}</h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '25px',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>{need.description}</p>
              
                {/* Details */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: '#eef2ff',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <span style={{ fontSize: '1rem' }}>📍</span>
                    </div>
                    <span style={{ color: '#374151', fontSize: '1rem', fontWeight: '500' }}>{need.location}</span>
                  </div>
                  {need.timeSlots.map((slot, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: '#eef2ff',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <span style={{ fontSize: '1rem' }}>🕐</span>
                      </div>
                      <span style={{ color: '#374151', fontSize: '1rem' }}>
                        {formatDate(slot.start)} - {formatDate(slot.end)}
                      </span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: '#eef2ff',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem' }}>{getCategoryIcon(need.category)}</span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>{need.category}</span>
                  </div>
                </div>

                {/* Action Section */}
                {need.status === 'open' && (
                  <button
                    onClick={() => handleVolunteer(need.id)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      color: 'white',
                      padding: '18px 25px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #3730a3 0%, #6b21a8 100%)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(79, 70, 229, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
                    }}
                  >
                    <span>🙋‍♀️</span>
                    <span>I can help!</span>
                    <span>→</span>
                  </button>
                )}
                
                {need.status === 'claimed' && need.volunteerId && (
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '20px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>Claimed by volunteer</div>
                    <div style={{ fontSize: '0.9rem', color: '#d97706' }}>
                      {need.claimedAt && `on ${formatDate(need.claimedAt)}`}
                    </div>
                  </div>
                )}
                
                {need.status === 'completed' && (
                  <div style={{
                    background: '#dbeafe',
                    border: '1px solid #93c5fd',
                    borderRadius: '20px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#1d4ed8', fontWeight: '600' }}>✅ Completed</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNeeds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              background: 'white',
              borderRadius: '30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              padding: '60px',
              maxWidth: '500px',
              margin: '0 auto',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
              <p style={{ fontSize: '1.3rem', color: '#9ca3af', marginBottom: '30px' }}>No needs found for this organization.</p>
              <Link to="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '15px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(79, 70, 229, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <span>←</span>
                <span>Browse all needs</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Signup Modal */}
      {isSigningUp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '30px',
            padding: '40px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center',
              color: '#111827'
            }}>Sign up to volunteer</h3>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '15px',
                    border: '2px solid #e5e7eb',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '15px',
                    border: '2px solid #e5e7eb',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '18px 25px',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Sign Up & Help
                </button>
                <button
                  type="button"
                  onClick={() => setIsSigningUp(false)}
                  style={{
                    flex: 1,
                    background: '#d1d5db',
                    color: '#374151',
                    padding: '18px 25px',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#d1d5db';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
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