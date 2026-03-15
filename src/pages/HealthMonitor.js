import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HealthMonitor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('physical');
  
  // Physical Health State - User Input
  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    spo2: '',
    temperature: '',
  });

  // Mental Health State
  const [mentalHealth, setMentalHealth] = useState({
    stress: 50,
    anxiety: 50,
    isolation: 50,
    focus: 50,
    sleepQuality: 'Good',
    mood: 'Positive',
  });

  const [recommendation, setRecommendation] = useState('Fill in your vitals above to get personalized recommendations.');

  // Generate mental health recommendations
  const updateRecommendations = () => {
    const avgStress = (mentalHealth.stress + mentalHealth.anxiety + mentalHealth.isolation) / 3;
    
    if (avgStress > 70) {
      setRecommendation('🚨 High stress detected. Consider meditation or connecting with mission control.');
    } else if (avgStress > 50) {
      setRecommendation('⚠️ Moderate stress levels. Take regular breaks and practice breathing exercises.');
    } else {
      setRecommendation('✅ Good mental wellness! Keep up with your daily wellness routine.');
    }
  };

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMentalChange = (field, value) => {
    const newMental = { ...mentalHealth, [field]: value };
    setMentalHealth(newMental);
    updateRecommendations();
  };

  const handleSaveVitals = () => {
    if (vitals.heartRate && vitals.bloodPressure && vitals.spo2 && vitals.temperature) {
      sessionStorage.setItem('vitals', JSON.stringify(vitals));
      alert('✅ Vitals saved successfully! Backend ML model will compare with normal ranges.');
    } else {
      alert('⚠️ Please fill all vital fields');
    }
  };

  const handleSaveMentalHealth = () => {
    sessionStorage.setItem('mentalHealth', JSON.stringify(mentalHealth));
    alert('✅ Mental wellness data saved successfully!');
  };

  const getVitalStatus = (value, min, max) => {
    const numValue = parseFloat(value);
    
    if (!value) return 'N/A';
    
    if (numValue >= min && numValue <= max) return '✅ Normal';
    if (numValue < min) return '⚠️ Low';
    return '⚠️ High';
  };

  return (
    <div className="page-layout">
      <div className="content">
                <button 
          className="back-btn" 
          onClick={() => navigate('/')}
          style={{
            padding: '15px 28px',
            fontSize: '14px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '2px solid',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: 'linear-gradient(135deg, #00FFFF, #39FF14)',
            borderColor: '#00FFFF',
            color: '#000000',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.4), 0 0 25px rgba(57, 255, 20, 0.2)',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05) translateY(-2px)';
            e.target.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6), 0 0 35px rgba(57, 255, 20, 0.4), 0 0 50px rgba(183, 0, 255, 0.2)';
            e.target.style.background = 'linear-gradient(135deg, #39FF14, #00FFFF)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4), 0 0 25px rgba(57, 255, 20, 0.2)';
            e.target.style.background = 'linear-gradient(135deg, #00FFFF, #39FF14)';
          }}
        >
          ← BACK TO HOME
        </button>

        <div className="monitor-container">
          <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 10px rgba(0, 255, 255, 0.4)', fontSize: '1.8rem' }}>
            Health Monitoring
          </h2>
          <p style={{ color: '#AAAAAA', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Enter your vital signs and mental wellness data. Backend ML model will compare with standard astronaut health ranges.
          </p>

                {/* Toggle Tabs - STYLISH */}
          <div className="toggle-chips" style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              className={`chip ${activeTab === 'physical' ? 'active' : ''}`}
              onClick={() => setActiveTab('physical')}
              style={{
                padding: '15px 30px',
                fontSize: '15px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '2px solid',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: activeTab === 'physical' 
                  ? 'linear-gradient(135deg, #00FFFF, #B700FF)' 
                  : 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(183, 0, 255, 0.15))',
                borderColor: activeTab === 'physical' ? '#00FFFF' : '#B700FF',
                color: activeTab === 'physical' ? '#000000' : '#00FFFF',
                boxShadow: activeTab === 'physical'
                  ? '0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(183, 0, 255, 0.4)'
                  : '0 0 10px rgba(183, 0, 255, 0.3)',
                textShadow: activeTab === 'physical' ? 'none' : '0 0 5px rgba(0, 255, 255, 0.3)'
              }}
            >
              📈 Physical Health
            </button>
            <button
              className={`chip ${activeTab === 'mental' ? 'active' : ''}`}
              onClick={() => setActiveTab('mental')}
              style={{
                padding: '15px 30px',
                fontSize: '15px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '2px solid',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: activeTab === 'mental' 
                  ? 'linear-gradient(135deg, #FF006E, #B700FF)' 
                  : 'linear-gradient(135deg, rgba(255, 0, 110, 0.15), rgba(183, 0, 255, 0.15))',
                borderColor: activeTab === 'mental' ? '#FF006E' : '#B700FF',
                color: activeTab === 'mental' ? '#FFFFFF' : '#FF006E',
                boxShadow: activeTab === 'mental'
                  ? '0 0 20px rgba(255, 0, 110, 0.6), 0 0 30px rgba(183, 0, 255, 0.4)'
                  : '0 0 10px rgba(255, 0, 110, 0.3)',
                textShadow: activeTab === 'mental' ? 'none' : '0 0 5px rgba(255, 0, 110, 0.3)'
              }}
            >
              🧠 Mental Health
            </button>
          </div>


          {/* Physical Health Tab */}
          {activeTab === 'physical' && (
            <div>
              {/* Stylish Input Section */}
              <div style={{
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #0a0e27 100%)',
                border: '3px solid #00FFFF',
                borderRadius: '15px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                {/* Glow Effect Background */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '500px',
                  height: '500px',
                  background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                <h3 style={{
                  color: 'var(--neon-cyan)',
                  marginBottom: '2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                  fontSize: '1.4rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  📊 Enter Your Vital Signs
                </h3>

                {/* Vitals Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  position: 'relative',
                  zIndex: 1,
                  marginBottom: '2rem',
                  maxWidth: '100%'
                }}>
                  {/* Heart Rate Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(183, 0, 255, 0.1))',
                    border: '2px solid #FF006E',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(255, 0, 110, 0.2)',
                    boxSizing: 'border-box'
                  }}>
                    <label style={{
                      color: 'var(--neon-pink)',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginBottom: '0.8rem',
                      textShadow: '0 0 5px rgba(255, 0, 110, 0.3)'
                    }}>
                      ❤️ Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      placeholder="72"
                      value={vitals.heartRate}
                      onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: 'rgba(255, 0, 110, 0.15)',
                        border: '2px solid #FF006E',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        marginBottom: '0.8rem',
                        boxShadow: 'inset 0 0 10px rgba(255, 0, 110, 0.1)',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#999999', fontSize: '0.8rem', display: 'block' }}>
                      Normal: 60–100 | {getVitalStatus(vitals.heartRate, 60, 100)}
                    </small>
                  </div>

                  {/* Blood Pressure Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1), rgba(255, 102, 0, 0.1))',
                    border: '2px solid #39FF14',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)',
                    boxSizing: 'border-box'
                  }}>
                    <label style={{
                      color: 'var(--neon-green)',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginBottom: '0.8rem',
                      textShadow: '0 0 5px rgba(57, 255, 20, 0.3)'
                    }}>
                      📊 Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={vitals.bloodPressure}
                      onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: 'rgba(57, 255, 20, 0.15)',
                        border: '2px solid #39FF14',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        marginBottom: '0.8rem',
                        boxShadow: 'inset 0 0 10px rgba(57, 255, 20, 0.1)',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#999999', fontSize: '0.8rem', display: 'block' }}>
                      Normal: ≈120/80 | Format: Sys/Dias
                    </small>
                  </div>

                  {/* SpO2 Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(183, 0, 255, 0.1))',
                    border: '2px solid #00FFFF',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
                    boxSizing: 'border-box'
                  }}>
                    <label style={{
                      color: 'var(--neon-cyan)',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginBottom: '0.8rem',
                      textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                    }}>
                      💨 SpO₂ (%)
                    </label>
                    <input
                      type="number"
                      placeholder="98"
                      value={vitals.spo2}
                      onChange={(e) => handleVitalChange('spo2', e.target.value)}
                      min="0"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: 'rgba(0, 255, 255, 0.15)',
                        border: '2px solid #00FFFF',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        marginBottom: '0.8rem',
                        boxShadow: 'inset 0 0 10px rgba(0, 255, 255, 0.1)',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#999999', fontSize: '0.8rem', display: 'block' }}>
                      Normal: 95–100 | {getVitalStatus(vitals.spo2, 95, 100)}
                    </small>
                  </div>

                  {/* Temperature Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.1), rgba(255, 102, 0, 0.1))',
                    border: '2px solid #FFFF00',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(255, 255, 0, 0.2)',
                    boxSizing: 'border-box'
                  }}>
                    <label style={{
                      color: 'var(--neon-yellow)',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginBottom: '0.8rem',
                      textShadow: '0 0 5px rgba(255, 255, 0, 0.3)'
                    }}>
                      🌡️ Body Temperature (°C)
                    </label>
                    <input
                      type="number"
                      placeholder="36.8"
                      value={vitals.temperature}
                      onChange={(e) => handleVitalChange('temperature', e.target.value)}
                      min="35"
                      max="40"
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: 'rgba(255, 255, 0, 0.15)',
                        border: '2px solid #FFFF00',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        marginBottom: '0.8rem',
                        boxShadow: 'inset 0 0 10px rgba(255, 255, 0, 0.1)',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                                          />
                    <small style={{ color: '#999999', fontSize: '0.8rem', display: 'block' }}>
                      Normal: 36.5–37.5 | {getVitalStatus(vitals.temperature, 36.5, 37.5)}
                    </small>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  className="btn-primary"
                  onClick={handleSaveVitals}
                  style={{
                    width: '100%',
                    padding: '18px 35px',
                    fontSize: '17px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    position: 'relative',
                    zIndex: 1,
                    boxSizing: 'border-box'
                  }}
                >
                  💾 SAVE YOUR DETAILS
                </button>
              </div>

              {/* Comparison Note */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(183, 0, 255, 0.1), rgba(255, 0, 110, 0.1))',
                border: '2px solid #B700FF',
                borderRadius: '10px',
                padding: '2rem',
                boxShadow: '0 0 15px rgba(183, 0, 255, 0.2)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '500px',
                  height: '500px',
                  background: 'radial-gradient(circle, rgba(183, 0, 255, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                
                <h4 style={{
                  color: 'var(--neon-purple)',
                  marginBottom: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '1.1rem',
                  textShadow: '0 0 5px rgba(183, 0, 255, 0.4)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  🤖 Backend ML Comparison
                </h4>
                <p style={{
                  color: '#CCCCCC',
                  fontSize: '0.95rem',
                  margin: '0',
                  lineHeight: '1.6',
                  position: 'relative',
                  zIndex: 1
                }}>
                  Your entered vitals will be compared against standard astronaut health ranges using ML models. This helps identify anomalies and provide personalized health insights for mission control.
                </p>
              </div>
            </div>
          )}

          {/* Mental Health Tab */}
          {activeTab === 'mental' && (
            <div className="mental-section">
              {/* Stress Slider */}
              <div className="slider-container">
                <div className="slider-label">
                  <span>Stress Level</span>
                  <span className="slider-value">{mentalHealth.stress}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mentalHealth.stress}
                  onChange={(e) => handleMentalChange('stress', parseInt(e.target.value))}
                />
              </div>

              {/* Anxiety Slider */}
              <div className="slider-container">
                <div className="slider-label">
                  <span>Anxiety Level</span>
                  <span className="slider-value">{mentalHealth.anxiety}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mentalHealth.anxiety}
                  onChange={(e) => handleMentalChange('anxiety', parseInt(e.target.value))}
                />
              </div>

              {/* Isolation Slider */}
              <div className="slider-container">
                <div className="slider-label">
                  <span>Isolation Feeling</span>
                  <span className="slider-value">{mentalHealth.isolation}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mentalHealth.isolation}
                  onChange={(e) => handleMentalChange('isolation', parseInt(e.target.value))}
                />
              </div>

              {/* Focus Slider */}
              <div className="slider-container">
                <div className="slider-label">
                  <span>Focus & Concentration</span>
                  <span className="slider-value">{mentalHealth.focus}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mentalHealth.focus}
                  onChange={(e) => handleMentalChange('focus', parseInt(e.target.value))}
                />
              </div>

                            {/* Sleep Quality Dropdown */}
              <div className="form-group" style={{
                marginBottom: '1.8rem'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: 'var(--neon-cyan)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                }}>
                  Sleep Quality
                </label>
                <select
                  value={mentalHealth.sleepQuality}
                  onChange={(e) => handleMentalChange('sleepQuality', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(183, 0, 255, 0.1))',
                    border: '2px solid #00FFFF',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 0 10px rgba(0, 255, 255, 0.1)',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%2200FFFF%22%3e%3cpath d=%22M7 10l5 5 5-5z%22/%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '20px',
                    paddingRight: '40px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF006E';
                    e.target.style.boxShadow = 'inset 0 0 10px rgba(255, 0, 110, 0.2), 0 0 15px rgba(255, 0, 110, 0.3)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.15), rgba(183, 0, 255, 0.15))';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#00FFFF';
                    e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 255, 255, 0.1)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(183, 0, 255, 0.1))';
                  }}
                >
                  <option value="Poor" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>Poor</option>
                  <option value="Fair" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>Fair</option>
                  <option value="Good" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>Good</option>
                  <option value="Excellent" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>Excellent</option>
                </select>
              </div>

              {/* Mood Dropdown */}
              <div className="form-group" style={{
                marginBottom: '1.8rem'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: 'var(--neon-pink)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  textShadow: '0 0 5px rgba(255, 0, 110, 0.3)'
                }}>
                  Current Mood
                </label>
                <select
                  value={mentalHealth.mood}
                  onChange={(e) => handleMentalChange('mood', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(183, 0, 255, 0.1))',
                    border: '2px solid #FF006E',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 0 10px rgba(255, 0, 110, 0.1)',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22FF006E%22%3e%3cpath d=%22M7 10l5 5 5-5z%22/%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '20px',
                    paddingRight: '40px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00FFFF';
                    e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 255, 255, 0.2), 0 0 15px rgba(0, 255, 255, 0.3)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(183, 0, 255, 0.15))';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FF006E';
                    e.target.style.boxShadow = 'inset 0 0 10px rgba(255, 0, 110, 0.1)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(183, 0, 255, 0.1))';
                  }}
                >
                  <option value="Sad" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>😢 Sad</option>
                  <option value="Neutral" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>😐 Neutral</option>
                  <option value="Positive" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>😊 Positive</option>
                  <option value="Excited" style={{ background: '#1a1a2e', color: '#FFFFFF' }}>🤩 Excited</option>
                </select>
              </div>
              {/* Recommendation Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(183, 0, 255, 0.15))',
                border: '2px solid #00FFFF',
                borderRadius: '10px',
                padding: '1.5rem',
                marginTop: '2rem',
                marginBottom: '2rem',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
              }}>
                <strong>{recommendation}</strong>
              </div>

                          {/* Action Buttons - STYLISH */}
              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleSaveMentalHealth}
                  style={{
                    padding: '18px 35px',
                    fontSize: '17px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    border: '2px solid #FF006E',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF006E, #B700FF)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 0 15px rgba(255, 0, 110, 0.4), 0 0 25px rgba(183, 0, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                    e.target.style.boxShadow = '0 0 25px rgba(255, 0, 110, 0.6), 0 0 40px rgba(183, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 0 15px rgba(255, 0, 110, 0.4), 0 0 25px rgba(183, 0, 255, 0.3)';
                  }}
                >
                  💾 SAVE YOUR DETAILS
                </button>
                <button 
                  className="btn-tertiary" 
                  onClick={() => navigate('/chatbot')}
                  style={{
                    padding: '18px 35px',
                    fontSize: '17px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    border: '2px solid #39FF14',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #39FF14, #FF6600)',
                    color: '#000000',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 0 15px rgba(57, 255, 20, 0.4), 0 0 25px rgba(255, 102, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                    e.target.style.boxShadow = '0 0 25px rgba(57, 255, 20, 0.6), 0 0 40px rgba(255, 102, 0, 0.5), 0 0 60px rgba(255, 255, 0, 0.2)';
                    e.target.style.background = 'linear-gradient(135deg, #FFFF00, #FF6600)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.4), 0 0 25px rgba(255, 102, 0, 0.3)';
                    e.target.style.background = 'linear-gradient(135deg, #39FF14, #FF6600)';
                  }}
                >
                  🤖 OPEN WELLNESS COMPANION →
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

