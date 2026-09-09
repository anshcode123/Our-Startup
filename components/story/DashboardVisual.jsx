/**
 * Section 08 — Software. A generic business-software dashboard (NOT the
 * Institute SaaS) rendered inside <BrowserVisual>. Cards, a bar chart, and
 * two counters animate into place; see lib/animations/dashboardAnimation.js.
 */
const NAV_ITEMS = ["Home", "Projects", "Analytics", "Settings"];
const BARS = [40, 65, 30, 80, 55, 70, 45];

export default function DashboardVisual() {
  return (
    <div className="story-dashboard absolute inset-0 flex opacity-0">
      <div className="hidden w-32 flex-col gap-2 border-r border-white/10 bg-white/[0.02] p-3 text-[10px] text-white/40 sm:flex">
        {NAV_ITEMS.map((item, i) => (
          <span
            key={item}
            className={`story-dashboard-nav rounded px-2 py-1 ${
              i === 0 ? "bg-white/10 text-white/70" : ""
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="story-dashboard-card rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] text-white/40">Revenue</p>
            <p
              className="story-dashboard-number text-lg text-white"
              data-count-to="128"
            >
              0
            </p>
          </div>
          <div className="story-dashboard-card rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] text-white/40">Users</p>
            <p
              className="story-dashboard-number text-lg text-white"
              data-count-to="946"
            >
              0
            </p>
          </div>
        </div>
        <div className="story-dashboard-card flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-2 text-[10px] text-white/40">Recent activity</p>
          <div className="flex h-16 items-end gap-1.5">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="story-dashboard-bar w-3 origin-bottom scale-y-0 rounded-t bg-white/25"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
