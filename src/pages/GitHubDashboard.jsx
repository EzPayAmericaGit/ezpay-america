import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitPullRequest, GitCommit, GitBranch, AlertCircle, Star, RefreshCw, ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PR_STATE_CONFIG = {
  open: { color: "bg-green-100 text-green-700", icon: <GitPullRequest className="w-3 h-3" /> },
  closed: { color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
  merged: { color: "bg-purple-100 text-purple-700", icon: <CheckCircle2 className="w-3 h-3" /> },
};

function StatCard({ icon, label, value, color = "text-amber-600" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function GitHubDashboard() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoStats, setRepoStats] = useState(null);
  const [pullRequests, setPullRequests] = useState([]);
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repoLoading, setRepoLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prs");

  const invoke = (action, extra = {}) =>
    base44.functions.invoke("getGitHubData", { action, ...extra }).then(r => r.data);

  useEffect(() => {
    invoke("listRepos")
      .then(({ repos }) => setRepos(repos || []))
      .finally(() => setRepoLoading(false));
  }, []);

  const loadRepoData = useCallback(async (repo) => {
    if (!repo) return;
    const [owner, name] = repo.full_name.split("/");
    setLoading(true);
    const [statsRes, prRes, commitRes] = await Promise.all([
      invoke("getRepoStats", { owner, repo: name }),
      invoke("getPullRequests", { owner, repo: name }),
      invoke("getCommits", { owner, repo: name }),
    ]);
    setRepoStats(statsRes.repo);
    setIssues(statsRes.issues || []);
    setPullRequests(prRes.pullRequests || []);
    setCommits(commitRes.commits || []);
    setLoading(false);
  }, []);

  const handleRepoSelect = (fullName) => {
    const repo = repos.find(r => r.full_name === fullName);
    setSelectedRepo(repo);
    loadRepoData(repo);
  };

  const tabs = [
    { id: "prs", label: "Pull Requests", count: pullRequests.length },
    { id: "commits", label: "Commits", count: commits.length },
    { id: "issues", label: "Issues", count: issues.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-xl">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GitHub Dashboard</h1>
              <p className="text-sm text-gray-500">Track development progress & pull requests</p>
            </div>
          </div>
          {selectedRepo && (
            <Button variant="outline" size="sm" onClick={() => loadRepoData(selectedRepo)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>

        {/* Repo Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Repository</label>
          {repoLoading ? (
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <Select onValueChange={handleRepoSelect} value={selectedRepo?.full_name || ""}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a repository..." />
              </SelectTrigger>
              <SelectContent>
                {repos.map(r => (
                  <SelectItem key={r.full_name} value={r.full_name}>
                    {r.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {!selectedRepo && !repoLoading && (
          <div className="text-center py-20 text-gray-400">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Select a repository to view development activity</p>
          </div>
        )}

        {selectedRepo && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard icon={<Star className="w-5 h-5" />} label="Stars" value={repoStats?.stargazers_count} color="text-amber-500" />
              <StatCard icon={<GitPullRequest className="w-5 h-5" />} label="Open PRs" value={pullRequests.filter(p => p.state === "open").length} color="text-green-600" />
              <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Open Issues" value={issues.length} color="text-red-500" />
              <StatCard icon={<GitCommit className="w-5 h-5" />} label="Recent Commits" value={commits.length} color="text-blue-600" />
            </div>

            {/* Repo Info */}
            {repoStats && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900">{repoStats.full_name}</h2>
                  {repoStats.description && <p className="text-sm text-gray-500 mt-1">{repoStats.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {repoStats.language && <Badge variant="outline">{repoStats.language}</Badge>}
                  <a href={repoStats.html_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" /> Open on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-gray-200">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === t.id
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">{t.count}</span>
                </button>
              ))}
            </div>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse" />)}
              </div>
            )}

            {!loading && activeTab === "prs" && (
              <div className="space-y-3">
                {pullRequests.length === 0 && <p className="text-gray-400 text-center py-10">No pull requests found.</p>}
                {pullRequests.map(pr => {
                  const state = pr.merged_at ? "merged" : pr.state;
                  const cfg = PR_STATE_CONFIG[state] || PR_STATE_CONFIG.open;
                  return (
                    <div key={pr.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <div className={`mt-1 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.color}`}>
                        {cfg.icon}
                        <span className="capitalize">{state}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-amber-600 transition-colors">
                          #{pr.number} {pr.title}
                        </a>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>by {pr.user?.login}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(pr.updated_at), { addSuffix: true })}</span>
                          {pr.head?.ref && <Badge variant="outline" className="text-xs">{pr.head.ref}</Badge>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && activeTab === "commits" && (
              <div className="space-y-3">
                {commits.length === 0 && <p className="text-gray-400 text-center py-10">No commits found.</p>}
                {commits.map(c => (
                  <div key={c.sha} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg mt-0.5">
                      <GitCommit className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={c.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-amber-600 transition-colors text-sm">
                        {c.commit?.message?.split("\n")[0]}
                      </a>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{c.commit?.author?.name}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(c.commit?.author?.date), { addSuffix: true })}</span>
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{c.sha?.slice(0, 7)}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && activeTab === "issues" && (
              <div className="space-y-3">
                {issues.length === 0 && <p className="text-gray-400 text-center py-10">No open issues.</p>}
                {issues.map(issue => (
                  <div key={issue.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                    <div className="p-1.5 bg-red-50 rounded-lg mt-0.5">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-amber-600 transition-colors text-sm">
                        #{issue.number} {issue.title}
                      </a>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>by {issue.user?.login}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(issue.updated_at), { addSuffix: true })}</span>
                        {issue.labels?.map(l => (
                          <Badge key={l.id} variant="outline" className="text-xs" style={{ borderColor: `#${l.color}`, color: `#${l.color}` }}>{l.name}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}