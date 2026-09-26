/* ==========================================================================
   KARTHICK K — PORTFOLIO INTERACTIVE ENGINE (script.js)
   Features:
   - Interactive Infrastructure Node Visualizer Canvas
   - Count-Up Animated Metrics Observer
   - Recruiter CLI Diagnostic Terminal
   - Real-Time Technical Skills Filter & Search
   - Experience Timeline Interactions
   - Project Architecture Modal Viewer
   - Digital Resume Modal Previewer
   - Toast Notification & Contact Helpers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNodeCanvas();
  initCountUpMetrics();
  initSkillsFilter();
  initTerminal();
  initModals();
  initContactForm();
  initScrollAnimations();
});

/* ---------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   --------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Drawer Toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        if (mobileDrawer.classList.contains('open')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) lucide.createIcons();
      }
    });

    // Close drawer when link clicked
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* ---------------------------------------------------------
   2. HERO INFRASTRUCTURE NODE VISUALIZER (CANVAS)
   --------------------------------------------------------- */
function initNodeCanvas() {
  const canvas = document.getElementById('nodeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Nodes definition
  const nodes = [
    { id: 'core', label: 'KARTHICK CORE', x: 0.5, y: 0.5, type: 'core', radius: 24, status: 'ONLINE', ping: '1ms' },
    { id: 'fw1', label: 'FortiGate / pfSense', x: 0.22, y: 0.28, type: 'firewall', radius: 16, status: 'ENFORCED', ping: '2ms' },
    { id: 'azure', label: 'Azure Cloud & Entra', x: 0.78, y: 0.25, type: 'cloud', radius: 18, status: 'SYNCHRONIZED', ping: '12ms' },
    { id: 'ztna', label: 'Netbird ZTNA', x: 0.18, y: 0.72, type: 'security', radius: 15, status: 'ZERO TRUST', ping: '4ms' },
    { id: 'zabbix', label: 'Zabbix & Technitium', x: 0.5, y: 0.85, type: 'monitoring', radius: 16, status: '99.99% UPTIME', ping: '1ms' },
    { id: 'ad', label: 'Active Directory', x: 0.82, y: 0.75, type: 'server', radius: 16, status: 'HARDENED', ping: '3ms' },
    { id: 'vault', label: 'Passbolt Vault', x: 0.5, y: 0.18, type: 'security', radius: 14, status: 'ENCRYPTED', ping: '1ms' }
  ];

  // Connections between nodes
  const connections = [
    { from: 'core', to: 'fw1' },
    { from: 'core', to: 'azure' },
    { from: 'core', to: 'ztna' },
    { from: 'core', to: 'zabbix' },
    { from: 'core', to: 'ad' },
    { from: 'core', to: 'vault' },
    { from: 'fw1', to: 'ztna' },
    { from: 'azure', to: 'ad' },
    { from: 'zabbix', to: 'fw1' }
  ];

  // Data packets
  const packets = [];
  connections.forEach((conn, idx) => {
    for (let i = 0; i < 2; i++) {
      packets.push({
        from: conn.from,
        to: conn.to,
        progress: (i * 0.5 + idx * 0.1) % 1,
        speed: 0.004 + Math.random() * 0.003
      });
    }
  });

  let hoveredNode = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hoveredNode = null;
    nodes.forEach(node => {
      const nx = node.x * width;
      const ny = node.y * height;
      const dist = Math.hypot(mouseX - nx, mouseY - ny);
      if (dist < node.radius + 8) {
        hoveredNode = node;
      }
    });

    // Update HUD indicator if node hovered
    const hudNodeName = document.getElementById('hudNodeName');
    const hudPing = document.getElementById('hudPing');
    if (hudNodeName && hudPing && hoveredNode) {
      hudNodeName.textContent = hoveredNode.label;
      hudPing.textContent = `${hoveredNode.status} (${hoveredNode.ping})`;
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    connections.forEach(conn => {
      const nodeA = nodes.find(n => n.id === conn.from);
      const nodeB = nodes.find(n => n.id === conn.to);
      if (!nodeA || !nodeB) return;

      const ax = nodeA.x * width;
      const ay = nodeA.y * height;
      const bx = nodeB.x * width;
      const by = nodeB.y * height;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = 'rgba(38, 50, 70, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw data packets
    packets.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;

      const nodeA = nodes.find(n => n.id === p.from);
      const nodeB = nodes.find(n => n.id === p.to);
      if (!nodeA || !nodeB) return;

      const ax = nodeA.x * width;
      const ay = nodeA.y * height;
      const bx = nodeB.x * width;
      const by = nodeB.y * height;

      const px = ax + (bx - ax) * p.progress;
      const py = ay + (by - ay) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#35D9FF';
      ctx.shadowColor = '#35D9FF';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    nodes.forEach(node => {
      const nx = node.x * width;
      const ny = node.y * height;
      const isHovered = hoveredNode === node;

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(nx, ny, isHovered ? node.radius + 6 : node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'core' 
        ? 'rgba(53, 217, 255, 0.15)' 
        : 'rgba(21, 30, 46, 0.85)';
      ctx.strokeStyle = isHovered ? '#42E6C4' : (node.type === 'core' ? '#35D9FF' : '#263246');
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.fill();
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(nx, ny, 4, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'core' ? '#35D9FF' : '#42E6C4';
      ctx.fill();

      // Label text
      ctx.font = `${isHovered ? 'bold 11px' : '10px'} "JetBrains Mono", monospace`;
      ctx.fillStyle = isHovered ? '#F5F7FA' : '#A5B1C2';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + node.radius + 16);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ---------------------------------------------------------
   3. COUNT-UP ANIMATED METRICS
   --------------------------------------------------------- */
function initCountUpMetrics() {
  const metricCards = document.querySelectorAll('.metric-value');
  if (!metricCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetRaw = el.getAttribute('data-target');
        if (targetRaw) {
          animateValue(el, targetRaw);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  metricCards.forEach(card => observer.observe(card));

  function animateValue(el, rawVal) {
    // Check type of value (e.g. "99.2%", "₹55.9L+", "97.65%", "1,641", "250+", "0")
    if (rawVal.includes('%')) {
      const num = parseFloat(rawVal);
      let current = 0;
      const step = num / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= num) {
          el.textContent = rawVal;
          clearInterval(timer);
        } else {
          el.textContent = current.toFixed(1) + '%';
        }
      }, 30);
    } else if (rawVal.includes('₹')) {
      // e.g. ₹55.9L+
      el.textContent = rawVal;
    } else if (rawVal.includes(',')) {
      // e.g. 1,641
      let current = 0;
      const target = 1641;
      const step = 41;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = '1,641';
          clearInterval(timer);
        } else {
          el.textContent = current.toLocaleString();
        }
      }, 25);
    } else if (rawVal.includes('+')) {
      const target = parseInt(rawVal);
      let current = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = current + '+';
        }
      }, 30);
    } else {
      el.textContent = rawVal;
    }
  }
}

/* ---------------------------------------------------------
   4. TECHNICAL EXPERTISE FILTER & SEARCH
   --------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('skillsSearch');
  const cards = document.querySelectorAll('.expertise-category-card');

  if (!cards.length) return;

  function filterSkills() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const textContent = card.textContent.toLowerCase();

      const matchesFilter = (activeFilter === 'all') || (category === activeFilter);
      const matchesSearch = !query || textContent.includes(query);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterSkills);
  }
}

/* ---------------------------------------------------------
   5. RECRUITER CLI DIAGNOSTIC TERMINAL
   --------------------------------------------------------- */
function initTerminal() {
  const body = document.getElementById('terminalBody');
  const input = document.getElementById('terminalInput');
  const quickBtns = document.querySelectorAll('.term-btn');

  if (!body || !input) return;

  const commands = {
    help: () => `
<span class="cmd-highlight">AVAILABLE COMMANDS:</span>
  <span class="cmd-prompt">whoami</span>       - Display engineer identity & summary
  <span class="cmd-prompt">status</span>       - Infrastructure reliability & uptime state
  <span class="cmd-prompt">ping</span>         - Test core infrastructure network latencies
  <span class="cmd-prompt">skills</span>       - List top enterprise security & IT stack
  <span class="cmd-prompt">metrics</span>      - Display key verified business impact figures
  <span class="cmd-prompt">projects</span>     - List selected infrastructure initiatives
  <span class="cmd-prompt">resume</span>       - Launch interactive resume viewer
  <span class="cmd-prompt">contact</span>      - Output verified contact channels
  <span class="cmd-prompt">clear</span>        - Clear terminal screen
    `,
    whoami: () => `
<span class="cmd-success">KARTHICK K</span> - Senior IT Infrastructure & Security Engineer
Location: Bengaluru, Karnataka, India
Experience: 6+ Years (Enterprise Systems, Firewalls, Cloud & SecOps)
Summary: Infrastructure engineer specializing in resilient enterprise environments, network protection, zero-trust access, and cost optimization.
    `,
    status: () => `
[SYSTEM STATUS TELEMETRY REPORT]
  ● Enterprise Infrastructure Uptime : <span class="cmd-success">99.2% – 100.0%</span>
  ● Support SLA Compliance           : <span class="cmd-success">97.65%</span>
  ● Managed Assets (Snipe-IT)         : <span class="cmd-success">1,641 Nodes</span>
  ● Firewall & ZTNA Guard            : <span class="cmd-success">ENFORCED (FortiGate, pfSense, Netbird)</span>
  ● Reported Security Breaches       : <span class="cmd-success">ZERO (0)</span>
  ● Systems Operational State        : <span class="cmd-success">ALL SYSTEMS OPTIMAL</span>
    `,
    ping: () => `
PING gateway.asteria.internal (10.10.0.1): 56 data bytes
64 bytes from 10.10.0.1: icmp_seq=1 ttl=64 time=1.24 ms
64 bytes from 10.10.0.1: icmp_seq=2 ttl=64 time=1.08 ms
64 bytes from 10.10.0.1: icmp_seq=3 ttl=64 time=1.15 ms
--- gateway.asteria.internal ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max = 1.08/1.15/1.24 ms [LATENCY OPTIMAL]
    `,
    skills: () => `
<span class="cmd-highlight">PRIMARY TECHNICAL STACK:</span>
  • Network & Security : FortiGate, pfSense, IPSec VPN, SD-WAN, VLANs, Netbird ZTNA
  • Endpoint & SecOps  : SEQRITE EDR/XDR, OpenVAS, Nmap, VAPT, Group Policy
  • Systems & Cloud    : Linux (Ubuntu), Windows Server, Active Directory, Azure, Entra ID
  • Ops & Monitoring   : Zabbix 7.0, Technitium DNS, Snipe-IT, Passbolt, Proxmox VE, TrueNAS
    `,
    metrics: () => `
<span class="cmd-highlight">VERIFIED CAREER IMPACT:</span>
  • ₹55.9 Lakh+ Verified Infrastructure Cost Savings
  • 99.2%–100% Multi-Year Infrastructure Uptime
  • 1,641 Enterprise Assets Under Active Governance
  • 250+ Monthly Support Tickets Resolved at Tier 2/3
  • ₹1.90 Crore Annual IT Budget Management
    `,
    projects: () => `
1. Enterprise Network Security & Zero Trust Access
2. Infrastructure Monitoring & Observability (Zabbix & Technitium)
3. Enterprise Endpoint Security (SEQRITE EDR/XDR)
4. Infrastructure Cost Optimization (Proxmox & Hardware Reuse)
5. IT Asset Governance (Snipe-IT 1,641 Assets)
    `,
    contact: () => `
Email    : karthisysadm@gmail.com
Phone    : +91 80567 47586
Location : Bengaluru, Karnataka, India
    `,
    resume: () => {
      openResumeModal();
      return `Opening digital resume previewer...`;
    },
    clear: () => {
      body.innerHTML = '';
      return null;
    }
  };

  function executeCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    const line = document.createElement('div');
    line.className = 'terminal-output-line';
    line.innerHTML = `<span class="cmd-prompt">karthick@infra-sec:~$</span> ${cmd}`;
    body.appendChild(line);

    if (cleanCmd === '') return;

    if (commands[cleanCmd]) {
      const output = commands[cleanCmd]();
      if (output) {
        const outLine = document.createElement('div');
        outLine.className = 'terminal-output-line';
        outLine.innerHTML = output;
        body.appendChild(outLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-output-line';
      errLine.innerHTML = `<span style="color:#FF5F56;">Command not found: '${cmd}'. Type <span class="cmd-prompt">help</span> for available options.</span>`;
      body.appendChild(errLine);
    }

    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd) executeCommand(cmd);
    });
  });
}

/* ---------------------------------------------------------
   6. MODAL SYSTEM (PROJECTS & RESUME)
   --------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modalOverlay || !modalBody || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(htmlContent) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  if (modalOverlay && modalBody) {
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global helper to open project modal
window.openProjectModal = function(projectId) {
  const projectsData = {
    p1: {
      title: "Enterprise Network Security & Zero Trust Access",
      tag: "Network & Security",
      desc: "Comprehensive redesign and deployment of enterprise edge firewalls, multi-site IPSec VPN tunnels, VLAN isolation, and Netbird Zero Trust Network Access.",
      tech: ["pfSense", "FortiGate", "IPSec VPN", "VLAN", "Netbird ZTNA"],
      challenge: "Resolving IP range conflicts between corporate headquarters in Bengaluru and branch office in Gurugram, eliminating DHCP/DNS bottlenecks, and establishing secure remote worker access.",
      solution: "Implemented pfSense and FortiGate HA pairs, established Site-to-Site IPSec VPN with full subnet re-addressing, segmented internal departments via 802.1Q VLANs, and deployed Netbird ZTNA for identity-aware zero-trust user access.",
      impact: "Zero security breaches maintained throughout tenure, zero IP address conflicts, and seamless secure interconnectivity across geographically distributed teams."
    },
    p2: {
      title: "Infrastructure Monitoring & Observability Pipeline",
      tag: "Observability & DNS",
      desc: "Deployment of an enterprise observability stack using Zabbix 7.0, Technitium HA DNS failover cluster, and Nginx reverse proxy.",
      tech: ["Zabbix", "Technitium DNS", "Nginx", "PostgreSQL", "Linux"],
      challenge: "Lack of centralized visibility across multi-site servers, firewalls, and network nodes leading to reactive incident resolution.",
      solution: "Configured Zabbix monitoring agents across 1,600+ network endpoints with automated trigger alerts, deployed Technitium DNS failover clustering for high-availability internal name resolution, and fronted internal web services with Nginx HA reverse proxy.",
      impact: "Sustained 99.2%–100% infrastructure uptime across FY26 review cycles with proactive threat and telemetry detection."
    },
    p3: {
      title: "Enterprise Endpoint Protection & SecOps Hardening",
      tag: "Endpoint & Security",
      desc: "Deployment of centralized Endpoint Detection & Response (EDR/XDR) combined with Active Directory Group Policy security hardening.",
      tech: ["SEQRITE EDR", "SEQRITE XDR", "Group Policy", "AppLocker", "BitLocker"],
      challenge: "Standardizing security posture and ransomware defense across hundreds of remote and on-premise workstations.",
      solution: "Rolled out SEQRITE EDR/XDR across enterprise endpoints, enforced full-disk BitLocker encryption, locked down execution permissions via AppLocker, and established GPO baseline security templates.",
      impact: "Complete endpoint visibility, 0 malware/ransomware infection incidents, and 100% compliance with corporate security governance."
    },
    p4: {
      title: "Infrastructure Cost Optimization & Virtualization",
      tag: "Cost Optimization",
      desc: "Multi-phase infrastructure audit, hardware reuse program, and hypervisor consolidation across enterprise virtualization platforms.",
      tech: ["Proxmox VE", "VMware", "Hyper-V", "TrueNAS", "SAN Storage"],
      challenge: "Escalating hardware procurement costs and underutilized legacy server infrastructure.",
      solution: "Audited existing infrastructure assets, migrated legacy standalone servers to Proxmox VE hypervisor cluster, redeployed decommissioned enterprise hardware for non-critical workloads, and optimized ISP bandwidth redundancy contracts.",
      impact: "Delivered ₹55.9 Lakh+ in verified cumulative cost savings, including ₹5 Lakh in hardware reuse and ₹50,000 in annual recurring ISP redundancy savings."
    },
    p5: {
      title: "Enterprise IT Asset Governance & Vault Centralization",
      tag: "Asset Governance",
      desc: "Implementation of automated IT asset lifecycle management using Snipe-IT and self-hosted Passbolt enterprise password vault.",
      tech: ["Snipe-IT", "Passbolt", "Active Directory", "PostgreSQL", "Docker"],
      challenge: "Untracked hardware assets and unencrypted credential sharing across technical teams creating security compliance risks.",
      solution: "Deployed Snipe-IT with barcode scanning integration, mapped 1,641 hardware and software assets to Active Directory users, and introduced Passbolt zero-knowledge password vault with role-based access control.",
      impact: "1,641 IT assets brought under strict governance, 100% audit readiness, and elimination of plain-text credential sharing."
    },
    p6: {
      title: "Hybrid Cloud Disaster Recovery & Business Continuity",
      tag: "Cloud & Resilience",
      desc: "Building a hybrid on-premises and Microsoft Azure backup & disaster recovery architecture.",
      tech: ["Microsoft Azure", "TrueNAS", "Hyper-V", "Bash", "PowerShell"],
      challenge: "Ensuring business continuity and zero data loss for critical business applications and enterprise data stores.",
      solution: "Configured automated off-site immutable backup sync from TrueNAS storage pools to Microsoft Azure Blob Storage, created automated disaster recovery failover runbooks, and tested quarterly recovery exercises.",
      impact: "Sub-1-hour Recovery Time Objective (RTO) and Recovery Point Objective (RPO) of <15 minutes."
    }
  };

  const project = projectsData[projectId];
  if (!project) return;

  const modalHtml = `
    <div style="margin-bottom:1.5rem;">
      <span class="section-tag" style="margin-bottom:0.5rem;">${project.tag}</span>
      <h2 style="font-size:1.8rem; margin-top:0.5rem; margin-bottom:1rem; color:var(--text-primary);">${project.title}</h2>
      <p style="font-size:1rem; color:var(--text-secondary); line-height:1.6;">${project.desc}</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
      <div style="background:var(--bg-surface); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-slate);">
        <h4 style="color:var(--accent-cyan); font-size:0.85rem; font-family:var(--font-mono); margin-bottom:0.5rem;">THE CHALLENGE</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">${project.challenge}</p>
      </div>
      <div style="background:var(--bg-surface); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-slate);">
        <h4 style="color:var(--accent-teal); font-size:0.85rem; font-family:var(--font-mono); margin-bottom:0.5rem;">THE SOLUTION</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">${project.solution}</p>
      </div>
    </div>

    <div style="background:rgba(53, 217, 255, 0.08); border:1px solid rgba(53, 217, 255, 0.25); padding:1.25rem; border-radius:var(--radius-sm); margin-bottom:1.5rem;">
      <h4 style="color:var(--accent-cyan); font-size:0.85rem; font-family:var(--font-mono); margin-bottom:0.4rem;">VERIFIED BUSINESS IMPACT</h4>
      <p style="font-size:1rem; font-weight:600; color:var(--text-primary);">${project.impact}</p>
    </div>

    <div>
      <h4 style="font-size:0.85rem; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:0.5rem;">TECHNOLOGY STACK USED:</h4>
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        ${project.tech.map(t => `<span class="skill-tag" style="color:var(--accent-cyan); border-color:rgba(53,217,255,0.3);">${t}</span>`).join('')}
      </div>
    </div>
  `;

  openModal(modalHtml);
};

// Global helper to open resume modal
window.openResumeModal = function() {
  const resumeHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-slate); padding-bottom:1rem; margin-bottom:1.5rem;">
      <div>
        <h2 style="font-size:1.6rem; color:var(--text-primary); margin-bottom:0.25rem;">KARTHICK K</h2>
        <p style="font-family:var(--font-mono); font-size:0.85rem; color:var(--accent-cyan);">Senior IT Infrastructure & Security Engineer</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.print()">
        <i data-lucide="printer"></i> Print / Save PDF
      </button>
    </div>

    <div style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6; display:flex; flex-direction:column; gap:1.25rem;">
      <div>
        <h4 style="color:var(--accent-teal); font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.4rem;">PROFESSIONAL SUMMARY</h4>
        <p>Security-focused IT Infrastructure and Security Engineer with 6+ years of experience building, securing, monitoring, and optimizing enterprise IT environments across aerospace, manufacturing, and tech operations. Proven track record in maintaining 99.2%–100% infrastructure uptime, delivering ₹55.9L+ verified cost savings, and enforcing zero-trust network security.</p>
      </div>

      <div>
        <h4 style="color:var(--accent-teal); font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.4rem;">WORK EXPERIENCE HIGHLIGHTS</h4>
        <ul style="list-style:disc; padding-left:1.25rem;">
          <li><strong>Asteria Aerospace Limited (Senior Engineer I & II):</strong> Managed ₹1.90 Cr annual IT budget, maintained 99.2%–100% uptime, governance over 1,641 assets, deployed Zabbix & Technitium HA DNS, SEQRITE EDR/XDR, pfSense/FortiGate firewalls, Netbird ZTNA, and zero security breaches.</li>
          <li><strong>Tussor Machine Tools India:</strong> System Administrator — Windows Server, Active Directory, OpenVAS, SD-WAN, Proxmox VE, TrueNAS.</li>
          <li><strong>ScribeEMR & Focus Edumatics:</strong> Tier 2/3 IT engineering, LAN/WAN security, backups, user access control.</li>
        </ul>
      </div>

      <div>
        <h4 style="color:var(--accent-teal); font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.4rem;">CERTIFICATIONS & EDUCATION</h4>
        <p>• CCNA, MCSA, AWS, VAPT, SOC Analyst Bootcamp (Prompt Infotech 2025)<br>• B.Tech in Information Technology — J.K.K. Munirajah College of Technology (2012–2016)</p>
      </div>

      <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">
        📍 Location: Bengaluru, Karnataka, India | ✉ Email: karthisysadm@gmail.com | 📞 Phone: +91 80567 47586
      </div>
    </div>
  `;

  openModal(resumeHtml);
};

/* ---------------------------------------------------------
   7. CONTACT FORM & TOAST UTILITIES
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.', 'warning');
      return;
    }

    // Trigger standard mailto action as robust client-side handler
    const mailtoUrl = `mailto:karthisysadm@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
    window.location.href = mailtoUrl;

    showToast('✉️ Opening your email client to send message...', 'success');
    form.reset();
  });
}

// Toast helper
window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Copy helper
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`📋 Copied ${label} to clipboard!`, 'success');
  }).catch(() => {
    showToast(`Failed to copy ${label}`, 'warning');
  });
};

/* ---------------------------------------------------------
   8. SCROLL REVEAL ANIMATIONS
   --------------------------------------------------------- */
function initScrollAnimations() {
  const revealEls = document.querySelectorAll('.glass-card, .section-header, .timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}
