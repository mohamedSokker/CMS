const fs = require("fs");

const { getData } = require("../../../helpers/getData");
let { cache } = require("../../../model/mainModel");

const CACHE_FILE = `/home/mohamed/bauereg/cache.json`;
const TTL = 30 * 24 * 60 * 60 * 1000;

// let cache = {};

// const getMany = async (Number, table) => {
//   try {
//     const query = `SELECT TOP ${Number} * FROM ${table} ORDER BY ID DESC`;
//     return (await getData(query)).recordsets[0];
//   } catch (error) {
//     console.log(error);
//   }
// };

const loadCache = () => {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CACHE_FILE, "utf8");
      const cachedData = JSON.parse(data);
      Object.keys(cache).forEach((key) => delete cache[key]); // Clear previous content
      Object.assign(cache, cachedData.data || {});
      // cache = JSON.parse(data) || {};
      // console.log(`Cache =>${JSON.stringify(cache)}`);
      console.log("Cache loaded successfully.");
      return cache;
    } catch (err) {
      console.log("Error loading cache:", err);
      cache = {};
      return {};
    }
  } else {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({}, null, 2), "utf-8");
    console.log("Cache file created.");
    return {};
  }
};

// const setCache = async ({ count, table }) => {
//   const addedData = await getMany(count, table);
//   cache[table] = cache[table].concat(addedData);
//   //   cache[table] = {
//   //     ...cache[table],
//   //     data,
//   //     Date: new Date(),
//   //   };
//   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
// };

// const updateCache = (table, data, id) => {

// }

module.exports = { loadCache, cache, TTL, CACHE_FILE };
