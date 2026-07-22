
import { ApiError } from "../utils/api-error.js";
import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/graphql";

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



export const fetchGithubRawData = async (githubUsername) => {
  const githubClient = axios.create({
    baseURL: GITHUB_API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
  });

  let response;
  try {
    response = await githubClient.post("", {
      query: GITHUB_QUERY,
      variables: { login: githubUsername },
    });
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        502,
        `GitHub API request failed with status ${error.response.status}`,
      );
    }
    throw new ApiError(
      502,
      error.message || "Failed to fetch data from GitHub API",
    );
  }
  const { data } = response;

  if (data.errors) {
    throw new ApiError(404, data.errors[0]?.message || "GitHub user not found");
  }
  if (!data.data?.user) {
    throw new ApiError(404, "GitHub user not found");
  }

  return data.data.user;
};
