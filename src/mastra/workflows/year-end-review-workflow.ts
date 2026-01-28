import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Step 1: Fetch shoot data
const fetchShootDataStep = createStep({
  id: "fetch-shoot-data",
  description: "Fetches all photography shoot data for the year",
  inputSchema: z.object({
    year: z.number().optional(),
  }),
  outputSchema: z.object({
    shootData: z.string(), // CSV data
    year: z.number(),
  }),
  execute: async ({ inputData }) => {
    const year = inputData.year || new Date().getFullYear();

    // In real implementation, this would filter by year
    // For now, return mock data
    const mockData = `Date,Client,Shoot Type,Start Time,End Time,Amount Charged,Payment Method
2024-01-15,Sarah Johnson,Portrait,2:00 PM,4:00 PM,300,Venmo
2024-01-20,Mike & Emma,Wedding,10:00 AM,6:00 PM,2500,Venmo
2024-02-03,TechCorp,Product,1:00 PM,3:00 PM,400,Bank Transfer
2024-02-10,Lisa Chen,Portrait,3:00 PM,5:00 PM,280,Venmo
2024-02-14,David & Rachel,Engagement,11:00 AM,1:00 PM,500,Venmo
2024-03-05,Local Business,Event,5:00 PM,9:00 PM,800,Cash
2024-03-12,Jennifer Smith,Portrait,1:00 PM,3:00 PM,300,Venmo
2024-03-25,Anderson Wedding,Wedding,12:00 PM,8:00 PM,3000,Bank Transfer
2024-04-08,Marcus Brown,Portrait,10:00 AM,12:00 PM,250,Venmo
2024-04-15,StartupXYZ,Product,2:00 PM,5:00 PM,600,Bank Transfer
2024-05-01,Taylor & Jordan,Wedding,11:00 AM,7:00 PM,2800,Venmo
2024-05-20,Emma Wilson,Portrait,4:00 PM,6:00 PM,300,Venmo`;

    console.log(`📊 Fetched shoot data for year ${year}`);

    return {
      shootData: mockData,
      year,
    };
  },
});

// Parallel Step A: Revenue Analysis
const revenueAnalysisStep = createStep({
  id: "revenue-analysis",
  description: "Analyzes total revenue and monthly breakdown",
  inputSchema: z.object({
    shootData: z.string(),
    year: z.number(),
  }),
  outputSchema: z.object({
    totalRevenue: z.number(),
    monthlyBreakdown: z.array(z.object({
      month: z.string(),
      revenue: z.number(),
      shootCount: z.number(),
    })),
    averagePerShoot: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log("💰 Analyzing revenue...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lines = inputData.shootData.split('\n').slice(1); // Skip header
    let totalRevenue = 0;
    const monthlyData: { [key: string]: { revenue: number; count: number } } = {};

    lines.forEach(line => {
      const parts = line.split(',');
      const date = parts[0];
      const amount = parseFloat(parts[5]);

      totalRevenue += amount;

      const month = new Date(date).toLocaleString('default', { month: 'long' });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, count: 0 };
      }
      monthlyData[month].revenue += amount;
      monthlyData[month].count += 1;
    });

    const monthlyBreakdown = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      shootCount: data.count,
    }));

    return {
      totalRevenue,
      monthlyBreakdown,
      averagePerShoot: totalRevenue / lines.length,
    };
  },
});

// Parallel Step B: Shoot Type Profitability
const shootTypeProfitabilityStep = createStep({
  id: "shoot-type-profitability",
  description: "Analyzes profitability by shoot type",
  inputSchema: z.object({
    shootData: z.string(),
    year: z.number(),
  }),
  outputSchema: z.object({
    byType: z.array(z.object({
      type: z.string(),
      totalRevenue: z.number(),
      shootCount: z.number(),
      totalHours: z.number(),
      avgHourlyRate: z.number(),
    })),
    mostProfitable: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log("📸 Analyzing shoot types...");
    await new Promise((resolve) => setTimeout(resolve, 700));

    const lines = inputData.shootData.split('\n').slice(1);
    const typeData: { [key: string]: { revenue: number; count: number; hours: number } } = {};

    lines.forEach(line => {
      const parts = line.split(',');
      const type = parts[2];
      const startTime = parts[3];
      const endTime = parts[4];
      const amount = parseFloat(parts[5]);

      // Simple hour calculation (would be more complex in real implementation)
      const hours = 2; // Simplified

      if (!typeData[type]) {
        typeData[type] = { revenue: 0, count: 0, hours: 0 };
      }
      typeData[type].revenue += amount;
      typeData[type].count += 1;
      typeData[type].hours += hours;
    });

    const byType = Object.entries(typeData).map(([type, data]) => ({
      type,
      totalRevenue: data.revenue,
      shootCount: data.count,
      totalHours: data.hours,
      avgHourlyRate: data.revenue / data.hours,
    }));

    const mostProfitable = byType.reduce((max, current) =>
      current.avgHourlyRate > max.avgHourlyRate ? current : max
    ).type;

    return {
      byType,
      mostProfitable,
    };
  },
});

// Parallel Step C: Time & Trend Analysis
const trendAnalysisStep = createStep({
  id: "trend-analysis",
  description: "Analyzes booking trends and patterns",
  inputSchema: z.object({
    shootData: z.string(),
    year: z.number(),
  }),
  outputSchema: z.object({
    busiestMonth: z.string(),
    mostCommonStartTime: z.string(),
    totalShoots: z.number(),
    quarterlyBreakdown: z.array(z.object({
      quarter: z.string(),
      shoots: z.number(),
    })),
  }),
  execute: async ({ inputData }) => {
    console.log("📈 Analyzing trends...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lines = inputData.shootData.split('\n').slice(1);
    const monthCounts: { [key: string]: number } = {};
    const timeFrequency: { [key: string]: number } = {};

    lines.forEach(line => {
      const parts = line.split(',');
      const date = parts[0];
      const startTime = parts[3];

      const month = new Date(date).toLocaleString('default', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;

      timeFrequency[startTime] = (timeFrequency[startTime] || 0) + 1;
    });

    const busiestMonth = Object.entries(monthCounts).reduce((max, [month, count]) =>
      count > max.count ? { month, count } : max, { month: '', count: 0 }
    ).month;

    const mostCommonStartTime = Object.entries(timeFrequency).reduce((max, [time, count]) =>
      count > max.count ? { time, count } : max, { time: '', count: 0 }
    ).time;

    return {
      busiestMonth,
      mostCommonStartTime,
      totalShoots: lines.length,
      quarterlyBreakdown: [
        { quarter: "Q1", shoots: 5 },
        { quarter: "Q2", shoots: 4 },
        { quarter: "Q3", shoots: 2 },
        { quarter: "Q4", shoots: 1 },
      ],
    };
  },
});

// Step 4: AI-Powered Insights Generation
const generateInsightsStep = createStep({
  id: "generate-insights",
  description: "Uses AI to generate comprehensive business insights",
  inputSchema: z.object({
    "revenue-analysis": z.object({
      totalRevenue: z.number(),
      monthlyBreakdown: z.array(z.object({
        month: z.string(),
        revenue: z.number(),
        shootCount: z.number(),
      })),
      averagePerShoot: z.number(),
    }),
    "shoot-type-profitability": z.object({
      byType: z.array(z.object({
        type: z.string(),
        totalRevenue: z.number(),
        shootCount: z.number(),
        totalHours: z.number(),
        avgHourlyRate: z.number(),
      })),
      mostProfitable: z.string(),
    }),
    "trend-analysis": z.object({
      busiestMonth: z.string(),
      mostCommonStartTime: z.string(),
      totalShoots: z.number(),
      quarterlyBreakdown: z.array(z.object({
        quarter: z.string(),
        shoots: z.number(),
      })),
    }),
  }),
  outputSchema: z.object({
    insights: z.string(),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ inputData, mastra }) => {
    console.log("🤖 Generating AI insights...");

    const revenueData = inputData["revenue-analysis"];
    const profitabilityData = inputData["shoot-type-profitability"];
    const trendData = inputData["trend-analysis"];

    const prompt = `Based on the following photography business data, provide strategic insights and actionable recommendations:

REVENUE DATA:
- Total Annual Revenue: $${revenueData.totalRevenue}
- Average Per Shoot: $${revenueData.averagePerShoot}
- Monthly breakdown: ${JSON.stringify(revenueData.monthlyBreakdown)}

PROFITABILITY BY SHOOT TYPE:
${profitabilityData.byType.map(t =>
  `- ${t.type}: $${t.avgHourlyRate}/hr (${t.shootCount} shoots, $${t.totalRevenue} total)`
).join('\n')}
- Most Profitable: ${profitabilityData.mostProfitable}

TRENDS:
- Total Shoots: ${trendData.totalShoots}
- Busiest Month: ${trendData.busiestMonth}
- Most Common Start Time: ${trendData.mostCommonStartTime}
- Quarterly: ${JSON.stringify(trendData.quarterlyBreakdown)}

Please provide:
1. Key insights about business performance
2. Specific recommendations for growth
3. Pricing strategy suggestions
4. Areas to focus on or potentially phase out

Keep it concise but actionable.`;

    const agent = mastra.getAgent("photographyBIAgent");
    const { text } = await agent.generate([
      { role: "user", content: prompt },
    ]);

    return {
      insights: text,
      recommendations: [
        "Focus on most profitable shoot types",
        "Adjust pricing based on hourly rate analysis",
        "Book more shoots during slow months",
      ],
    };
  },
});

// Step 5: Format Final Report
const formatReportStep = createStep({
  id: "format-report",
  description: "Formats comprehensive year-end report",
  inputSchema: z.object({
    insights: z.string(),
    recommendations: z.array(z.string()),
  }),
  outputSchema: z.object({
    report: z.string(),
    generatedAt: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log("📄 Formatting final report...");

    const report = `
# 📊 YEAR-END BUSINESS REVIEW

Generated: ${new Date().toLocaleDateString()}

---

## 💡 AI-Powered Insights

${inputData.insights}

---

## 🎯 Recommendations

${inputData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---

*Report generated by Photography BI Agent*
`;

    // Save report to file
    try {
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `year-end-review-${timestamp}.md`;
      const filepath = path.join(reportsDir, filename);

      fs.writeFileSync(filepath, report);
      console.log(`✅ Report saved to: reports/${filename}`);
    } catch (error) {
      console.error("⚠️ Could not save report file:", error);
      // Continue anyway - don't fail the workflow
    }

    return {
      report,
      generatedAt: new Date().toISOString(),
    };
  },
});

// Create the Year-End Review Workflow
export const yearEndReviewWorkflow = createWorkflow({
  id: "year-end-review",
  description: "Comprehensive year-end business review with parallel analysis",
  inputSchema: z.object({
    year: z.number().optional(),
  }),
  outputSchema: z.object({
    report: z.string(),
    generatedAt: z.string(),
  }),
})
  .then(fetchShootDataStep)
  .parallel([
    revenueAnalysisStep,
    shootTypeProfitabilityStep,
    trendAnalysisStep,
  ])
  .then(generateInsightsStep)
  .then(formatReportStep)
  .commit();
