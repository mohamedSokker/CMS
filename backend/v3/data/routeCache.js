const nodeCache = require("node-cache");

const cacheMemory = new nodeCache();
const duration = 600;

const cache = (updateKey) => (req, res, next) => {
  let key = ``;
  let fieldsData = { ...req.body };
  if (fieldsData) {
    key += `${fieldsData?.usersData ? fieldsData?.usersData[0]?.username : ""}`;
    delete fieldsData.usersData;
    key += ` ${Object.values(fieldsData).join(" ")} ${req.originalUrl}`;
  } else {
    key = req.originalUrl;
  }
  const cachedRespone = cacheMemory.get(key);
  const updateRequired = cacheMemory.get(updateKey);
  console.log(typeof updateRequired);

  if (cachedRespone && updateRequired === false) {
    console.log(`cache hits for ${key}`);
    console.log(`cache hits for ${updateKey}`);
    res.send(cachedRespone);
  } else {
    console.log(`cache missed for ${key}`);
    console.log(`cache missed for ${updateKey}`);
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cacheMemory.set(key, body, duration);
      cacheMemory.set(updateKey, false, duration);
    };
    next();
  }
};

module.exports = { cache, cacheMemory };
