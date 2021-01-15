const searchForm = document.getElementById('github-form');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search')
const userList = document.getElementById('user-list')
const repoList = document.getElementById('repo-list')
const configObj = {
  headers: {Accept: "application/vnd.github.v3+json"}
};

searchForm.addEventListener('submit', startSearch)

//Button to toggle between user-search and repo-search
document.getElementById('search-toggle').addEventListener('click', function(e){
  const searchFormStates = {'user-search':'repo-search', 'repo-search':'user-search'};
  const searchButtonStates = {'Search by Username':'Search by Repo', 'Search by Repo':'Search by Username'};
  const toggleButtonStates = {'Click to toggle search by repository':'Click to toggle search by username', 'Click to toggle search by username':'Click to toggle search by repository'};
  searchForm.className = searchFormStates[searchForm.className];
  searchButton.value = searchButtonStates[searchButton.value];
  e.target.innerText = toggleButtonStates[e.target.innerText];
  resetDisplay();
})

function startSearch(e) {
  e.preventDefault();
  let searchParam = searchInput.value;
  resetDisplay();
  if (e.target.className === 'user-search') {
    userSearch(searchParam);
  } else if (e.target.className === 'repo-search') {
    repoSearch(searchParam)
  }
}

function userSearch(username) {
  fetch(`https://api.github.com/search/users?q=${username}`, configObj)
  .then(function(resp) {
    return resp.json()
  })
  .then(function(userData) {
    userData.items.forEach(addUserToList);
  });
}

function repoSearch(repo) {
  fetch(`https://api.github.com/search/repositories?q=${repo}`, configObj)
  .then(function(resp) {
    return resp.json()
  })
  .then(repoData => {
    repoData.items.forEach(addRepoToList);
  })
}

function userRepoSearch(event) {
  let username = event.target.innerText;
  fetch(`https://api.github.com/users/${username}/repos`, configObj)
  .then(function(resp) {
    return resp.json()
  })
  .then(repoArray => {
    userList.innerHTML = `<li><strong>${username}</strong></li>`;
    if (repoArray.length === 0) {
      repoList.innerHTML = "<li>There were no repositories found for this user.</li>";
    } else if (repoArray.length > 0) {
      repoArray.forEach(addRepoToList);
    }
  })
}

function addUserToList(user) {
  let li = document.createElement('li');
  li.innerHTML = `<a class='user-link'>${user.login}</a><br>`;
  userList.appendChild(li);
  li.addEventListener('click', userRepoSearch);
}

function addRepoToList(repo) {
  let li = document.createElement('li');
  li.innerHTML = `<a class='repo-link'>${repo.name}</a><br>`;
  repoList.appendChild(li);
}

function resetDisplay() {
  searchInput.value = "";
  userList.innerHTML = "";
  repoList.innerHTML = "";
}