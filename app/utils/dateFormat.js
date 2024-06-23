// Reference: https://stackoverflow.com/a/41633001
export const elapsedTime = (time) => {
  const diff = new Date() - new Date(time);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
};

export const timeTo12H = (time) => {
  return new Date(time).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const timeToMediumDate = (time) => {
  return new Date(time).toLocaleDateString('en-US', {
    dateStyle: 'medium',
  });
};
