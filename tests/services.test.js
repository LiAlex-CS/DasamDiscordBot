const services = require("../services");
const {
  MOCK_VAL_API_RESPS,
  MOCK_COMMANDS,
} = require("../constants/testing_consts");

describe("Tests for services.js", () => {
  describe("JSONHasKey", () => {
    test("JSON should have key", () => {
      const res = MOCK_VAL_API_RESPS.ranked_data_success;
      const key = "status";
      const result = services.JSONHasKey(key, res);
      expect(result).toBe(true);
    });
    test("JSON should not have key", () => {
      const res = MOCK_VAL_API_RESPS.ranked_data_success;
      const key = "res";
      const result = services.JSONHasKey(key, res);
      expect(result).toBe(false);
    });
  });

  describe("JSONHasValue", () => {
    test("JSON should have value", () => {
      const resp = MOCK_VAL_API_RESPS.ranked_data_success;
      const value = 200;
      const result = services.JSONHasValue(value, resp);
      expect(result).toBe(true);
    });
    test("JSON should not have value", () => {
      const resp = MOCK_VAL_API_RESPS.ranked_data_success;
      const value = 400;
      const result = services.JSONHasValue(value, resp);
      expect(result).toBe(false);
    });
  });

  describe("stringArrToString", () => {
    test("Should convert array of strings to string", () => {
      const commandArr = MOCK_COMMANDS.command_array;
      const commandStr = MOCK_COMMANDS.command_string;
      const result = services.stringArrToString(commandArr);
      expect(result).toBe(commandStr);
    });
  });

  describe("justifyContentApart", () => {
    test("Should space string out apart", () => {
      const testArray = ["first", "second"];
      const totalSpace = 30;
      const spacedString = services.justifyContentApart(testArray, totalSpace);

      expect(spacedString.length).toBe(totalSpace);
      expect(spacedString.startsWith(testArray[0])).toBe(true);
      expect(spacedString.endsWith(testArray[1])).toBe(true);
    });

    test("Should return undefined if strArr is not of lenght 2", () => {
      const testArray1 = ["first", "second", "third"];
      const testArray2 = ["first"];
      const totalSpace = 30;
      const spacedString1 = services.justifyContentApart(
        testArray1,
        totalSpace
      );
      const spacedString2 = services.justifyContentApart(
        testArray2,
        totalSpace
      );

      expect(spacedString1).toBe(undefined);
      expect(spacedString2).toBe(undefined);
    });
  });

  describe("removeHashtagFromTag", () => {
    test("Should remove # from tag", () => {
      const tag = "#NA1";
      const tagWithoutHashtag = services.removeHashtagFromTag(tag);
      const expectedTag = "NA1";

      expect(tagWithoutHashtag).toBe(expectedTag);
    });
    test("Should not change tag", () => {
      const tag = "NA1";
      const tagWithoutHashtag = services.removeHashtagFromTag(tag);

      expect(tagWithoutHashtag).toBe(tag);
    });
  });

  describe("fixRank", () => {
    test("Should fix rank to proper format", () => {
      const rank = "silver";
      const fixedRank = services.fixRank(rank);
      const expectedRank = "Silver";

      expect(fixedRank).toBe(expectedRank);
    });
    test("Should convert shortform rank to properlly formatted rank", () => {
      const rank1 = "plat";
      const rank2 = "pLat";
      const rank3 = "Rad";

      const fixedRank1 = services.fixRank(rank1);
      const fixedRank2 = services.fixRank(rank2);
      const fixedRank3 = services.fixRank(rank3);

      const expectedRankPlat = "Platinum";
      const expectedRankRadiant = "Radiant";

      expect(fixedRank1).toBe(expectedRankPlat);
      expect(fixedRank2).toBe(expectedRankPlat);
      expect(fixedRank3).toBe(expectedRankRadiant);
    });
    test("Should remain the same for already formatted rank", () => {
      const rank = "Gold";
      const fixedRank = services.fixRank(rank);

      expect(rank).toBe(fixedRank);
    });
    test("Should return undefined if not rank given", () => {
      const undefinedRank = undefined;
      const fixedRank = services.fixRank(undefinedRank);

      expect(fixedRank).toBe(undefined);
    });
  });
});
