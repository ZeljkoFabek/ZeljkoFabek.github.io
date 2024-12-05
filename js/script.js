// Pozovi funkciju prilikom učitavanja stranice
document.addEventListener('DOMContentLoaded', function() {
  loadProjects();
  setLanguage('en'); // Postavi zadani jezik
});

// Postavi kolačić
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Dohvati vrijednost kolačića
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(name + "=") === 0) {
      return c.substring(name.length + 1);
    }
  }
  return "";
}

// Dodavanje event listenera za učitavanje DOM-a
function loadProjects() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'json/projects.json', true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const projects = JSON.parse(xhr.responseText);
        const projectContainer = document.getElementById('project-container');

        if (projectContainer) {
          projectContainer.innerHTML = ''; // Očisti prethodni sadržaj

          // Generiraj projekte
          for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            var translation = project.translations[currentLanguage]; // Dohvati prijevod za trenutni jezik

            var colDiv = document.createElement('div');
            colDiv.className = 'col-sm-6 col-md-4';

            // Generiraj sadržaj kao link
            colDiv.innerHTML =
            '<a href="' + project.url + '" target="_blank" class="text-decoration-none">' + 
            '<div class="card">' +
            '<img src="' + project.image + '" class="card-img-top" alt="' + translation.title + '">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + translation.title + '</h5>' +
            '<p class="card-text">' + translation.description + '</p>' +
            '</div>' +
            '</div>' +
            '</a>';
          

            projectContainer.appendChild(colDiv);
          }
        } else {
          console.error('Error: project-container element not found.');
        }
      } catch (error) {
        console.error('Error parsing projects.json:', error);
      }
    } else if (xhr.readyState === 4) {
      console.error('Error loading projects.json:', xhr.status);
    }
  };

  xhr.send();
}

function setLanguage(language) {
  
  currentLanguage = language;         // Ažuriraj trenutni jezik
  setCookie('language', language, 7); // Pohrani jezik u kolačić na 7 dana

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `../lang/${language}.json`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const translations = JSON.parse(xhr.responseText);

        // Mijenjanje sadržaja na temelju prijevoda
        // Postavljanje prijevoda za elemente stranice
        if (document.getElementById('title')) {
          document.getElementById('title').textContent = translations.title;
        }

        if (document.getElementById('bio')) {
          document.getElementById('bio').textContent = translations.bio;
        }

        if (document.getElementById('about')) {
          document.getElementById('about').querySelector('h2').textContent = translations.about;
        }

        if (document.getElementById('about-content')) {
          document.getElementById('about-content').textContent = translations.aboutContent;
        }

        if (document.getElementById('projects')) {
          document.getElementById('projects').textContent = translations.projects;
        }

        if (document.getElementById('contact')) {
          document.getElementById('contact').querySelector('h2').textContent = translations.contact;
        }

        // Postavljanje prijevoda za formu
        const formTranslations = translations.form;
        if (formTranslations) {
          const nameLabel = document.querySelector("label[for='name']");
          const emailLabel = document.querySelector("label[for='email']");
          const messageLabel = document.querySelector("label[for='message']");
          const submitButton = document.querySelector("button[type='submit']");

          if (nameLabel) nameLabel.textContent = formTranslations.name;
          if (emailLabel) emailLabel.textContent = formTranslations.email;
          if (messageLabel) messageLabel.textContent = formTranslations.message;
          if (submitButton) submitButton.textContent = formTranslations.submit;

          const nameInput = document.getElementById('name');
          const emailInput = document.getElementById('email');
          const messageTextarea = document.getElementById('message');

          if (nameInput) nameInput.setAttribute('placeholder', formTranslations.namePlaceholder);
          if (emailInput) emailInput.setAttribute('placeholder', formTranslations.emailPlaceholder);
          if (messageTextarea) messageTextarea.setAttribute('placeholder', formTranslations.messagePlaceholder);
        }

        loadProjects();

      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else if (xhr.readyState === 4) {
      console.error('Error loading language file:', xhr.status);
    }
  };
  xhr.send();
}

