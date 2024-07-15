const fs = require("fs").promises;
const path = require("path");

const productsFs = path.join(__dirname, "productsJson.json");
const cartsFs = path.join(__dirname, "cartsJson.json");

const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    } else {
      throw err;
    }
  }
};

const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    throw err;
  }
};

module.exports = {
  readJSONFile,
  writeJSONFile,
  productsFs,
  cartsFs,
};
