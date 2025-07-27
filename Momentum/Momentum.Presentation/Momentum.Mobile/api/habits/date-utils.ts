/**
 * Convert a Date object to ISO string (let the backend handle timezone)
 * The backend expects standard ISO format
 */
export function toNZDateString(date: Date): string {
  // For now, just return standard ISO string
  // The backend should handle timezone conversions
  return date.toISOString();
}

/**
 * Get NZ date string in YYYY-MM-DD format
 * If the input is a date string without timezone, treat it as NZ local time
 */
export function getNZDateOnly(date: Date | string = new Date()): string {
  // If it's a string date, we need to handle it specially
  if (typeof date === 'string') {
    // If it's just a date (YYYY-MM-DD), return as is
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    
    // If it's a datetime without timezone (from API), treat as NZ local time
    if (!date.includes('+') && !date.includes('Z')) {
      // Just extract the date part
      return date.split('T')[0];
    }
    
    // Otherwise, parse as normal date
    date = new Date(date);
  }
  
  const nzFormatter = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = nzFormatter.formatToParts(date);
  const dateParts: Record<string, string> = {};
  
  parts.forEach(part => {
    if (part.type !== 'literal') {
      dateParts[part.type] = part.value;
    }
  });
  
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

/**
 * Create a UTC date object for today (where "today" is determined by NZ timezone)
 * This returns a Date object representing today at midnight UTC, 
 * but the "today" date is calculated based on NZ timezone
 */
export function getNZToday(): Date {
  // Get current date in NZ timezone
  const nzDateStr = getNZDateOnly();
  // Create a UTC Date object for this date at midnight
  const utcDate = new Date(nzDateStr + 'T00:00:00.000Z');
  return utcDate;
}

/**
 * Get the current day of week in NZ timezone
 * Returns 0-6 where 0 = Sunday, 6 = Saturday
 */
export function getNZDayOfWeek(): number {
  // Create a date object for the current time in NZ timezone
  const now = new Date();
  const nzFormatter = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    weekday: 'short'
  });
  
  const nzDayName = nzFormatter.format(now);
  
  // Convert day name to number (0 = Sunday, 6 = Saturday)
  const dayMap: Record<string, number> = {
    'Sun': 0,
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6
  };
  
  return dayMap[nzDayName] || 0;
}