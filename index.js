async function getGithubActivity(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`,
    {
      headers: {
        "User-Agent": "node.js",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(`Error fetching data: ${response.status}`);
    }
  }

  return response.json();
}

function displayActivity(events) {
  if (events.length === 0) {
    console.log("No recent activity found.");
    return;
  }

  events.forEach((event) => {
    let action;
    const repoName = event.repo.name;
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `Pushed ${commitCount} commits to ${repoName}`;
        break;
      case "IssuesEvent":
        action = `${
          event.payload.action[0].toUpperCase() + event.payload.action.slice(1)
        } an issue in ${repoName}`;
        break;
      case "WatchEvent":
        action = `Starred ${repoName}`;
        break;
      case "ForkEvent":
        action = `Forked ${repoName}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${repoName}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${repoName}`;
        break;
    }
    console.log(`- ${action}`);
  });
}

const username = process.argv[2];

if (!username) {
  throw new Error("Please provide username.");
}

getGithubActivity(username).then((events) => displayActivity(events));
