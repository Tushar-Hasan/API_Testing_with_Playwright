import fs from "fs";
import path from "path";

// Generalized function to update JSON file
async function updateJsonFile(newData, filePath) {
  try {
    // Read the existing content if the file exists
    let jsonData = {};
    if (fs.existsSync(filePath)) {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      jsonData = JSON.parse(fileContent);
    }

    // Update JSON data with new information
    Object.assign(jsonData, newData);

    // Write updated JSON data back to the file
    const jsonString = JSON.stringify(jsonData, null, 2);
    await fs.promises.writeFile(filePath, jsonString);
    console.log(`Data updated in ${filePath}`);
  } catch (error) {
    console.error(`Error updating file: ${error}`);
  }
}

export default updateJsonFile;