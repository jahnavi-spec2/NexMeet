import { useState, useEffect, useCallback } from 'react'
import './lobby.css'
import { useNavigate } from 'react-router-dom'

import { useSocket } from '../context/SocketProvider.jsx'

function LobbyScreen() {
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')
  const socket = useSocket()
  const navigate = useNavigate()

  const handleJoinRoom = useCallback((data) => {
    const { room } = data
    //  console.log(`Email: ${email}, Room: ${room}`);
    console.log(`Data received from Bknd`, data)
    navigate(`/room/${room}`);// it will take u to the room u mentioned ...now go to room.jsx 

  }, [navigate])

  const handleSubmitForm = useCallback((event) => {
    event.preventDefault()

    // Connect your Socket.IO room-join flow here.
    socket.emit('room:join', { email, room })
  }, [email, room, socket])

  useEffect(() => {
    if (!socket) return

    socket.on('room:join', handleJoinRoom)

    return () => {
      socket.off('room:join', handleJoinRoom);
    }
  }, [socket, handleJoinRoom])
  return (
    <main className="lobby-page">
      <header className="lobby-header">
        <a className="brand" href="/" aria-label="NexMeet home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5.5" width="12" height="13" rx="4" />
              <path d="m15.5 10 5-3v10l-5-3" />
              <path d="M7.5 10.5h4m-4 3h4" />
            </svg>
          </span>
          <span>NexMeet</span>
        </a>

        <div className="header-note">
          <span className="header-note-dot" />
          A little closer, wherever you are
        </div>
      </header>

      <section className="lobby-content">
        <div className="lobby-intro">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            YOUR PEOPLE ARE HERE
          </div>

          <h1>
            Good things
            <br />
            <span>happen face</span>
            <br />
            to face<span className="title-period">.</span>
          </h1>

          <p className="intro-copy">
            A quick catch-up or a big idea — make a little space for the
            conversations that make your day.
          </p>

          <div className="hero-visual">
            <img
              src="/nexmeet-illustration.svg"
              alt="Two people smiling and waving during a video call"
            />
            <div className="visual-caption">
              <span className="visual-caption-dot" />
              Good to see you.
            </div>
          </div>
        </div>

        <aside className="join-card">
          <div className="card-decoration" aria-hidden="true" />

          <div className="card-heading">
            <div className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M5 20a7 7 0 0 1 14 0m-1-12v6m-3-3h6" />
              </svg>
            </div>
            <span className="card-step">01 <span>/ 01</span></span>
          </div>

          <p className="card-kicker">PULL UP A CHAIR</p>
          <h2>Join your people.</h2>
          <p className="card-copy">
            Add your details and we’ll get the room ready.
          </p>

          <form onSubmit={handleSubmitForm}>
            <label htmlFor="email">Your email</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="14" rx="3" />
                <path d="m4.5 7 7.5 6 7.5-6" />
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <label htmlFor="room">Room code</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9Z" />
                <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
              </svg>
              <input
                type="text"
                placeholder="e.g. team-coffee"
                id="room"
                autoComplete="off"
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                required
              />
            </div>

            <button type="submit">
              <span>Step into the room</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12m-5-5 5 5-5 5" />
              </svg>
            </button>
          </form>

          <div className="privacy-note">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 7V5a4 4 0 1 1 8 0v2m-8 0h8a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-4A1.5 1.5 0 0 1 4 7Z" />
              <path d="M8 10v1.5" />
            </svg>
            No noise. Just you and your people.
          </div>
        </aside>
      </section>

      <footer className="lobby-footer">
        <span>© 2026 NexMeet</span>
        <span className="footer-divider" />
        <span>Made for moments that matter</span>
        <span className="footer-wave" aria-hidden="true">~</span>
      </footer>
    </main>
  )
}

export default LobbyScreen
