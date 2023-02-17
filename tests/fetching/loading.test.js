const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../../fetching/loading");

describe("Tests for loading.js", () => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");
  const mockMessage = {};
  mockMessage.reply = jest.fn();

  afterEach(() => {
    mockMessage.reply.mockClear();
    setTimeout.mockClear();
  });

  describe("generateLoadingTime", () => {
    test("Should reply after 1 second", () => {
      generateLoadingTime(mockMessage);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(mockMessage.reply).not.toBeCalled();

      jest.advanceTimersByTime(1000);

      expect(mockMessage.reply).toBeCalled();
      expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    });

    test("Should reply after 3 seconds", () => {
      generateLoadingTime(mockMessage, 3000);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(mockMessage.reply).not.toBeCalled();

      jest.advanceTimersByTime(1000);

      expect(mockMessage.reply).not.toBeCalled();

      jest.advanceTimersByTime(2000);

      expect(mockMessage.reply).toBeCalled();
      expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeLoadingInstance", () => {
    test("Should not reply", () => {
      const dataLoading = generateLoadingTime(mockMessage);

      expect(setTimeout).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(500);

      removeLoadingInstance(dataLoading);

      jest.advanceTimersByTime(500);

      expect(mockMessage.reply).not.toBeCalled();
    });

    test("removeLoadingInstance missed, should reply after 3 seconds", () => {
      const dataLoading = generateLoadingTime(mockMessage, 3000);

      expect(setTimeout).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3100);

      removeLoadingInstance(dataLoading);

      expect(mockMessage.reply).toBeCalled();
      expect(mockMessage.reply).toHaveBeenCalledTimes(1);
    });
  });
});
