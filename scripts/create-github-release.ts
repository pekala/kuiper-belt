import { CommitDescription } from "types";
import octokit from "./get-github-api";
import pkgJSON from "../package.json";

const [owner, repo] = pkgJSON.repository.split("/");

const getCommitDescLine = (commitDesc: CommitDescription) => {
  let descLine = "";
  const commit = commitDesc.commit;
  if (commit.header.type === "fix") {
    descLine += "*Fix*";
  }
  if (commit.header.type === "feat") {
    descLine += "*Functionality*";
  }

  if (commit.isBreaking) {
    descLine += " **BREAKING!**";
  }
  descLine += ` ${commitDesc.hash.substr(0, 7)}: ${commit.header.subject}`;
  return descLine;
};

export default async function createGithubRelease(
  tag: string,
  commitDescs: CommitDescription[]
) {
  octokit.repos.createRelease({
    owner,
    repo,
    tag_name: tag,
    body: commitDescs
      .filter(commitDesc => commitDesc.commit.increment)
      .map(getCommitDescLine)
      .join("\n")
  });
}
