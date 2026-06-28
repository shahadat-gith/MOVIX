import UserActivity from "../models/UserActivity.js";

export const trackActivity = async (payload) => {
  try {
    if (!payload?.user || !payload?.type) {
      return;
    }

    await UserActivity.create(payload);

  } catch (error) {
    console.error(error);
  }
};