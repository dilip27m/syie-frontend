// Format time to show relative time or hours:minutes
export function formatPostTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 1) return 'Just now';
        return `${diffInMinutes}m ago`;
    }

    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    if (diffInHours < 48) {
        return 'Yesterday';
    }

    // Show date if older than 2 days
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    return `${dateStr} at ${time}`;
}
