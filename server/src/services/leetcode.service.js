import { ApiError } from "../utils/api-error.js";
import axios from "axios";

const LEETCODE_API_URL = "https://leetcode.com/graphql";
const LEETCODE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
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
      userCalendar {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    recentAcSubmissionList(
    username: $username
    limit: 10
  ) {
    id
    title
    titleSlug
    timestamp
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
    },
  });
  let response;
  try {
    response = await leetcodeClient.post("", {
      query: LEETCODE_QUERY,
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

  return {
    user: data.data.matchedUser,
    contest: data.data.userContestRanking,
    recentSubmissions: data.data.recentAcSubmissionList || [],
  };
};
