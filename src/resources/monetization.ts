export type LockerType = "content" | "url" | "offer" | "video";

export interface LockerConfig {
  enabled: boolean;
  title: string;
  description: string;
  lockerId?: string;
  embedScript?: string;
  offerCount?: number;
  ctaText?: string;
  redirectUrl?: string;
  downloadUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface MonetizationConfig {
  enabled: boolean;
  contentLocker: LockerConfig;
  urlLocker: LockerConfig;
  offerLocker: LockerConfig;
  videoLocker: LockerConfig;
}

const monetization: MonetizationConfig = {
  enabled: true,

  contentLocker: {
    enabled: true,
    title: "Premium Content Unlocked",
    description: "Complete a quick offer to unlock this premium content",
    ctaText: "Unlock Now",
    lockerId: "1894762",
    embedScript: `var lck = false;</script><script type="text/javascript" src="https://quartzfiles.com/script_include.php?id=1894762&tracking_id="></script><script type="text/javascript">if(!lck){top.location = 'https://quartzfiles.com/help/ablk.php?lkt=1'; }</script><noscript>Please enable JavaScript to access this page.<meta http-equiv="refresh" content="0;url=https://quartzfiles.com/help/enable_javascript.php?lkt=1" /></noscript>`,
    offerCount: 2,
  },

  urlLocker: {
    enabled: true,
    title: "Download Unlocked",
    description: "Complete one offer to access this download",
    ctaText: "Access Download",
    lockerId: "1894762",
    offerCount: 1,
  },

  offerLocker: {
    enabled: true,
    title: "Get Free Rewards",
    description: "Choose an offer below to earn credits and unlock rewards",
    ctaText: "Browse Offers",
    lockerId: "1894762",
    offerCount: 4,
  },

  videoLocker: {
    enabled: true,
    title: "Video Preview",
    description: "Complete a quick offer to watch the full video",
    ctaText: "Watch Video",
    lockerId: "1894762",
    offerCount: 1,
  },
};

export { monetization };
