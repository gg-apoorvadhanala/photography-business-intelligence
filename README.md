# Photography Business Intelligence Agent

An AI-powered business intelligence agent that helps photographers analyze their business metrics, track revenue, and optimize pricing.

## Features

- 📊 Calculate average hourly rates (overall and per shoot type)
- 💰 Generate monthly and yearly revenue summaries
- 📅 Identify most common shoot times and seasonal trends
- 🎯 Analyze which shoot types are most profitable
- 📈 Track business growth over time

## Getting Started

### Prerequisites

- Node.js >= 22.13.0
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Usage

1. Open http://localhost:4111 in your browser
2. Navigate to the Agents tab
3. Select "Photography Business Intelligence Agent"
4. Ask questions like:
   - "Analyze my photography business"
   - "What's my average hourly rate?"
   - "Show me monthly revenue breakdown"
   - "Which shoot type is most profitable?"

## Data Structure

The agent analyzes shoot data with the following columns:
- Date
- Client
- Shoot Type (Portrait, Wedding, Event, Product, etc.)
- Start Time
- End Time
- Amount Charged
- Payment Method

Currently uses mock data for testing. Can be extended to connect to:
- Google Sheets
- CSV files
- Booking/CRM systems
- Payment platforms (Venmo, PayPal, etc.)

## Tech Stack

- [Mastra](https://mastra.ai) - AI agent framework
- Claude Sonnet 4.5 - Language model
- TypeScript
- Node.js

## License

MIT
