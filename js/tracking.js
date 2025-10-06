(function() {
  // Try to detect counter ID automatically
  const yaCounterId =
    window.ymCounterId ||
    (typeof ym === 'function' && window.Ya && Ya.Metrika2 ? Ya.Metrika2.counterId : null);

  // Queue for events until YM is ready
  const goalQueue = [];

  // Safe send function
  function sendGoal(goalName, params = {}) {
    if (typeof ym === 'function' && yaCounterId) {
      ym(yaCounterId, 'reachGoal', goalName, params);
      console.log('[YM] Goal sent:', goalName, params);
    } else {
      goalQueue.push({ goalName, params });
      console.log('[YM] Queued goal:', goalName);
    }
  }

  // Flush queued goals when YM loads
  function flushGoals() {
    if (typeof ym === 'function' && yaCounterId && goalQueue.length > 0) {
      goalQueue.forEach(({ goalName, params }) => ym(yaCounterId, 'reachGoal', goalName, params));
      goalQueue.length = 0;
      console.log('[YM] Queued goals flushed');
    }
  }

  // Detect clicks on elements with `data-ym-goal-click`
  function setupClickTracking() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-ym-goal-click]');
      if (!target) return;

      const goalName = target.getAttribute('data-ym-goal-click');
      if (!goalName) return;

      let params = {};
      const rawParams = target.getAttribute('data-ym-goal-params-click');
      if (rawParams) {
        try {
          params = JSON.parse(rawParams);
        } catch (err) {
          console.warn('[YM] Invalid JSON in data-ym-goal-params-click:', err);
        }
      }

      sendGoal(goalName, params);
    });
  }

  // Wait until DOM ready
  document.addEventListener('DOMContentLoaded', setupClickTracking);
  window.addEventListener('load', () => setTimeout(flushGoals, 1000));

  // Expose globally
  window.sendYMGoal = sendGoal;
})();