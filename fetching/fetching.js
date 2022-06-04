const fetch = require('node-fetch-commonjs');

const getRankedData = async (name, id) => {
  const resp = await fetch(
    `https://api.henrikdev.xyz/valorant/v1/mmr/na/${name}/${id}`
  );
  const data = await resp.json();
  return data;
};

const getUserData = async (name, id) => {
  const resp = await fetch(
    `https://api.henrikdev.xyz/valorant/v1/account/${name}/${id}`
  );
  const data = await resp.json();
  return data;
};

const getRankedDataByPUUID = async (puuid) => {
  const resp = await fetch(
    `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/na/${puuid}`
  );
  const data = await resp.json();
  return data;
};

const getRankedDataByPUUIDs = async (puuids) => {
  const data = await Promise.all(puuids.map((data => getRankedDataByPUUID(data))));
  return data;
}


module.exports = { getRankedData, getUserData, getRankedDataByPUUID, getRankedDataByPUUIDs }

  // getRankedData("nugnug", "6135").then((data) => {
  //   console.log(data);
  // });