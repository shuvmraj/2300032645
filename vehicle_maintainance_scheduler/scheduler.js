const axios = require('axios');

const API_BASE = process.env.API_BASE ||'http://20.244.56.144/evaluation-service';
const TOKEN = process.env.TOKEN;

const headers = {
  'Authorization': `Bearer ${TOKEN}`
};

async function fetchDepots() {
  const response = await axios.get(`${API_BASE}/depots`,{ headers,timeout:5000 });
  return response.data.depots;
}

async function fetchVehicles() {
  constresponse = await axios.get(`${API_BASE}/vehicles`,{headers,timeout: 5000 });
  return response.data.vehicles;
}

function knapsack(capacity, items) {
  const n = items.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (items[i - 1].Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - items[i - 1].Duration] + items[i - 1].Impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let selected = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      w -= items[i - 1].Duration;
    }
  }

  return {
    maxScore: dp[n][capacity],
    selectedItems: selected,
    totalDuration: capacity - w
  };
}

function scheduleDepot(depot, vehicles) {
  const result = knapsack(depot.MechanicHours, vehicles);

  console.log(`Depot ${depot.ID}`);
  console.log(`Hours Available: ${depot.MechanicHours}`);
  console.log(`Max Impact: ${result.maxScore}`);
  console.log(`Hours Used: ${result.totalDuration}`);
  console.log(`Tasks Selected: ${result.selectedItems.length}`);
  
  result.selectedItems.forEach(task => {
    console.log(`  ${task.TaskID} - Duration: ${task.Duration}h, Impact: ${task.Impact}`);
  });
  
  console.log('');
  return result;
}

async function run() {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    depots.forEach(depot => {
      scheduleDepot(depot, vehicles);
    });
  } catch (err) {
    console.log('API Error:',err.message);
  }
}

run();
