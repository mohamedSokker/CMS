const fs = require("fs");
const events = require("events");
const eventEmitter = new events.EventEmitter();

const { model } = require("../model/mainModel");
const { getData } = require("../../v3/helpers/getData");
// const { cache } = require("../model/mainModel");
// const { cache } = require("../services/web/Cache/cache");
// const { io } = require("../socket/socket");

// const CACHE_TABLES = [
//   "Maintenance",
//   "Equipments_Location",
//   "FuelConsumption",
//   "Consumptions",
//   "OilConsumption",
//   "Production_Piles",
//   "Production_TrenchCutting",
//   "ProductionGrouting",
//   "Test",
// ];

// const CACHE_FILE = `/home/mohamed/bauereg/cache.json`;

const getMany = async (Number, table) => {
  try {
    const query = `SELECT TOP ${Number} * FROM ${table} ORDER BY ID DESC`;
    return (await getData(query)).recordsets[0];
  } catch (error) {
    console.log(error);
  }
};

eventEmitter.on("addedOne", async ({ count, table }) => {
  const addedData = await getMany(count, table);
  model[table] = model[table].concat(addedData);
  // if (CACHE_TABLES.includes(table)) {
  //   const cacheAddedData = [];
  //   addedData?.forEach((row) => {
  //     cacheAddedData.push({ ...row, currentDate: new Date() });
  //   });
  //   cache[table] = cache[table] || [];
  //   cache[table] = cache[table].concat(cacheAddedData);
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  // }

  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("addedMany", async ({ data, table }) => {
  const addedData = await getMany(data, table);
  const sortedAddedData = addedData.sort((a, b) => Number(a.ID) - Number(b.ID));
  model[table] = model[table].concat(sortedAddedData);

  // if (CACHE_TABLES.includes(table)) {
  //   const cacheAddedData = [];
  //   sortedAddedData?.forEach((row) => {
  //     cacheAddedData.push({ ...row, currentDate: new Date() });
  //   });
  //   cache[table] = cache[table] || [];
  //   cache[table] = cache[table].concat(cacheAddedData);
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  // }

  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("updatedOne", ({ data, table }) => {
  const updatedData = data;
  const targetItem = model[table].find(
    (item) => Number(item.ID) === Number(data.ID)
  );
  const index = model[table].findIndex(
    (item) => Number(item.ID) === Number(data.ID)
  );

  if (targetItem) {
    model[table][index] = { ...targetItem, ...updatedData };
  } else {
    console.log("Item not found.");
  }

  // if (CACHE_TABLES.includes(table)) {
  //   cache[table] = cache[table] || [];
  //   const cacheTargetItem = cache[table].find(
  //     (item) => Number(item.ID) === Number(data.ID)
  //   );
  //   const cacheIndex = cache[table].findIndex(
  //     (item) => Number(item.ID) === Number(data.ID)
  //   );

  //   if (cacheTargetItem) {
  //     cache[table][cacheIndex] = {
  //       ...cacheTargetItem,
  //       ...updatedData,
  //       currentDate: new Date(),
  //     };
  //     fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  //   } else {
  //     console.log("Cache Item not found.");
  //   }
  // }

  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("updatedMany", ({ data, table }) => {
  const updatedData = data;
  const targetData = model[table].map((originalItem) => {
    let replacement = updatedData.find(
      (replaceItem) => replaceItem.ID === originalItem.ID
    );

    return replacement ? { ...originalItem, ...replacement } : originalItem;
  });

  model[table] = targetData;

  // if (CACHE_TABLES.includes(table)) {
  //   cache[table] = cache[table] || [];
  //   const cacheTargetData = cache[table].map((originalItem) => {
  //     let replacement = updatedData.find(
  //       (replaceItem) => replaceItem.ID === originalItem.ID
  //     );

  //     return replacement ? { ...originalItem, ...replacement } : originalItem;
  //   });
  //   const cacheResultData = [];
  //   cacheTargetData?.forEach((row) => {
  //     cacheResultData.push({ ...row, currentDate: new Date() });
  //   });
  //   cache[table] = cacheResultData;
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  // }

  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("deletedOne", ({ id, table }) => {
  model[table] = model[table]?.filter((d) => Number(d.ID) !== Number(id));
  // if (CACHE_TABLES.includes(table)) {
  //   cache[table] = cache[table] || [];
  //   cache[table] = cache[table]?.filter((d) => Number(d.ID) !== Number(id));
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  // }

  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("deletedMany", ({ ids, table }) => {
  model[table] = model[table].filter((d) => !ids.includes(d.ID));
  // if (CACHE_TABLES.includes(table)) {
  //   cache[table] = cache[table] || [];
  //   cache[table] = cache[table].filter((d) => !ids.includes(d.ID));
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  // }

  //   io.emit("appDataUpdate", model[table]);
});

module.exports = { eventEmitter };
