import { threadList } from './threadList';

describe('threadList', () => {

  afterEach(() => {
    for (const { id } of threadList.runningThreads) {
      threadList.removeThread(id);
    }

    // @ts-ignore
    threadList._cleanups = [];
  });

  describe('addThread()', () => {
    it('should add a thread to the list with an id', () => {
      const threadName = 'this is my super thread :0';

      expect(threadList.runningThreads).toEqual([]);
      const firstId = threadList.addThread(threadName);
      expect(threadList.runningThreads).toEqual([{ name: threadName, id: firstId }]);
      const secondId = threadList.addThread(threadName);
      expect(threadList.runningThreads).toEqual([{ name: threadName, id: firstId }, { name: threadName, id: secondId }]);
    });
  });

  describe('removeThread()', () => {
    it('should remove a thread from the list using the id', () => {
      const threadName = 'this is my super thread :0';

      const firstId = threadList.addThread(threadName);
      const secondId = threadList.addThread(threadName);
      const thirdId = threadList.addThread(threadName);

      threadList.removeThread(firstId);
      threadList.removeThread(thirdId);

      expect(threadList.runningThreads).toEqual([{ name: threadName, id: secondId }]);
    });
  });

  describe('addCleanup()', () => {
    it('should add a cleanup function', () => {
      const signal = 'my signal';
      const cleanup = jest.fn();

      expect(threadList.cleanups).toHaveLength(0);
      threadList.addCleanup(cleanup);
      expect(threadList.cleanups).toHaveLength(1);

      expect(cleanup).not.toHaveBeenCalled();
      threadList.cleanups[0](signal);
      expect(cleanup).toHaveBeenCalledWith(signal);
    });
  });

  describe('onceFinished()', () => {
    it('should call the callback when there is currently no running threads', () => {
      const callback = jest.fn();

      threadList.onceFinished(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should call the callback only after the threads have all finished to run', () => {
      const callback = jest.fn();

      const threadId = threadList.addThread('thread');

      threadList.onceFinished(callback);
      expect(callback).not.toHaveBeenCalled();

      threadList.removeThread(threadId);
      expect(callback).toHaveBeenCalled();
    });
  });
});
