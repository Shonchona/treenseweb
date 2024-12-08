document.addEventListener('DOMContentLoaded', () => {
  const totalSeedlingsElem = document.getElementById('total-seedlings');
  const healthySeedlingsElem = document.getElementById('healthy-seedlings');
  const unhealthySeedlingsElem = document.getElementById('unhealthy-seedlings');

  async function fetchSummary() {
      try {
          const response = await fetch('http://localhost:3000/api/auth/summary');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const summary = await response.json();

          totalSeedlingsElem.textContent = summary.total;
          healthySeedlingsElem.textContent = summary.healthy;
          unhealthySeedlingsElem.textContent = summary.unhealthy;
      } catch (error) {
          console.error('Error fetching summary:', error);
          totalSeedlingsElem.textContent = 'Error';
          healthySeedlingsElem.textContent = 'Error';
          unhealthySeedlingsElem.textContent = 'Error';
      }
  }

  fetchSummary();
});
