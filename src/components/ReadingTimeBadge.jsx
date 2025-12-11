import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';

/**
 * Badge que muestra el tiempo estimado de lectura
 */
function ReadingTimeBadge({ content }) {
    if (!content) return null;

    const minutes = calculateReadingTime(content);
    const text = formatReadingTime(minutes);

    return (
        <div className="reading-time-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{text}</span>
        </div>
    );
}

export default ReadingTimeBadge;
