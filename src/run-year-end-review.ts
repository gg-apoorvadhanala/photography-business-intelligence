import { mastra } from "./mastra";
import * as fs from "fs";
import * as path from "path";

async function runYearEndReview() {
  console.log("🚀 Running Year-End Business Review Workflow...\n");

  try {
    // Get the workflow
    const workflow = mastra.getWorkflow("yearEndReviewWorkflow");

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Create a run instance
    const run = await workflow.createRun();

    // Execute with year parameter
    const result = await run.start({
      inputData: {
        year: 2024,
      },
    });

    if (result.status === "success") {
      console.log("✅ Workflow completed successfully!\n");

      // Extract the report
      const report = result.result.report;

      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      // Save to file with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `year-end-review-${timestamp}.md`;
      const filepath = path.join(reportsDir, filename);

      fs.writeFileSync(filepath, report);

      console.log(`📄 Report saved to: ${filepath}`);
      console.log("\n📊 Preview:\n");
      console.log("=".repeat(80));
      console.log(report);
      console.log("=".repeat(80));

      console.log(`\n✨ Open the file in any Markdown viewer for best formatting!`);
    } else {
      console.error("❌ Workflow failed:", result);
    }
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
  }
}

// Run the workflow
runYearEndReview();
