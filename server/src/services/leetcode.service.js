import { ApiError } from "../utils/api-error.js";
import axios from "axios";

const LEETCODE_API_URL = "https://leetcode.com/graphql";

const LEETCODE_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submissionCalendar
      profile {
        realName
        ranking
        userAvatar
        countryName
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced    { tagName tagSlug problemsSolved }
        intermediate{ tagName tagSlug problemsSolved }
        fundamental { tagName tagSlug problemsSolved }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    recentAcSubmissionList(username: $username, limit: 10) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const LEETCODE_CALENDAR_QUERY = `
  query getUserCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

export const fetchLeetcodeRawData = async (username) => {
  const leetcodeClient = axios.create({
    baseURL: LEETCODE_API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  let response;
  try {
    response = await leetcodeClient.post("", {
      query: LEETCODE_PROFILE_QUERY,
      variables: { username },
    });
  } catch (err) {
    if (err.response) {
      throw new ApiError(
        502,
        `LeetCode API request failed with status ${err.response.status}`,
      );
    }
    throw new ApiError(502, "LeetCode API request failed");
  }

  const { data } = response;
  if (!data.data?.matchedUser) {
    throw new ApiError(404, "LeetCode user not found");
  }

  const user = data.data.matchedUser;

  // Fetch calendar separately so permission restrictions on userCalendar don't break profile fetching
  try {
    const calendarRes = await leetcodeClient.post("", {
      query: LEETCODE_CALENDAR_QUERY,
      variables: { username },
    });
    if (calendarRes.data.data?.matchedUser?.userCalendar) {
      user.userCalendar = calendarRes.data.data.matchedUser.userCalendar;
    }
  } catch (err) {
    console.log(`Calendar data restricted for LeetCode user ${username}`);
  }

  if (!user.userCalendar) {
    user.userCalendar = {
      activeYears: [],
      streak: 0,
      totalActiveDays: 0,
      submissionCalendar: "{}",
    };
  }

  return {
    user,
    contest: data.data.userContestRanking,
    recentSubmissions: data.data.recentAcSubmissionList || [],
  };
};
