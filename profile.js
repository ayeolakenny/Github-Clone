const mobileNav = document.querySelector(".mobile-nav");
const toggleButton = document.querySelector(".toggle-btn");
const toggleDropdown2 = document.querySelector(".dropdown-action2");
const dropdownMenu2 = document.querySelector(".dropdown2");
const toggleDropdown1 = document.querySelector(".dropdown-action1");
const dropdownMenu1 = document.querySelector(".dropdown1");
const navUsernameLink = document.querySelectorAll(".nav-username-link");
const subHeader = document.querySelector(".subheader");
const subHeaderImage = document.querySelector(".user-subheader-image");
const mobileSubNav = document.querySelector(".mobile-subnav");
const userImage = document.querySelectorAll(".user-image");
const username = document.querySelectorAll(".username");
const userProfileName = document.querySelector(".userprofilename");
const userBio = document.querySelector(".userbio");
const profileBadge = document.querySelector(".profile-badge-container");
const profileStatus = document.querySelector(".user-profile-status");
const repositoryCardContainer = document.querySelector(
  ".repository-card-container"
);
const followersCount = document.querySelector(".followers-count");
const followingCount = document.querySelector(".following-count");
const starCount = document.querySelector(".star-count");

// mobile navigation
const showMobileMenu = () =>
  mobileNav.classList.contains("hide")
    ? mobileNav.classList.remove("hide")
    : mobileNav.classList.add("hide");

if (toggleButton) toggleButton.addEventListener("click", showMobileMenu);

if (toggleDropdown1)
  toggleDropdown1.addEventListener("click", () =>
    dropdownMenu1.classList.toggle("active")
  );

if (toggleDropdown2)
  toggleDropdown2.addEventListener("click", () =>
    dropdownMenu2.classList.toggle("active")
  );

// sub navigation fixed
window.onscroll = () => {
  if (window.pageYOffset > 100) {
    subHeaderImage.style.visibility = "visible";
    subHeader.style.position = "fixed";
    mobileSubNav.style.position = "fixed";
    subHeader.style.top = 0;
    mobileSubNav.style.top = 0;
  } else {
    subHeaderImage.style.visibility = "hidden";
    subHeader.style.position = "static";
    mobileSubNav.style.position = "static";
  }

  if (window.pageYOffset > 300) {
    mobileSubNav.style.position = "fixed";
    mobileSubNav.style.top = 0;
  } else {
    mobileSubNav.style.position = "static";
  }
};

// Format date string
const dateStringFormatter = (timeValue, format) =>
  `Updated ${timeValue} ${format}${timeValue > 1 ? "s" : ""} ago`;

// Calculate date
const dateFormatter = (current, previous) => {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute)
    return dateStringFormatter(Math.round(elapsed / 1000), "second");
  else if (elapsed < msPerHour)
    return dateStringFormatter(Math.round(elapsed / msPerMinute), "minute");
  else if (elapsed < msPerDay)
    return dateStringFormatter(Math.round(elapsed / msPerHour), "hour");
  else if (elapsed < msPerMonth)
    return dateStringFormatter(Math.round(elapsed / msPerDay), "day");
  else if (elapsed < msPerYear)
    return dateStringFormatter(Math.round(elapsed / msPerMonth), "month");
  else return dateStringFormatter(Math.round(elapsed / msPerYear), "year");
};

// round followers count
const roundLargeNumbers = (num) => {
  const intlFormat = (num) =>
    new Intl.NumberFormat().format(Math.round(num * 10) / 10);

  if (num >= 1000000) return intlFormat(num / 1000000) + "M";
  if (num >= 1000) return intlFormat(num / 1000) + "k";
  return intlFormat(num);
};

//Populate the Dom with user data
const populateDom = (userData) => {
  if (userData) {
    let {
      avatarUrl,
      login,
      name,
      bio,
      url,
      followers,
      following,
      starredRepositories,
    } = userData;
    userImage.forEach((image) => (image.src = avatarUrl));
    username.forEach((username) => (username.textContent = login));
    userProfileName.textContent = name;
    userBio.textContent = bio;
    followersCount.textContent = roundLargeNumbers(followers.totalCount);
    followingCount.textContent = roundLargeNumbers(following.totalCount);
    starCount.textContent = roundLargeNumbers(starredRepositories.totalCount);
    if (userData.status !== null) {
      profileBadge.innerHTML = `<div class="profile-badge">${userData.status.emojiHTML}</div>`;
      profileStatus.innerHTML = `${userData.status.emojiHTML}<span>${userData.status.message}</span>`;
    }
    navUsernameLink.forEach((navUsername) => (navUsername.href = url));

    userData.repositories.edges.forEach(({ node }) => {
      let {
        description,
        forkCount,
        name,
        updatedAt,
        url,
        stargazerCount,
        primaryLanguage,
      } = node;

      let languageName;
      let languageColor;

      if (primaryLanguage !== null) {
        languageColor = primaryLanguage.color;
        languageName = primaryLanguage.name;
      }

      return repositoryCardContainer.insertAdjacentHTML(
        "afterend",
        `
              <div class="repository-card">
                <div class="repository-body">
                    <a href="${url}">${name}</a>
                    ${
                      description
                        ? `<p class="repo-description">${description}</p>`
                        : ""
                    }
                  <div class="repo-stats">
                    ${
                      primaryLanguage
                        ? `<div class="repo-language">
                          <div style=background-color:${languageColor}></div>
                          <p>${languageName}</p>
                        </div>`
                        : ""
                    }
                    ${
                      stargazerCount > 0
                        ? `<p>
                        <img src="/images/star.svg" alt="star icon" /><span
                          >${stargazerCount}</span
                        >
                      </p>`
                        : ""
                    }
                    ${
                      forkCount > 0
                        ? `<p>
                        <img
                          src="/images/git_fork_thin_icon_171747.svg"
                          alt="git fork icon"
                        />
                        <span>${forkCount}</span>
                      </p>`
                        : ""
                    }
                    <p>${dateFormatter(new Date(), new Date(updatedAt))}</p>
                  </div>
                </div>
                <div>
                  <button class="repo-star-button">
                    <img
                      src="/images/star.svg"
                      alt="star icon"
                      style="width: 13px; height: auto"
                    />
                    <span> Star </span>
                  </button>
                </div>
              </div>
              <span class="light-horizontal-span"></span>`
      );
    });
  }
};

window.addEventListener("load", () => {
  populateDom(JSON.parse(sessionStorage.getItem("userData")));
});
