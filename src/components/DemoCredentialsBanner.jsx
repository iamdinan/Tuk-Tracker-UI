import { useState } from "react";

const DEMO_ACCOUNTS = [
  {
    role: "Use credentials below for a preview",
    username: "dispatcher",
    password: "dispatch123",
  },
];

export default function DemoCredentialsBanner() {
  const [expanded, setExpanded] = useState(true);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-ops-amber text-ops-bg flex items-center justify-center shadow-lg hover:brightness-110 transition"
        aria-label="Show demo credentials"
      >
        <span className="mono text-sm font-bold">i</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72 bg-ops-panel border border-ops-line rounded-lg shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-ops-line">
        <h2 className="mono text-xs tracking-[0.15em] text-ops-amber">
          DEMO CREDENTIALS
        </h2>
        <button
          onClick={() => setExpanded(false)}
          className="text-ops-dim hover:text-ops-red mono text-sm leading-none"
          aria-label="Minimize"
        >
          ✕
        </button>
      </div>

      <div className="p-3 space-y-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <div
            key={acc.username}
            className="bg-ops-bg border border-ops-line rounded px-3 py-1.5 mono text-xs"
          >
            <div className="text-ops-dim mb-0.5">{acc.role.toUpperCase()}</div>
            <div className="text-white">
              {acc.username} <span className="text-ops-dim">/</span>{" "}
              {acc.password}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
