import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Need, NeedStatus, NeedCategory, Organization } from '../types';
import { mockNeeds, mockOrganizations } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/api';

function Home() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filterCategory, setFilterCategory] = useState<NeedCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<NeedStatus | 'all'>('all');
  const [filterOrganization, setFilterOrganization] = useState<string | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<string | 'all'>('all');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Set page title
    document.title = 'Friend Indeed - Help for everyday needs';
  }, []);

  const loadData = async () => {
    try {
      // For now, use mock data while API is being set up
      // TODO: Replace with real API calls once backend is deployed
      setNeeds(mockNeeds);
      setOrganizations(mockOrganizations);
      
      // Uncomment when API is ready:
      // const [needsData, orgsData] = await Promise.all([
      //   apiClient.getNeeds(),
      //   apiClient.getOrganizations()
      // ]);
      // setNeeds(needsData);
      // setOrganizations(orgsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data on error
      setNeeds(mockNeeds);
      setOrganizations(mockOrganizations);
    } finally {
      setDataLoading(false);
    }
  };

  const filteredNeeds = needs.filter(need => {
    const categoryMatch = filterCategory === 'all' || need.category === filterCategory;
    const statusMatch = filterStatus === 'all' || need.status === filterStatus;
    const organizationMatch = filterOrganization === 'all' || need.organizationId === filterOrganization;
    const locationMatch = filterLocation === 'all' || need.location.toLowerCase().includes(filterLocation.toLowerCase());
    return categoryMatch && statusMatch && organizationMatch && locationMatch;
  });

  const getOrganizationById = (orgId: string): Organization | undefined => {
    return organizations.find(org => org.id === orgId);
  };

  const uniqueLocations = Array.from(new Set(organizations.map(org => org.location)));

  const handleVolunteer = async (needId: string) => {
    console.log('handleVolunteer called with needId:', needId);
    console.log('user:', user);
    
    if (!isAuthenticated) {
      console.log('No authentication, redirecting to login');
      login('github'); // Use GitHub as default login provider
      return;
    }
    
    try {
      console.log('User authenticated, claiming need');
      // TODO: Replace with real API call once backend is deployed
      // const claimedNeed = await apiClient.claimNeed(needId);
      
      // For now, update local state
      setNeeds(prev => prev.map(need => 
        need.id === needId 
          ? { ...need, status: 'claimed' as NeedStatus, volunteerId: user.userId, claimedAt: new Date() }
          : need
      ));
    } catch (error) {
      console.error('Error claiming need:', error);
      alert('Failed to claim need. Please try again.');
    }
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
                <p style={{ 
                  fontSize: '14px', 
                  color: 'rgba(255,255,255,0.9)', 
                  margin: '0',
                  fontWeight: '500'
                }}>
                  Building stronger communities together
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {loading ? (
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>Loading...</div>
              ) : isAuthenticated ? (
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
                    <span style={{ color: 'white', fontWeight: '600' }}>Hello, {user?.userDetails || 'User'}</span>
                  </div>
                  <button
                    onClick={logout}
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
                <button
                  onClick={() => login('github')}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(79, 70, 229, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
                  }}
                >
                  <span>🚀</span>
                  <span>Login with GitHub</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', marginTop: '60px' }}>
          <div style={{ position: 'relative' }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '30px',
              lineHeight: '1.1'
            }}>
              Help Your Neighbors
            </h1>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '30px'
            }}>
              Build stronger communities together
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Connect with people in your community who need help with everyday tasks. 
              Every small act of kindness creates ripples of positive change.
            </p>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              borderRadius: '50%',
              opacity: '0.2',
              animation: 'pulse 2s infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              width: '130px',
              height: '130px',
              background: 'linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%)',
              borderRadius: '50%',
              opacity: '0.2',
              animation: 'pulse 2s infinite 0.7s'
            }}></div>
          </div>
        </div>

        {/* Organization Links */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '15px' }}>Choose Your Community</h3>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Browse opportunities by organization</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {organizations.map(org => (
              <Link
                key={org.id}
                to={`/org/${org.slug}`}
                style={{
                  display: 'block',
                  background: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
                  border: '1px solid #f3f4f6',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#c7d2fe';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#f3f4f6';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                    transition: 'transform 0.3s ease'
                  }}>
                    🏢
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#111827', marginBottom: '10px' }}>{org.name}</h4>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>📍</span>{org.location}, {org.region}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '20px', lineHeight: '1.5' }}>{org.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#eef2ff',
                        padding: '8px 15px',
                        borderRadius: '25px'
                      }}>
                        <div style={{ width: '8px', height: '8px', background: '#4f46e5', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4338ca' }}>
                          {needs.filter(n => n.organizationId === org.id && n.status === 'open').length} open needs
                        </span>
                      </div>
                      <span style={{ color: '#4f46e5', fontWeight: '600', fontSize: '1.2rem' }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '15px' }}>Find the Right Opportunity</h3>
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
                  <span>🏢</span>
                  <span>Organization</span>
                </label>
                <select
                  value={filterOrganization}
                  onChange={(e) => setFilterOrganization(e.target.value)}
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
                  <option value="all">All Organizations</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
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
                  <span>📍</span>
                  <span>Location</span>
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
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
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
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
                {filterOrganization !== 'all' && <span> from {organizations.find(o => o.id === filterOrganization)?.name}</span>}
                {filterLocation !== 'all' && <span> in {filterLocation}</span>}
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
          {filteredNeeds.map((need) => {
            const organization = getOrganizationById(need.organizationId);
            // Authentication now handled by Azure Static Web Apps
            
            return (
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
              {/* Status Badge */}
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
                {/* Organization Info */}
                {organization && (
                  <div style={{
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <Link 
                      to={`/org/${organization.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#4f46e5',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#3730a3';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#4f46e5';
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#eef2ff',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>🏢</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>{organization.name}</span>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{organization.location}, {organization.region}</div>
                      </div>
                    </Link>
                  </div>
                )}
                
                {/* Title and Description */}
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
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">📍</span>
                    </div>
                    <span className="text-gray-700 text-sm">{need.location}</span>
                  </div>
                  {need.timeSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">🕐</span>
                      </div>
                      <span className="text-gray-700 text-sm">
                        {formatDate(slot.start)} - {formatDate(slot.end)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{getCategoryIcon(need.category)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{need.category}</span>
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

                {/* Authentication handled by Azure Static Web Apps */}
                
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
            );
          })}
        </div>

        {filteredNeeds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#9ca3af', fontSize: '1.2rem' }}>No needs found matching your filters.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default Home;