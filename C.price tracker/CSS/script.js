const coinIds = [
  "bitcoin",
  "ethereum",
  "solana",
  "dogecoin",
  "ripple",
  "cardano",
  "avalanche-2",
  "chainlink"
];

const apiUrl =
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}&order=market_cap_desc&price_change_percentage=24h`;

const coinTableBody = document.getElementById("coinTableBody");
const refreshButton = document.getElementById("refreshButton");
const statusText = document.getElementById("statusText");
const lastUpdated = document.getElementById("lastUpdated");
const marketDirection = document.getElementById("marketDirection");
const bestPerformer = document.getElementById("bestPerformer");
const bestPerformerDetail = document.getElementById("bestPerformerDetail");
const worstPerformer = document.getElementById("worstPerformer");
const worstPerformerDetail = document.getElementById("worstPerformerDetail");
const trackedCount = document.getElementById("trackedCount");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

function formatLargeCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

function formatPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function renderRows(coins) {
  coinTableBody.innerHTML = coins
    .map((coin) => {
      const change = coin.price_change_percentage_24h ?? 0;
      const changeClass = change >= 0 ? "positive" : "negative";

      return `
        <tr>
          <td>
            <div class="coin-name">
              <strong>${coin.name}</strong>
              <span class="coin-symbol">${coin.symbol}</span>
            </div>
          </td>
          <td>${formatCurrency(coin.current_price)}</td>
          <td class="${changeClass}">${formatPercent(change)}</td>
          <td>${formatLargeCurrency(coin.market_cap)}</td>
          <td>${formatLargeCurrency(coin.total_volume)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSummary(coins) {
  const sortedByChange = [...coins].sort(
    (left, right) =>
      (right.price_change_percentage_24h ?? 0) - (left.price_change_percentage_24h ?? 0)
  );

  const topCoin = sortedByChange[0];
  const bottomCoin = sortedByChange[sortedByChange.length - 1];
  const averageChange =
    coins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h ?? 0), 0) / coins.length;

  bestPerformer.textContent = topCoin.name;
  bestPerformerDetail.textContent = `${formatPercent(topCoin.price_change_percentage_24h ?? 0)} in the last 24 hours`;

  worstPerformer.textContent = bottomCoin.name;
  worstPerformerDetail.textContent = `${formatPercent(bottomCoin.price_change_percentage_24h ?? 0)} in the last 24 hours`;

  trackedCount.textContent = String(coins.length);
  marketDirection.textContent = averageChange >= 0 ? "Bullish" : "Cooling";
}

function renderError() {
  coinTableBody.innerHTML = `
    <tr>
      <td colspan="5" class="error-row">
        Could not load crypto prices right now. Try refreshing in a moment.
      </td>
    </tr>
  `;
}

async function fetchPrices() {
  statusText.textContent = "Refreshing prices...";
  refreshButton.disabled = true;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const coins = await response.json();
    renderRows(coins);
    renderSummary(coins);

    const now = new Date();
    lastUpdated.textContent = `Updated ${now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    })}`;
    statusText.textContent = "Prices are live.";
  } catch (error) {
    console.error(error);
    renderError();
    statusText.textContent = "Using fallback state until the next refresh.";
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", fetchPrices);
fetchPrices();