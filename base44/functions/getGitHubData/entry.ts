import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');

    const body = await req.json().catch(() => ({}));
    const { owner, repo, action } = body;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // Fetch authenticated user info & their repos if no specific repo given
    if (action === 'listRepos') {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30&type=all', { headers });
      const repos = await res.json();
      return Response.json({ repos });
    }

    if (action === 'getPullRequests' && owner && repo) {
      const [openRes, closedRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=20`, { headers }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=10`, { headers }),
      ]);
      const [open, closed] = await Promise.all([openRes.json(), closedRes.json()]);
      return Response.json({ pullRequests: [...(Array.isArray(open) ? open : []), ...(Array.isArray(closed) ? closed : [])] });
    }

    if (action === 'getCommits' && owner && repo) {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`, { headers });
      const commits = await res.json();
      return Response.json({ commits: Array.isArray(commits) ? commits : [] });
    }

    if (action === 'getRepoStats' && owner && repo) {
      const [repoRes, issuesRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`, { headers }),
      ]);
      const [repoData, issues] = await Promise.all([repoRes.json(), issuesRes.json()]);
      return Response.json({ repo: repoData, issues: Array.isArray(issues) ? issues : [] });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});