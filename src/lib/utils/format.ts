/**
 * Formatting utilities for wedding invitation dates and times.
 */

export const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '0000.00.00';
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}. ${mm}. ${dd}`;
};

export const formatShortDate = (dateString: string | undefined) => {
    if (!dateString) return '00.00';
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}.${dd}`;
};

export const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '12:00 PM';
    const [h = '12', m = '00'] = timeString.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${String(displayHour).padStart(2, '0')}:${m} ${ampm}`;
};

export const getWeekday = (dateString: string | undefined) => {
    if (!dateString) return 'Sunday';
    const d = new Date(dateString);
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
};

export const getWeekdayKr = (dateString: string | undefined) => {
    if (!dateString) return '일요일';
    const d = new Date(dateString);
    return ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][d.getDay()];
};
