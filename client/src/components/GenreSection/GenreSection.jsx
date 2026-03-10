import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useAnimations';
import './GenreSection.css';

const genreData = [
  { name: 'Fiction', icon: '📖', color: '#8D6E63' },
  { name: 'Science Fiction', icon: '🚀', color: '#5C6BC0' },
  { name: 'Fantasy', icon: '🏰', color: '#7E57C2' },
  { name: 'Mystery', icon: '🔍', color: '#546E7A' },
  { name: 'Romance', icon: '💕', color: '#EC407A' },
  { name: 'Thriller', icon: '⚡', color: '#EF5350' },
  { name: 'Non-Fiction', icon: '📰', color: '#26A69A' },
  { name: 'Biography', icon: '👤', color: '#42A5F5' },
  { name: 'Self-Help', icon: '🌱', color: '#66BB6A' },
  { name: 'History', icon: '🏛️', color: '#8D6E63' },
  { name: 'Poetry', icon: '🪶', color: '#AB47BC' },
  { name: 'Horror', icon: '👻', color: '#424242' }
];

export default function GenreSection() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="genre-section section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>Explore by Genre</h2>
          <p>Find your next read by browsing through our diverse collection of genres</p>
        </div>

        <div className={`genre-grid ${isVisible ? 'animate' : ''}`}>
          {genreData.map((genre, i) => (
            <Link
              key={genre.name}
              to={`/books?genre=${encodeURIComponent(genre.name)}`}
              className="genre-card"
              style={{
                '--genre-color': genre.color,
                animationDelay: `${i * 0.06}s`
              }}
            >
              <span className="genre-icon">{genre.icon}</span>
              <span className="genre-name">{genre.name}</span>
              <span className="genre-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
