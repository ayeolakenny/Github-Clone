const searchButton = document.querySelector(".search-button");
const buttonLoading = document.querySelector(".button-loading");
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-form");
const errorMessageElement = document.querySelector(".error-msg");

const handleError = (message) => {
  errorMessageElement.style.visibility = "visible";
  searchInput.style.boxShadow = "none";
  searchInput.style.borderColor = "red";
  errorMessageElement.textContent = message;
};

// Fetching graphql data
const fetchUserData = async (userlogin) => {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${secrets.GITHUB_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
      query MyQuery {
  user(login: "${userlogin}") {
    url
    name
    login
    bio
    avatarUrl
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    status {
      emojiHTML
      message
    }
    repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}) {
      edges {
        node {
          description
          forkCount
          name
          updatedAt
          url
          stargazerCount
          id
          primaryLanguage {
            color
            id
            name
          }
        }
      }
    }
  }
}
`,
      }),
    });
    let data = await response.json();
    let userData = data.data.user;
    if (userData === null) {
      handleError("Github accouunt doesn't exist 🥺.");
    } else {
      sessionStorage.setItem("userData", JSON.stringify(userData));
      window.location = "/profile.html";
    }
  } catch (error) {
    handleError("Seems like your internet is down 🚧.");
  }
};

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchButton.style.display = "none";
  buttonLoading.style.display = "flex";
  let githubUsername = searchInput.value;
  await fetchUserData(githubUsername);
  searchButton.style.display = "block";
  buttonLoading.style.display = "none";
});
