export interface BrowsingSourceData {
  url: string;
  failsafeDate: string;
}

export interface BrowsingData {
  lastPosts: {
    e621: BrowsingSourceData;
  };
}
