 <button
              className={`chip ${activeTab === 'physical' ? 'active' : ''}`}
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
              Black Hole
            </button>
            