import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import type { Site } from '@/types/site';

/**
 * Generates a random date within the last year.
 * @returns {Date} A random Date object.
 */
function getRandomDate(): Date {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const randomTime =
    oneYearAgo.getTime() +
    Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTime);
}

/**
 * Generates a single site entry with random data.
 * @param {number} index - The index of the site, used to ensure variety.
 * @returns {Site} A generated Site object.
 */
function generateSiteEntry(index: number): Site {
  return {
    name: `Site ${index + 1}`,
    id: uuidv4(), // unique ID
    updatedAt: getRandomDate(),
    isMalicious: Math.random() > 0.5,
  };
}

async function generateData() {
  const numberOfEntries = 100;
  const sites: Site[] = [];

  for (let i = 0; i < numberOfEntries; i++) {
    sites.push(generateSiteEntry(i));
  }

  const outputPath = 'public/sites.json';

  try {
    // Ensure the 'public' directory exists for caching
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }

    // Create a top-level object with the 'sites' array nested inside
    const dataToWrite = {
      sites: sites,
      // You can add other metadata here if needed in the future:
      // version: "1.0",
      // generatedAt: new Date().toISOString(),
      // totalCount: numberOfEntries,
    };

    // JSON.stringify with null, 2 makes the output pretty-printed (indented by 2 spaces), no replacer function is used.
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(dataToWrite, null, 2),
    );
    console.log(
      `Successfully generated ${numberOfEntries} site entries to ${outputPath}`,
    );
  } catch (error) {
    console.error(`Error generating data:`, error);
  }
}

generateData();
