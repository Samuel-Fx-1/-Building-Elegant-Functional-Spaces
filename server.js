const path = require("node:path");
const express = require("express");

const {
  site,
  navLinks,
  features,
  about,
  services,
  projects,
  process: designProcess,
  testimonials,
  awards,
  posts,
  serviceLinks,
} = require("./data/content");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.disable("x-powered-by");

app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d",
    etag: true,
  })
);

function activeNavFor(pathname) {
  const value = pathname.toLowerCase();

  if (value === "/") return "Home";
  if (value.startsWith("/about")) return "About";
  if (value.startsWith("/services")) return "Services";
  if (
    value.startsWith("/projects") ||
    value.startsWith("/project-page") ||
    value.startsWith("/projects-details")
  ) {
    return "Projects";
  }
  if (value.startsWith("/blog") || value.startsWith("/post")) return "Blog";
  if (value.startsWith("/contact")) return "Contact Me";

  return "";
}

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.navLinks = navLinks;
  res.locals.features = features;
  res.locals.about = about;
  res.locals.services = services;
  res.locals.projects = projects;
  res.locals.process = designProcess;
  res.locals.testimonials = testimonials;
  res.locals.awards = awards;
  res.locals.posts = posts;
  res.locals.serviceLinks = serviceLinks;
  res.locals.currentPath = req.path;
  res.locals.activeNav = activeNavFor(req.path);
  res.locals.query = req.query;
  next();
});

function findProject(slug) {
  const needle = String(slug).toLowerCase();

  return projects.find(
    (project) =>
      project.slug.toLowerCase() === needle ||
      project.legacySlug.toLowerCase() === needle
  );
}

function findPost(slug) {
  const needle = String(slug).toLowerCase();

  return posts.find(
    (post) =>
      post.slug.toLowerCase() === needle ||
      post.legacySlug.toLowerCase() === needle
  );
}

function renderNotFound(res) {
  return res.status(404).render("404", {
    pageTitle: "Page Not Found — Alex Smith",
    pageDescription:
      "The page you are looking for could not be found. Explore Alex Smith's architecture portfolio instead.",
    bodyClass: "page-404",
  });
}

function renderContact(res, options = {}) {
  return res.render("contact", {
    pageTitle: "Contact Me — Alex Smith",
    pageDescription:
      "Let's work together on your next residential or commercial architecture project. Get in touch with Alex Smith.",
    bodyClass: "page-contact",
    form: { name: "", email: "", phone: "", message: "" },
    errors: {},
    sent: false,
    ...options,
  });
}

app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: site.title,
    pageDescription: site.description,
    bodyClass: "page-home",
    featuredProjects: projects.slice(0, 4),
    latestPosts: posts.slice(0, 2),
  });
});

app.get(["/about", "/about-page"], (req, res) => {
  res.render("about", {
    pageTitle: "About — Alex Smith",
    pageDescription:
      "Learn about Alex Smith's architecture and interior design studio, awards, design process, and the team behind the work.",
    bodyClass: "page-about",
  });
});

app.get(["/services", "/services-page"], (req, res) => {
  res.render("services", {
    pageTitle: "Services — Alex Smith",
    pageDescription:
      "Architecture and design solutions, residential and commercial leasing, construction management, building management, and property valuation.",
    bodyClass: "page-services",
  });
});

app.get(["/projects", "/project-page"], (req, res) => {
  res.render("projects", {
    pageTitle: "Projects — Alex Smith",
    pageDescription:
      "Explore Alex Smith's featured residential and commercial architecture projects and the stories behind them.",
    bodyClass: "page-projects",
  });
});

app.get(["/projects/:slug", "/Projects-Details/:slug"], (req, res) => {
  const project = findProject(req.params.slug);

  if (!project) return renderNotFound(res);

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);

  return res.render("project-detail", {
    pageTitle: `${project.name} — Alex Smith`,
    pageDescription: project.excerpt,
    bodyClass: "page-project-detail",
    project,
    relatedProjects,
  });
});

app.get(["/blog", "/blog-page"], (req, res) => {
  res.render("blog", {
    pageTitle: "Blog — Alex Smith",
    pageDescription:
      "Insights, news, and property trends from architect Alex Smith — practical guidance for buying, selling, and designing a home.",
    bodyClass: "page-blog",
  });
});

app.get(["/blog/:slug", "/post/:slug"], (req, res) => {
  const post = findPost(req.params.slug);

  if (!post) return renderNotFound(res);

  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return res.render("post", {
    pageTitle: `${post.title} — Alex Smith`,
    pageDescription: post.excerpt,
    bodyClass: "page-post",
    post,
    relatedPosts,
  });
});

app.get(["/contact", "/contact-page"], (req, res) => {
  renderContact(res);
});

app.post(["/contact", "/contact-page"], (req, res) => {
  const form = {
    name: String(req.body.name || "").trim().slice(0, 120),
    email: String(req.body.email || "").trim().slice(0, 160),
    phone: String(req.body.phone || "").trim().slice(0, 40),
    message: String(req.body.message || "").trim().slice(0, 5000),
  };

  const errors = {};

  if (!form.name) errors.name = "Please enter your name.";
  if (!form.email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.message) {
    errors.message = "Please tell me a little about your project.";
  }

  if (Object.keys(errors).length > 0) {
    return renderContact(res.status(422), { form, errors, sent: false });
  }

  return renderContact(res, {
    form: { name: "", email: "", phone: "", message: "" },
    errors: {},
    sent: true,
  });
});

app.post("/newsletter", (req, res) => {
  const email = String(req.body.email || "").trim().slice(0, 160);
  const wantsJson = (req.get("accept") || "").includes("application/json");

  if (!EMAIL_PATTERN.test(email)) {
    if (wantsJson) {
      return res
        .status(400)
        .json({ ok: false, message: "Please enter a valid email address." });
    }

    return res.redirect(303, "/#newsletter");
  }

  if (wantsJson) {
    return res.json({
      ok: true,
      message: "You're on the list! Check your inbox for a welcome note.",
    });
  }

  let target = "/";
  const referer = req.get("referer");

  if (referer) {
    try {
      target = new URL(referer).pathname;
    } catch {
      target = "/";
    }
  }

  return res.redirect(303, `${target}?subscribed=1#newsletter`);
});

app.use((req, res) => renderNotFound(res));

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) return next(err);

  return res.status(500).render("500", {
    pageTitle: "Something Went Wrong — Alex Smith",
    pageDescription:
      "An unexpected error occurred. Please try again or head back to the homepage.",
    bodyClass: "page-error",
  });
});

app.listen(PORT, () => {
  console.log(`Alex Smith portfolio running at http://localhost:${PORT}`);
});
