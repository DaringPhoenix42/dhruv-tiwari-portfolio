import * as THREE from "three";

const data = window.portfolioData;
const githubApi = `https://api.github.com/users/${data.githubUsername}`;
const reposApi = `${githubApi}/repos?sort=updated&per_page=6`;

const $ = (selector) => document.querySelector(selector);

function setExternalLinks() {
  $("#githubHeroLink").href = data.github;
  $("#githubProjectsLink").href = data.github;
  $("#linkedinHeroLink").href = data.linkedin;
  $("#currentRole").textContent = data.title;
  $("#currentCompany").textContent = data.experience[0]?.company || "Open to work";
  $("#year").textContent = new Date().getFullYear();

  const contacts = [
    ["Email", `mailto:${data.email}`, data.email],
    ["LinkedIn", data.linkedin, "linkedin.com/in/dhruv-tiwari-data"],
    ["GitHub", data.github, "github.com/DaringPhoenix"],
    ["Location", "#contact", data.location]
  ];

  $("#contactLinks").innerHTML = contacts
    .map(([label, href, value]) => `<a class="contact-pill" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}><span>${label}</span>${value}</a>`)
    .join("");
}

function renderExperience() {
  $("#experienceList").innerHTML = data.experience.map((item) => `
    <article class="timeline-item">
      <div class="timeline-date">${item.period}</div>
      <div class="timeline-body">
        <h3>${item.company}</h3>
        <p class="muted">${item.role} · ${item.location}</p>
        <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
      </div>
    </article>
  `).join("");
}

function renderEducation() {
  $("#educationGrid").innerHTML = data.education.map((item) => `
    <article class="education-card">
      <div class="education-result">${item.result}</div>
      <h3>${item.school}</h3>
      <p>${item.degree}</p>
      <span>${item.period}</span>
    </article>
  `).join("");
}

function renderExtracurricular() {
  $("#extracurricularGrid").innerHTML = data.extracurricular.map((item) => `
    <article class="activity-card">
      <span>${item.type}</span>
      <h3>${item.title}</h3>
      <p>${item.detail}</p>
    </article>
  `).join("");
}

function renderProjects(projects = data.projects) {
  $("#projectGrid").innerHTML = projects.map((project) => `
    <article class="project-card">
      <img src="${project.image}" alt="${project.name}" loading="lazy">
      <div class="project-body">
        <div class="project-topline">
          <h3>${project.name}</h3>
          <span>${project.date || "Recently updated"}</span>
        </div>
        <p class="stack">${project.stack || project.language || "Code project"}</p>
        <ul>${project.bullets.slice(0, 2).map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        ${project.url ? `<a class="inline-link" href="${project.url}" target="_blank" rel="noreferrer">Open repository</a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderSkills() {
  $("#skillsGrid").innerHTML = Object.entries(data.skills).map(([group, items]) => `
    <article class="skill-group">
      <h3>${group}</h3>
      <div>${items.map((item) => `<span>${item}</span>`).join("")}</div>
    </article>
  `).join("");
}

function repoToProject(repo) {
  const readableName = repo.name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return {
    name: readableName,
    stack: repo.language || "Public repository",
    date: new Date(repo.updated_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    url: repo.html_url,
    bullets: [
      repo.description || "A public GitHub project from the latest repository activity.",
      `${repo.stargazers_count} stars · ${repo.forks_count} forks · updated automatically from GitHub.`
    ]
  };
}

async function syncGithub() {
  const status = $("#syncStatus");

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(githubApi),
      fetch(reposApi)
    ]);

    if (!profileResponse.ok || !reposResponse.ok) {
      throw new Error("GitHub API request failed");
    }

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    const activeRepos = repos
      .filter((repo) => !repo.fork)
      .slice(0, 3)
      .map(repoToProject);

    $("#repoCount").textContent = profile.public_repos ? `${profile.public_repos} repos` : "Live";

    if (activeRepos.length) {
      renderProjects([...data.projects.slice(0, 2), ...activeRepos]);
    }

    status.textContent = `GitHub synced from @${data.githubUsername}. LinkedIn opens live from your public profile link. Resume details come from data.js.`;
  } catch (error) {
    $("#repoCount").textContent = "Offline";
    status.textContent = "GitHub live sync is unavailable right now, so the portfolio is using resume data from data.js.";
  }
}

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const ocean = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, "#123e7a");
  ocean.addColorStop(0.5, "#0a6a9f");
  ocean.addColorStop(1, "#082b58");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2f8f58";
  const continents = [
    [[170, 150], [225, 110], [300, 132], [328, 190], [292, 238], [220, 230], [158, 198]],
    [[270, 260], [318, 250], [348, 305], [330, 374], [288, 420], [248, 360]],
    [[445, 140], [540, 115], [630, 170], [660, 235], [604, 270], [510, 248], [430, 200]],
    [[535, 275], [615, 292], [700, 335], [680, 390], [582, 390], [512, 338]],
    [[725, 155], [828, 125], [920, 168], [895, 235], [790, 245], [710, 205]],
    [[805, 295], [905, 282], [956, 350], [900, 415], [812, 388]],
    [[90, 95], [150, 70], [202, 102], [165, 138], [105, 132]]
  ];

  continents.forEach((points) => {
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = "rgba(174, 214, 145, 0.45)";
  for (let i = 0; i < 52; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.ellipse(x, y, 18 + Math.random() * 28, 5 + Math.random() * 12, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";

  for (let i = 0; i < 92; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.ellipse(x, y, 24 + Math.random() * 52, 5 + Math.random() * 14, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function initScene() {
  const canvas = $("#space-scene");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 7.4);

  const earthGroup = new THREE.Group();
  earthGroup.position.set(3.35, 0.02, -1.2);
  scene.add(earthGroup);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.28, 96, 96),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.72,
      metalness: 0.02,
      emissive: 0x031225,
      emissiveIntensity: 0.18
    })
  );
  earth.rotation.set(0.08, -0.38, -0.08);
  earthGroup.add(earth);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.305, 96, 96),
    new THREE.MeshStandardMaterial({
      map: createCloudTexture(),
      transparent: true,
      opacity: 0.36,
      depthWrite: false
    })
  );
  earthGroup.add(clouds);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.38, 96, 96),
    new THREE.MeshBasicMaterial({
      color: 0x73d7ff,
      transparent: true,
      opacity: 0.11,
      side: THREE.BackSide
    })
  );
  earthGroup.add(atmosphere);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1300;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.016, transparent: true, opacity: 0.72 })
  );
  scene.add(stars);

  scene.add(new THREE.AmbientLight(0xbddfff, 0.36));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.65);
  keyLight.position.set(-3, 3, 5);
  scene.add(keyLight);
  const accentLight = new THREE.PointLight(0x4fb7ff, 1.8, 12);
  accentLight.position.set(3, -1, 2);
  scene.add(accentLight);
  const rimLight = new THREE.PointLight(0xffffff, 1.05, 10);
  rimLight.position.set(4, 2, 1);
  scene.add(rimLight);

  const pointer = new THREE.Vector2(0, 0);
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.8;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.8;
  });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    if (window.innerWidth <= 620) {
      earthGroup.position.set(1.65, 1.1, -2.35);
      earthGroup.scale.setScalar(0.72);
    } else if (window.innerWidth <= 920) {
      earthGroup.position.set(2.65, 0.48, -1.8);
      earthGroup.scale.setScalar(0.86);
    } else {
      earthGroup.position.set(3.35, 0.02, -1.2);
      earthGroup.scale.setScalar(1);
    }
  }

  window.addEventListener("resize", resize);
  resize();

  function animate(time) {
    const t = time * 0.001;
    earthGroup.rotation.y = pointer.x * 0.08;
    earthGroup.rotation.x = Math.sin(t * 0.26) * 0.035;
    earth.rotation.y = t * 0.08;
    clouds.rotation.y = t * 0.1;
    clouds.rotation.x = Math.sin(t * 0.18) * 0.025;
    atmosphere.rotation.y = t * 0.035;
    stars.rotation.y = t * 0.018;
    stars.rotation.x = pointer.y * 0.04;

    camera.position.x += (pointer.x - camera.position.x) * 0.018;
    camera.position.y += (0.6 - pointer.y * 0.35 - camera.position.y) * 0.018;
    camera.lookAt(0.2, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

setExternalLinks();
renderExperience();
renderEducation();
renderExtracurricular();
renderProjects();
renderSkills();
syncGithub();
initScene();
