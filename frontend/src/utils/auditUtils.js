export const calculateDateDifference = (startDate) => {
  const today = new Date();
  const start = new Date(startDate); 

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const timeDifference = start - today;
  return Math.ceil(timeDifference / (1000 * 3600 * 24)); 
};

export const findNextNearestDate = (auditData) => {

  if (!auditData ) {
    return null;
  }

  const auditArray = Object.values(auditData);
  if (auditArray.length === 0) {
    return null; 
  }
  let nearestDate = null;
  let nearestDateDiff = Infinity;
  let nearestAudit = null;

  auditArray.forEach((audit, index) => {
    
    if (audit && audit.startDate) {
      console.log(`Found startDate in audit at index ${index}:`, audit.startDate);
      const daysDifference = calculateDateDifference(audit.startDate);

      // Only process future dates
      if (daysDifference > 0 && daysDifference < nearestDateDiff) {
        nearestDateDiff = daysDifference;
        nearestDate = audit.startDate;
        nearestAudit = audit;
      }
    } else {
      console.log(`Skipping entry at index ${index}, no startDate found or not a valid audit:`, audit);
    }
  });

  // Return the nearest date and its difference from today
  return nearestDate 
    ? { date: nearestDate, diff: nearestDateDiff , audit: nearestAudit }
    : null;
};

export const formatMongoDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
  });
}
