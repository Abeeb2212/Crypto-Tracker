# Crypto-Tracker
tracking crypto price
Shows live prices for a small watchlist of popular coins
Displays 24-hour change, market cap, and trading volume
Includes a refresh button and simple summary cards
Uses the free CoinGecko public API

index.html` - app structure
style.css` - styling and layout
script.js` - fetches crypto prices and updates the UI


1. Open `index.html` in a browser.
2. If your browser blocks the API because of local file restrictions, run a simple local server instead.

Example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

- Add a search bar for more coins
- Let users build their own watchlist
- Add charts for 7-day or 30-day history
- Save favorites in local storage
- Add dark/light theme switching
