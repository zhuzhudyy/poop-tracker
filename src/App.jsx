import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState({})

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedRecords = localStorage.getItem('poopRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  // 保存数据到 localStorage
  const saveRecord = (user, date, status) => {
    const newRecords = { ...records }
    if (!newRecords[user]) {
      newRecords[user] = {}
    }
    newRecords[user][date] = status
    setRecords(newRecords)
    localStorage.setItem('poopRecords', JSON.stringify(newRecords))
  }

  // 获取某用户某天的记录
  const getRecord = (user, date) => {
    return records[user]?.[date] || null
  }

  // 获取统计数据
  const getStats = (user) => {
    if (!records[user]) return { total: 0, yes: 0, no: 0, rate: 0 }
    
    const dates = Object.keys(records[user])
    const total = dates.length
    const yes = dates.filter(date => records[user][date] === true).length
    const no = dates.filter(date => records[user][date] === false).length
    const rate = total > 0 ? Math.round((yes / total) * 100) : 0
    
    return { total, yes, no, rate }
  }

  const users = ['男朋友', '女朋友']

  return (
    <div className="app">
      <header className="header">
        <h1>💩 情侣排便统计 💩</h1>
        <p className="subtitle">记录每一天的健康习惯</p>
      </header>

      <div className="container">
        {/* 用户选择 */}
        <div className="user-selector">
          <h2>选择用户</h2>
          <div className="user-buttons">
            {users.map(user => (
              <button
                key={user}
                className={`user-btn ${currentUser === user ? 'active' : ''}`}
                onClick={() => setCurrentUser(user)}
              >
                {user === '男朋友' ? '👨' : '👩'} {user}
              </button>
            ))}
          </div>
        </div>

        {currentUser && (
          <>
            {/* 日期选择和记录 */}
            <div className="record-section">
              <h2>记录今日状态</h2>
              <div className="date-picker">
                <label>选择日期：</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="status-buttons">
                <button
                  className={`status-btn yes ${getRecord(currentUser, selectedDate) === true ? 'active' : ''}`}
                  onClick={() => saveRecord(currentUser, selectedDate, true)}
                >
                  ✅ 拉了
                </button>
                <button
                  className={`status-btn no ${getRecord(currentUser, selectedDate) === false ? 'active' : ''}`}
                  onClick={() => saveRecord(currentUser, selectedDate, false)}
                >
                  ❌ 没拉
                </button>
              </div>

              <div className="current-status">
                {getRecord(currentUser, selectedDate) === true && (
                  <p className="status-text success">🎉 {selectedDate} 已记录：拉了</p>
                )}
                {getRecord(currentUser, selectedDate) === false && (
                  <p className="status-text warning">⚠️ {selectedDate} 已记录：没拉</p>
                )}
                {getRecord(currentUser, selectedDate) === null && (
                  <p className="status-text info">📝 {selectedDate} 还未记录</p>
                )}
              </div>
            </div>

            {/* 统计数据 */}
            <div className="stats-section">
              <h2>📊 统计数据</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{getStats(currentUser).total}</div>
                  <div className="stat-label">总记录天数</div>
                </div>
                <div className="stat-card success">
                  <div className="stat-value">{getStats(currentUser).yes}</div>
                  <div className="stat-label">拉了天数</div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-value">{getStats(currentUser).no}</div>
                  <div className="stat-label">没拉天数</div>
                </div>
                <div className="stat-card info">
                  <div className="stat-value">{getStats(currentUser).rate}%</div>
                  <div className="stat-label">排便率</div>
                </div>
              </div>
            </div>

            {/* 最近记录 */}
            <div className="recent-records">
              <h2>📅 最近记录</h2>
              <div className="records-list">
                {Object.keys(records[currentUser] || {})
                  .sort((a, b) => new Date(b) - new Date(a))
                  .slice(0, 7)
                  .map(date => (
                    <div key={date} className="record-item">
                      <span className="record-date">{date}</span>
                      <span className={`record-status ${records[currentUser][date] ? 'success' : 'warning'}`}>
                        {records[currentUser][date] ? '✅ 拉了' : '❌ 没拉'}
                      </span>
                    </div>
                  ))}
                {(!records[currentUser] || Object.keys(records[currentUser]).length === 0) && (
                  <p className="no-records">暂无记录，开始记录吧！</p>
                )}
              </div>
            </div>
          </>
        )}

        {!currentUser && (
          <div className="welcome-message">
            <p>👆 请选择用户开始记录</p>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>💕 祝你们身体健康，天天通畅 💕</p>
      </footer>
    </div>
  )
}

export default App
