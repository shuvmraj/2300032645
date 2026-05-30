const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://20.244.56.144/evaluation-service';
const TOKEN = process.env.TOKEN;
const USE_API = process.env.USE_API === 'true';

const headers = {
  'Authorization': `Bearer ${TOKEN}`
};

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

const sampleDepots = [
  { ID: 1, MechanicHours: 60 },
  { ID: 2, MechanicHours: 135 },
  { ID: 3, MechanicHours: 188 },
  { ID: 4, MechanicHours: 97 },
  { ID: 5, MechanicHours: 164 }
];

const sampleVehicles = [
  { TaskID: '264e638f', Duration: 1, Impact: 5 },
  { TaskID: '73ce9dca', Duration: 6, Impact: 2 },
  { TaskID: '4b6e22ee', Duration: 1, Impact: 3 },
  { TaskID: 'task-001', Duration: 5, Impact: 8 },
  { TaskID: 'task-002', Duration: 3, Impact: 4 },
  { TaskID: 'task-003', Duration: 2, Impact: 7 },
  { TaskID: 'task-004', Duration: 4, Impact: 6 },
  { TaskID: 'task-005', Duration: 7, Impact: 9 }
];

async function run() {
  try {
    let depots, vehicles;
    
    if (USE_API && TOKEN) {
      const depotsResponse = await axios.get(`${API_BASE}/depots`, { headers, timeout: 5000 });
      const vehiclesResponse = await axios.get(`${API_BASE}/vehicles`, { headers, timeout: 5000 });
      depots = depotsResponse.data.depots;
      vehicles = vehiclesResponse.data.vehicles;
    } else {
      depots = sampleDepots;
      vehicles = sampleVehicles;
    }

    depots.forEach(depot => {
      scheduleDepot(depot, vehicles);
    });
  } catch (err) {
    console.log('API Error:', err.message);
    console.log('Falling back to sample data');
    sampleDepots.forEach(depot => {
      scheduleDepot(depot, sampleVehicles);
    });
  }
}

run();
