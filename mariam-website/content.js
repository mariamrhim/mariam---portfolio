/*
 * EDIT YOUR WEBSITE HERE
 * Open this file with VS Code or Notepad. Keep quotation marks and commas.
 * Save, then refresh your browser. See README.md for full instructions.
 */
window.PORTFOLIO = {
  name: "Siti Mariam Binti Abdul Rahim",
  shortName: "Siti Mariam",
  email: "mariamrhim4@gmail.com",
  direction: "IT & Administration",
  introduction: "Exploring a career in IT and administration, with an open mind and a willingness to learn.",

  // To use your photo: place it in assets/ and change the path below.
  // Example: portrait: "assets/my-photo.jpg"
  portrait: "assets/portrait-placeholder.svg",
  portraitAlt: "Portrait space for Siti Mariam",

  about: [
    "I'm Siti Mariam Binti Abdul Rahim. I'm currently exploring opportunities in IT and administration, and discovering which direction feels right for me.",
    "This website is a place to introduce myself, document my work, and connect with people. It will develop alongside my experience."
  ],
  interests: ["Technology", "Organisation", "Learning"],

  // Only add real details. Empty lists are hidden automatically.
  education: [],
  // Example: { title: "Your qualification", detail: "Institution · Year" }
  experience: [],
  // Example: { title: "Your role", detail: "Organisation · Dates", description: "What you did." }

  // Optional social links. Leave empty to hide. No GitHub explorer is included.
  socialLinks: [
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/your-name" }
  ],

  // Optional PDF résumé: put the file in assets/ and fill the path.
  resume: "",
  // Example: resume: "assets/Mariam-Resume.pdf"

  projects: [
    {
      id: "personal-website",
      title: "A personal space, built to evolve.",
      category: "Website",
      year: "2026",
      status: "Personal project",
      summary: "A considered introduction, a home for future work, and an easy way to get in touch.",
      description: "My personal portfolio brings together an introduction, project notes, and a contact page. It is designed for phones, tablets, and larger screens, with a light and dark appearance and focused interactions.",
      details: ["Four separate pages", "Responsive layout", "Project search and saved items", "Email composer with a local draft"],
      image: "assets/project-website.svg",
      imageAlt: "Editorial preview of this personal website",
      url: "index.html",
      linkLabel: "Visit website"
    }
    // Add another object here, separated by a comma, for your next real project.
  ]
};
