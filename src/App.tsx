import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

type ThemeMode = 'light' | 'system' | 'dark';

const githubUrl = 'https://github.com/temidayoxyz/workerdeck';
const deployUrl =
  'https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Ftemidayoxyz%2Fworkerdeck';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const capabilityRows = [
  {
    icon: 'solar:rocket-2-linear',
    title: 'Deployments',
    body: 'Git-backed production and preview releases, live build output, rollback, and cancellation.',
    meta: 'Workers Builds',
  },
  {
    icon: 'solar:key-square-2-linear',
    title: 'Environment',
    body: 'Build variables, masked secrets, and encrypted runtime values separated by environment.',
    meta: 'Scoped secrets',
  },
  {
    icon: 'solar:database-linear',
    title: 'Resources',
    body: 'Create and bind D1, KV, and R2 with every managed resource recorded in an ownership ledger.',
    meta: 'D1 · KV · R2',
  },
  {
    icon: 'solar:global-linear',
    title: 'Domains',
    body: 'Attach custom hostnames with conflict checks, certificate posture, and clear routing state.',
    meta: 'Routes · TLS',
  },
  {
    icon: 'solar:chart-2-linear',
    title: 'Observability',
    body: 'See account-scoped request volume, errors, latency, and build posture without leaving the workspace.',
    meta: 'Requests · Errors',
  },
  {
    icon: 'solar:history-linear',
    title: 'Recovery',
    body: 'Inspect deployment history and D1 recovery posture with dangerous operations kept deliberately guarded.',
    meta: 'Audit first',
  },
];

const questions = [
  {
    question: 'Where does WorkerDeck run?',
    answer:
      'Inside your Cloudflare account as one Worker with a D1 ownership ledger. The dashboard is served by that Worker, so there is no separate hosted control plane to trust.',
  },
  {
    question: 'Does WorkerDeck receive my provider credentials?',
    answer:
      'Your installation stores Cloudflare and GitHub credentials as encrypted Worker secrets. They are not sent to a WorkerDeck-hosted service, written to D1, or returned to the browser.',
  },
  {
    question: 'What happens when I push to GitHub?',
    answer:
      'Cloudflare Workers Builds checks out the connected repository, builds it outside the privileged control Worker, and creates a version. WorkerDeck tracks the release and its production or preview environment.',
  },
  {
    question: 'Can WorkerDeck deploy static applications?',
    answer:
      'Yes. Static sites can ship through Cloudflare Workers Static Assets, while full-stack and API projects deploy as Workers. WorkerDeck detects the repository configuration and keeps the deployment path visible.',
  },
  {
    question: 'Is it ready for every destructive operation?',
    answer:
      'Not yet. WorkerDeck is an early release candidate. Destructive D1 restore and automatic managed-resource deletion remain intentionally unavailable until they are recoverable and binding-aware.',
  },
];

function resolveTheme(mode: ThemeMode) {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem('workerdeck-site-theme');
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      document.documentElement.dataset.themeMode = theme;
      document.documentElement.dataset.theme = resolveTheme(theme);
    };

    applyTheme();
    window.localStorage.setItem('workerdeck-site-theme', theme);
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('reveal-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) =>
      observer.observe(element),
    );
    return () => {
      observer.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText('npx workerdeck install');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="WorkerDeck home" onClick={closeMenu}>
          <img src={assetUrl('workerdeck-mark.svg')} alt="" />
          <span>Worker<span>Deck</span></span>
        </a>

        <nav
          className={menuOpen ? 'site-nav is-open' : 'site-nav'}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          <a href="#product" onClick={closeMenu}>Product</a>
          <a href="#workflow" onClick={closeMenu}>Workflow</a>
          <a href="#security" onClick={closeMenu}>Security</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <div className="theme-switcher theme-switcher--mobile" aria-label="Mobile color theme">
            {(['light', 'system', 'dark'] as const).map((mode) => (
              <button
                className={theme === mode ? 'is-active' : ''}
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                aria-pressed={theme === mode}
                aria-label={`${mode[0].toUpperCase()}${mode.slice(1)} theme`}
              >
                <Icon
                  icon={
                    mode === 'light'
                      ? 'solar:sun-2-linear'
                      : mode === 'dark'
                        ? 'solar:moon-stars-linear'
                        : 'solar:laptop-minimalistic-linear'
                  }
                />
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="header-actions">
          <div className="theme-switcher theme-switcher--desktop" aria-label="Color theme">
            {(['light', 'system', 'dark'] as const).map((mode) => (
              <button
                className={theme === mode ? 'is-active' : ''}
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                aria-pressed={theme === mode}
                aria-label={`${mode[0].toUpperCase()}${mode.slice(1)} theme`}
                title={`${mode[0].toUpperCase()}${mode.slice(1)} theme`}
              >
                <Icon
                  icon={
                    mode === 'light'
                      ? 'solar:sun-2-linear'
                      : mode === 'dark'
                        ? 'solar:moon-stars-linear'
                        : 'solar:laptop-minimalistic-linear'
                  }
                />
                <span>{mode}</span>
              </button>
            ))}
          </div>
          <a className="button button--quiet header-github" href={githubUrl} target="_blank" rel="noreferrer">
            <Icon icon="simple-icons:github" />
            <span>GitHub</span>
          </a>
          <a className="button button--primary header-deploy" href={deployUrl} target="_blank" rel="noreferrer">
            Deploy
            <Icon icon="solar:arrow-right-up-linear" />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon icon={menuOpen ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear'} />
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy" data-reveal>
            <div className="eyebrow"><span /> Self-hosted on Cloudflare</div>
            <h1>Ship to the edge.<br /><em>Keep the keys.</em></h1>
            <p className="hero-lede">
              WorkerDeck is the operating surface for your Cloudflare applications—deployments,
              resources, domains, environments, and recovery in one account you control.
            </p>
            <div className="hero-actions">
              <a className="button button--primary button--large" href={deployUrl} target="_blank" rel="noreferrer">
                <Icon icon="simple-icons:cloudflare" />
                Deploy to Cloudflare
                <Icon icon="solar:arrow-right-linear" />
              </a>
              <a className="button button--quiet button--large" href={githubUrl} target="_blank" rel="noreferrer">
                <Icon icon="simple-icons:github" />
                Explore the source
              </a>
            </div>
            <div className="trust-line" aria-label="WorkerDeck characteristics">
              <span><Icon icon="solar:shield-check-linear" /> Access-protected</span>
              <span><Icon icon="solar:server-square-cloud-linear" /> Runs in your account</span>
              <span><Icon icon="solar:code-circle-linear" /> Apache 2.0</span>
            </div>
          </div>

          <div className="hero-instrument" data-reveal>
            <div className="instrument-topline">
              <div className="instrument-path">
                <span className="status-beacon" />
                northstar-web
                <span>/</span>
                production
              </div>
              <div className="instrument-status">Ready</div>
            </div>
            <div className="commit-line">
              <span className="mono">f71c9a2</span>
              <span>Refine onboarding copy and metadata</span>
              <span className="commit-time">11 min ago</span>
            </div>
            <div className="deployment-rail">
              <div className="rail-line"><span /></div>
              {[
                ['solar:branching-paths-down-linear', 'Source', 'main'],
                ['solar:code-square-linear', 'Build', 'build_2901'],
                ['solar:layers-minimalistic-linear', 'Version', 'version_84'],
                ['solar:global-linear', 'Traffic', '100%'],
              ].map(([icon, label, value]) => (
                <div className="rail-step" key={label}>
                  <div className="rail-node"><Icon icon={icon} /></div>
                  <strong>{label}</strong>
                  <span className="mono">{value}</span>
                </div>
              ))}
            </div>
            <div className="instrument-foot">
              <div><span className="live-dot" /> Production traffic is healthy</div>
              <a href={`${githubUrl}/blob/main/docs/deployment-operations.md`} target="_blank" rel="noreferrer">
                Inspect the release <Icon icon="solar:arrow-right-linear" />
              </a>
            </div>
          </div>
        </section>

        <section className="signal-bar" aria-label="Core architecture">
          <div><strong>1</strong><span>control Worker</span></div>
          <div><strong>1</strong><span>D1 ownership ledger</span></div>
          <div><strong>0</strong><span>provider keys in the browser</span></div>
          <div className="signal-note"><span className="live-dot" /> Your account remains the source of truth</div>
        </section>

        <section className="section section--product" id="product">
          <div className="section-heading" data-reveal>
            <div>
              <div className="eyebrow"><span /> The control surface</div>
              <h2>Everything operational.<br />Nothing abstracted away.</h2>
            </div>
            <p>
              WorkerDeck brings the work you already do across Cloudflare and GitHub into one coherent
              view. It adds context and safeguards without becoming another infrastructure owner.
            </p>
          </div>

          <div className="capability-ledger" data-reveal>
            {capabilityRows.map((item) => (
              <article className="capability-row" key={item.title}>
                <div className="capability-icon"><Icon icon={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="capability-meta mono">{item.meta}</span>
                <Icon className="capability-arrow" icon="solar:arrow-right-linear" />
              </article>
            ))}
          </div>
        </section>

        <section className="section cockpit-section">
          <div className="cockpit-frame" data-reveal>
            <div className="window-bar">
              <div className="window-dots"><i /><i /><i /></div>
              <div className="window-address"><Icon icon="solar:lock-keyhole-minimalistic-linear" /> workerdeck.your-domain.com</div>
              <span className="window-live"><span className="live-dot" /> Connected</span>
            </div>
            <img
              src={assetUrl('dashboard.jpg')}
              alt="WorkerDeck dashboard showing application deployments, resources, and account health"
              loading="lazy"
            />
          </div>
          <div className="cockpit-caption" data-reveal>
            <div>
              <span className="mono">CONTROL / WITHOUT CUSTODY</span>
              <h2>Your infrastructure, shown clearly.</h2>
            </div>
            <p>
              See what is live, what changed, and what WorkerDeck owns before you touch production.
              Light and dark modes keep the interface legible from daytime planning to late-night response.
            </p>
          </div>
        </section>

        <section className="section workflow-section" id="workflow">
          <div className="workflow-copy" data-reveal>
            <div className="eyebrow"><span /> Repository to release</div>
            <h2>One push.<br />One accountable trail.</h2>
            <p>
              Connect a GitHub repository once. Cloudflare Builds handles untrusted code away from the
              privileged control plane, while WorkerDeck records the release and keeps promotion explicit.
            </p>
            <a className="text-link" href={`${githubUrl}/blob/main/docs/architecture.md`} target="_blank" rel="noreferrer">
              Read the architecture <Icon icon="solar:arrow-right-up-linear" />
            </a>
          </div>

          <div className="workflow-map" data-reveal>
            <div className="flow-origin">
              <Icon icon="simple-icons:github" />
              <div><strong>Repository</strong><span className="mono">main · f71c9a2</span></div>
            </div>
            <div className="flow-route"><span>push</span></div>
            <div className="flow-build">
              <Icon icon="simple-icons:cloudflare" />
              <div><strong>Workers Builds</strong><span>isolated build</span></div>
              <span className="flow-state">42s</span>
            </div>
            <div className="flow-route flow-route--cyan"><span>version</span></div>
            <div className="flow-global">
              <div className="orbit"><i /><i /><i /><Icon icon="solar:global-linear" /></div>
              <strong>Global</strong>
              <span>production traffic</span>
            </div>
          </div>
        </section>

        <section className="section security-section" id="security">
          <div className="security-heading" data-reveal>
            <div className="security-mark"><Icon icon="solar:shield-keyhole-linear" /></div>
            <div>
              <div className="eyebrow"><span /> Security is the architecture</div>
              <h2>The control plane keeps its distance.</h2>
            </div>
            <p>
              Repository code never executes inside WorkerDeck’s privileged Worker. Credentials stay
              encrypted, mutations are origin-checked and runtime-validated, and ownership is verified
              before infrastructure changes.
            </p>
          </div>
          <div className="security-grid" data-reveal>
            <div><Icon icon="solar:user-check-rounded-linear" /><strong>Cloudflare Access</strong><span>Production identity is validated from signed Access JWTs.</span></div>
            <div><Icon icon="solar:key-minimalistic-square-2-linear" /><strong>Encrypted secrets</strong><span>Provider credentials never enter D1 records or browser responses.</span></div>
            <div><Icon icon="solar:document-add-linear" /><strong>Append-only audit</strong><span>Privileged actions leave an accountable operational history.</span></div>
            <div><Icon icon="solar:lock-keyhole-minimalistic-linear" /><strong>Ownership checks</strong><span>Untracked resources are never silently adopted or mutated.</span></div>
          </div>
          <a className="button button--inverted" href={`${githubUrl}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">
            Review the security model <Icon icon="solar:arrow-right-up-linear" />
          </a>
        </section>

        <section className="section install-section">
          <div className="install-card" data-reveal>
            <div className="install-copy">
              <div className="eyebrow"><span /> Choose your entry point</div>
              <h2>From empty account to operational workspace.</h2>
              <p>
                Use Cloudflare’s guided deploy flow, or bootstrap from a trusted checkout when you want
                to inspect every generated value before the first mutation.
              </p>
              <div className="install-actions">
                <a className="button button--primary button--large" href={deployUrl} target="_blank" rel="noreferrer">
                  <Icon icon="simple-icons:cloudflare" /> Deploy with Cloudflare
                </a>
                <a className="text-link" href={`${githubUrl}/blob/main/docs/installation.md`} target="_blank" rel="noreferrer">
                  Installation guide <Icon icon="solar:arrow-right-up-linear" />
                </a>
              </div>
            </div>
            <div className="terminal-card" aria-label="WorkerDeck installation command">
              <div className="terminal-head"><span>trusted checkout</span><i /><i /></div>
              <div className="terminal-line"><span>$</span><code>npx workerdeck install</code></div>
              <div className="terminal-output">
                <span><Icon icon="solar:check-circle-linear" /> verify account access</span>
                <span><Icon icon="solar:check-circle-linear" /> create ownership ledger</span>
                <span><Icon icon="solar:check-circle-linear" /> encrypt Worker secrets</span>
              </div>
              <button className="copy-command" type="button" onClick={copyInstall}>
                <Icon icon={copied ? 'solar:check-read-linear' : 'solar:copy-linear'} />
                {copied ? 'Copied' : 'Copy command'}
              </button>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="faq-heading" data-reveal>
            <div className="eyebrow"><span /> Straight answers</div>
            <h2>Before you deploy.</h2>
            <p>WorkerDeck is open about what it owns, what it protects, and what remains intentionally guarded.</p>
          </div>
          <div className="faq-list" data-reveal>
            {questions.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}<Icon icon="solar:add-circle-linear" /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" data-reveal>
          <div className="final-globe" aria-hidden="true"><Icon icon="solar:global-linear" /><i /><i /></div>
          <div>
            <span className="mono">YOUR CLOUDFLARE ACCOUNT</span>
            <h2>Take the better view.</h2>
            <p>Deploy WorkerDeck where your infrastructure already lives.</p>
          </div>
          <a className="button button--primary button--large" href={deployUrl} target="_blank" rel="noreferrer">
            Deploy WorkerDeck <Icon icon="solar:arrow-right-linear" />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top" aria-label="WorkerDeck home">
          <img src={assetUrl('workerdeck-mark.svg')} alt="" />
          <span>Worker<span>Deck</span></span>
        </a>
        <p>Independent open-source software. Not affiliated with or endorsed by Cloudflare.</p>
        <div className="footer-links">
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`${githubUrl}/blob/main/docs/installation.md`} target="_blank" rel="noreferrer">Docs</a>
          <a href={`${githubUrl}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">Security</a>
          <a href={`${githubUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">Apache 2.0</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
