import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";

const getPlatformUsername = (user, platformName) => {
  const entry = user.connectedPlatforms.find(
    (p) => p.platform === platformName,
  );
  return entry?.username || null;
};

const GITHUB_QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      company
      location
      websiteUrl
      twitterUsername
      followers { totalCount }
      following  { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
          stargazerCount
        }
      }
      contributionsCollection {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
      pullRequests           { totalCount }
      issues                 { totalCount }
      repositoriesContributedTo { totalCount }
    }
  }
`;

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
  }
`;
