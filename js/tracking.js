(function() {
  let yaCounterId = null;
  const goalQueue = [];

  // Safe send function
  function sendGoal(goalName, params = {}) {
    if (typeof ym === 'function' && yaCounterId) {
      ym(yaCounterId, 'reachGoal', goalName, params);
      console.log(`[YM-${yaCounterId}] Goal sent:`, goalName, params);
    } else {
      goalQueue.push({ goalName, params });
      console.log('[YM] Queued goal:', goalName);
      detectCounterAsync(); // ensure we’ll retry later
    }
  }

  // Detect counter dynamically
  function detectCounter() {
    if (yaCounterId) return yaCounterId;

    if (window.ymCounterId) {
      yaCounterId = window.ymCounterId;
    } else if (window.Ya && Ya.Metrika2 && typeof ym === 'function') {
      // Try to guess from Ya.Metrika2 instances
      const counters = Object.keys(Ya._metrika.getCounters?.() || {});
      yaCounterId = counters.length ? counters[0] : null;
    }

    return yaCounterId;
  }

  // Retry detection until YM is ready
  function detectCounterAsync(retries = 20) {
    if (detectCounter()) {
      flushGoals();
      return;
    }
    if (retries > 0) {
      setTimeout(() => detectCounterAsync(retries - 1), 500);
    }
  }

  // Flush queued goals
  function flushGoals() {
    if (typeof ym === 'function' && yaCounterId && goalQueue.length > 0) {
      goalQueue.forEach(({ goalName, params }) =>
        ym(yaCounterId, 'reachGoal', goalName, params)
      );
      console.log(`[YM-${yaCounterId}] Flushed ${goalQueue.length} queued goals`);
      goalQueue.length = 0;
    }
  }

  // Click tracking
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
          console.warn(`[YM] Invalid JSON in data-ym-goal-params-click:`, err);
        }
      }

      sendGoal(goalName, params);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupClickTracking();
    detectCounterAsync();
  });

  // Expose globally
  window.sendYMGoal = sendGoal;
})();
