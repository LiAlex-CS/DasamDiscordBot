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
});
