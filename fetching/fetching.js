const fetch = require("node-fetch-commonjs");
const { API_key } = require("./APIKey");

const rootURL = "https://api.henrikdev.xyz/valorant/v1";
const headers = { Authorization: API_key };
const APIConfigGET = { method: "GET", headers: headers };

const getRankedData = async (name, id) => {
  const resp = await fetch(`${rootURL}/mmr/na/${name}/${id}`, APIConfigGET);
  const data = await resp.json();
  return data;
};

const getUserData = async (name, id) => {
  const resp = await fetch(`${rootURL}/account/${name}/${id}`, APIConfigGET);
  const data = await resp.json();
  return data;
};

const getRankedDataByPUUID = async (puuid) => {
  const resp = await fetch(`${rootURL}/by-puuid/mmr/na/${puuid}`, APIConfigGET);
  const data = await resp.json();
  return data;
};

const getRankedDataByPUUIDs = async (puuids) => {
  const data = await Promise.all(
    puuids.map((puuid) => getRankedDataByPUUID(puuid))
  );
  return data;
};

module.exports = {
  getRankedData,
  getUserData,
  getRankedDataByPUUID,
  getRankedDataByPUUIDs,
};
